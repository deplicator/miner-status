/**
 * Model for block data.
 */
BlockData = Backbone.Model.extend({
    defaults: {
        //finalblock: 6929999 + 1,
        //blocksuntilfinish: 0,
        endofblockchain: 0,
        currentblock: 0,
        blocksuntilchange: 0
        
    },
    blockstodifficultychange: function () {
        var cb = this.get("currentblock");
        var eb = this.get("endofblockchain");
        this.set("blocksuntilchange", parseInt(eb) - parseInt(cb));
    },
    blockstopayoutfinish: function () {
        var cb = this.get("currentblock");
        var fb = this.get("finalblock");
        this.set("blocksuntilfinish", parseInt(fb) - parseInt(cb));
    },
    update: function () {
        this.fetch();
        this.blockstodifficultychange();
        //this.blockstopayoutfinish();
    },
    updateAuto: function (interval) {
        var self = this;
        this.update();
        this.updating = setInterval(function () {
            self.update();
        }, interval);
    },
    updatePause: function () {
        clearInterval(this.updating);
    },
    urlRoot: "scripts/blockdata.php",
    url: function () {
        return this.urlRoot + '?';
    },
    initialize: function () {
        this.updateAuto(3000);
    }
});

/**
 * Display for block data.
 */
var DisplayBlockData = Backbone.View.extend({
    render: function () {
        var self = this;
        var modelasjson = this.model.toJSON();
        _.each(modelasjson, function (val, key) {
            self.$el.find("#" + key + ' .value').html(val);
        });
        $("#main").append(self.$el);
    },
    initialize: function () {
        var self = this;
        var modelasjson = this.model.toJSON();
        
        this.$el.attr("id", "blockdata");
        this.$el.append('<ul></ul>');
        this.$el.find("ul").append('<li id="endofblockchain"><span class="key">Last Block in Chain:</span><span class="value"></span></ul>');
        this.$el.find("ul").append('<li id="currentblock"><span class="key">Current Block:</span><span class="value"></span></ul>');
        this.$el.find("ul").append('<li id="blocksuntilchange"><span class="key">Blocks Until Difficulty Change:</span><span class="value"></span></ul>');

        this.listenTo(this.model, "change", this.render);
        this.render();
    }
}) 



















