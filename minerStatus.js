$(document).ready(function () {

    Backbone.emulateHTTP = true;
    Backbone.emulateJSON = true;

    var Miner = Backbone.Model.extend({
        urlRoot: "bfgapi.php",
        url: function () {
            console.log(this.urlRoot + '?rpc=' + this.get('devId'));
            return this.urlRoot + '?rpc=' + this.get('devId');
        },
		initialize: function () {
            this.on('all', function (e) {
                console.log("Miner event: " + e);
            });
        }
    });
    
    
    var MinerCollection = Backbone.Collection.extend({
        model: Miner,
        pollDevices: function () {
            $.ajax({
                type: 'get',
                datatype: 'json',
                url: 'bfgapi.php?rpc=devdetail',
                success: function (data) {
                    var devId = _(data).chain().omit('STATUS').keys().each(function (e) {
                        var parsed = e.slice(0,3).toLowerCase() + '|' + e.slice(3);
                        Miners.create({
                            devId: parsed,
                            objId: e
                        });
                    });
                }
            });
        },
		startUpdating: function(interval) {
			this.going = setInterval(this.pollDevices, interval)
		},
		pauseUpdating: function () {
			clearInterval(this.going);
		},
		initialize: function () {
            this.on('all', function (e) {
                console.log("MinerCollection event: " + e);
            });
			this.pollDevices();
			//this.startUpdating(3000);
        }
    });
    
    Miners = new MinerCollection;

	/**
	 * Display status for single miner.
	 */
	DisplayMiner = Backbone.View.extend({
		render: function () {
			modelasjson = this.model.toJSON();
			stuff = modelasjson.objId;
			temp = this.$el
			_.each(modelasjson[stuff], function (val, key) {
				temp.append('<li>' + key + ' - ' + val +'</li>');
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
        initialize: function () {
			this.listenTo(Miners, 'add', this.addMiner);
			this.render();
        }
    });
    
	//Start application.
    app = new PrimaryDisplay;
});
