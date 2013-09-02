$(document).ready(function () {

    Backbone.emulateHTTP = true;
    Backbone.emulateJSON = true;

    var Miner = Backbone.Model.extend({
        initialize: function () {
            this.on('all', function (e) {
                console.log("event: " + e);
            });
        },
        urlRoot: "bfgapi.php",
        url: function () {
            console.log(this.urlRoot + '?rpc=' + this.get('devId'));
            return this.urlRoot + '?rpc=' + this.get('devId');
        }
    });
    
    
    var MinerCollection = Backbone.Collection.extend({
        initialize: function () {
            this.on('all', function (e) {
                console.log("Miners event: " + e);
            });
            
        },
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
        }
    });
    
    Miners = new MinerCollection;
    Miners.pollDevices();
    
    ShowStats = Backbone.View.extend({
        model: Miner,
        initialize: function () {
            
        }
    });
    
    MinerView = new ShowStats;
});
