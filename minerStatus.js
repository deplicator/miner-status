$(document).ready(function () {

	/**
	 * Individual miner model used for each device that is mining.
	 */
    Miner = Backbone.Model.extend({
        urlRoot: "bfgapi.php",
        url: function () {
            return this.urlRoot + '?rpc=' + this.get('devId');
        },
		initialize: function () {

		}
    });
    
    /**
	 * Collection of all miners.
	 */
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
		initialize: function () {
			this.pollDevices();
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
			$('#' + stuff).remove();
			this.$el.html('<ul id="' + stuff + '" class="miner">');
			temp = this.$el
			_.each(modelasjson[stuff], function (val, key) {
				temp.children().append('<li>' + key + ' - ' + val +'</li>');
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
