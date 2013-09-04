Rig = Backbone.Model.extend({
	urlRoot: "bfgapi.php",
	url: function () {
		return this.urlRoot + '?rpc=summary';
	},
	initialize: function () {
		console.log("rig init")
	}
});

/**
 * Model of minier statistics.
 */
Miner = Backbone.Model.extend({
	defaults: {
		urlId: 'n/a',
		objId: 'n/a',
		lastUpdated: '',
		updateCount: 0
	},
	update: function () {
		this.set('lastUpdated', Date.now());
		currentCount = this.get('updateCount');
		this.set('updateCount', ++currentCount);
	},
	urlRoot: "bfgapi.php",
	url: function () {
		return this.urlRoot + '?rpc=' + this.get('urlId');
	},
	initialize: function () {
		var id = this.get('urlId');
		var unparsed = id.slice(0,3).toUpperCase() + id.slice(4);
		this.set('objId', unparsed);
		this.update();
	}
});
   
/**
 * Collection of all miners.
*/
var MinerCollection = Backbone.Collection.extend({
	model: Miner,
	devices: function () {
		var deviceList = []
		$.ajax({
			async: false,
			type: 'get',
			datatype: 'json',
			url: 'bfgapi.php?rpc=devdetail',
			success: function (data) {
				_(data).chain().omit('STATUS').keys().each(function (id) {
					var parsed = id.slice(0,3).toLowerCase() + '|' + id.slice(3);
					deviceList.push(parsed);
				});
			}
		});
		return deviceList;
	},
	createAll: function () {		
		var self = this;
		var dev = this.devices();
		dev.forEach(function (id) { 
			self.create({
				urlId: id
			});
		});
	},
	updateAll: function () {
		this.each(function (e) {
			e.fetch();
			e.update();
		});
	},
	initialize: function () {
		var self = this;
		going = setInterval(function () {
			self.updateAll()
		}, 3000);
	}
});

/**
 * Display status for single miner.
 */
DisplayMiner = Backbone.View.extend({
	render: function () {
		modelasjson = this.model.toJSON();
		var id = modelasjson.objId;
		$('#' + id).remove();
		this.$el.html('<ul id="' + id + '" class="miner">');
		temp = this.$el
		temp.children().append(modelasjson.lastUpdated);
		_.each(modelasjson[id], function (val, key) {
			temp.children().append('<li><div class="key">' + key + ':</div><div class="value">' + val +'</div></li>');
		});
		$("#main").append(newMiner.$el.html());
	},
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	}
});

/**
 * Main application display.
 */
PrimaryDisplay = Backbone.View.extend({
	addMiner: function(minermodel) {
		newMiner = new DisplayMiner({model: minermodel});
	},
	render: function () {
		$('#main').show();
	},
	updateFrequency: function (interval) {
		setInterval(Miners.updateAll, 3000);
	},
	initialize: function () {
		Miners = new MinerCollection();
		this.listenTo(Miners, 'add', this.addMiner);
		Miners.createAll();
		this.render();
	}
});

// Get this party started.
$(document).ready(function () {
    app = new PrimaryDisplay;
});

















