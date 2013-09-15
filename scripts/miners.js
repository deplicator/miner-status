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
    collective5s: function () {
        var self = this;
        result = 0;
        this.each(function (miner) {
            result += parseInt(miner.attributes[miner.attributes.objId]['MHS 5s'], 10);
        });
        return result
    },
    initialize: function () {
        this.updateAll(3000);
    }
});

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
