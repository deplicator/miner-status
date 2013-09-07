/**
 * Model for mining rig statistics.
 */
Rig = Backbone.Model.extend({
    defaults: {
        lastUpdated: '',
        updateCount: 0
    },
    update: function () {
        this.set('lastUpdated', Date.now());
        currentCount = this.get('updateCount');
        this.set('updateCount', ++currentCount);
        this.fetch();
    },
    updateAuto: function (interval) {
        var self = this;
        this.updating = setInterval(function () {
            self.update();
        }, interval);
    },
    updatePause: function () {
        clearInterval(this.updating);
    },
    urlRoot: "scripts/bfgapi.php",
    url: function () {
        return this.urlRoot + '?rpc=summary';
    },
    initialize: function () {
        this.updateAuto(3000);
    }
});

/**
 * Model of minier statistics.
 */
var Miner = Backbone.Model.extend({
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
        this.fetch();
    },
    urlRoot: "scripts/bfgapi.php",
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
            url: 'scripts/bfgapi.php?rpc=devdetail',
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
    updateAll: function (interval) {
        var self = this;
        this.updating = setInterval(function () {
            self.each(function (e) {
                e.update();
            });
        }, interval);
    },
    updatePause: function () {
        clearInterval(this.updating);
    },
    initialize: function () {
        this.updateAll(3000);
    }
});

/**
 * Display for rig.
 */
var DisplayRig = Backbone.View.extend({
    render: function () {
        var self = this;
        modelasjson = this.model.toJSON();
        $('#summary li').each().remove();
        this.$el.html('<ul id="summary" class="rig">');
        var temp = this.$el
        _.each(modelasjson['SUMMARY'], function (val, key) {
            temp.children().append('<li><div class="key">' + key + ':</div><div class="value">' + val +'</div></li>');
        });
        $("#main").append(self.$el.html());
    },
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    }
})

/**
 * Display status for single miner.
 */
var DisplayMiner = Backbone.View.extend({
    render: function () {
        var self = this;
        var modelasjson = this.model.toJSON();
        var id = modelasjson.objId;
        $('#' + id).remove();
        this.$el.html('<ul id="' + id + '" class="miner">');
        var temp = this.$el
        temp.children().append(modelasjson.lastUpdated);
        _.each(modelasjson[id], function (val, key) {
            temp.children().append('<li><div class="key">' + key + ':</div><div class="value">' + val +'</div></li>');
        });
        $("#main").append(self.$el.html());
    },
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    }
});

/**
 * Main application display.
 */
var PrimaryDisplay = Backbone.View.extend({
    addMiner: function(minermodel) {
        var newMiner = new DisplayMiner({model: minermodel});
    },
    render: function () {
        $('#main').show();
    },
    updateFrequency: function (interval) {
        Miners.updateAll(interval);
    },
    updatePause: function () {
        Miners.updatePause();
    },
    initialize: function () {
        MiningRig = new DisplayRig({model: new Rig()});
        
        var Miners = new MinerCollection();
        this.listenTo(Miners, 'add', this.addMiner);
        Miners.createAll();
        this.render();
    }
});

// Get this party started.
$(document).ready(function () {
    app = new PrimaryDisplay;
});

















