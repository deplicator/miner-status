/**
 * Model for block data.
 */
BlockData = Backbone.Model.extend({
    defaults: {
        currentdifficulty: 0,
        currentend: 0,
        currentblock: 0,
        blocksuntilchange: 0,
        
        estimateddifficulty: 0,
        estimatedtime: 0,
    },
    blockstodifficultychange: function () {
        var cb = this.get("currentblock");
        var eb = this.get("currentend");
        this.set("blocksuntilchange", parseInt(eb) - parseInt(cb));
    },
    update: function () {
        this.fetch();
        this.blockstodifficultychange();
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
    formatNumber: function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatTime: function (seconds) {
        now = Date.now();
        milliseconds = parseInt(seconds) * 1000;
        then = new Date(now + parseInt(milliseconds));

        return then.getFullYear() + "-" + (parseInt(then.getMonth(), 10) + 1) + "-" + then.getDate() + " " + then.getHours() + ":" + then.getMinutes();
    },
    render: function () {
        var self = this;
        var modelasjson = this.model.toJSON();
        _.each(modelasjson, function (val, key) {
            if (self.$el.find("#" + key).hasClass("time")) {
                self.$el.find("#" + key + " .value").html('<a title="' + val + '">' + self.formatTime((val)) + '</a>');
            } else {
                if (val < 1000000) {
                    self.$el.find("#" + key + " .value").html(self.formatNumber(Math.round(val)));
                } else {
                    var newval = val / 1000000;
                    self.$el.find("#" + key + " .value").html(Math.round(newval * 10) / 10 + " mil");
                }
            }
        });
        $("#main").append(self.$el);
    },
    initialize: function () {
        var self = this;
        var modelasjson = this.model.toJSON();
        
        this.$el.attr("id", "blockdata");
        this.$el.append("<h2>blockdata</h2>");
        
        this.$el.append("<div id=\"chain\"></div>");
        this.$el.find("#chain").append("<h3>Curent Chain</h3>");
        this.$el.find("#chain").append('<div id="currentdifficulty"><span class="key">Difficulty:</span><span class="value"></span></div>');
        this.$el.find("#chain").append('<div id="currentend"><span class="key">End Block:</span><span class="value"></span></div>');
        this.$el.find("#chain").append('<div id="currentblock"><span class="key">Current Block:</span><span class="value"></span></div>');
        this.$el.find("#chain").append('<div id="blocksuntilchange"><span class="key">Remaining:</span><span class="value"></span></div>');
        
        this.$el.append("<div id=\"estimates\"></div>");
        this.$el.find("#estimates").append("<h3>Estimates</h3>");
        this.$el.find("#estimates").append('<div id="estimateddifficulty"><span class="key">Next Difficulty:</span><span class="value"></span></div>');
        this.$el.find("#estimates").append('<div id="estimatedtime" class="time"><span class="key">Time to next:</span><span class="value"></span></div>');

        this.listenTo(this.model, "change", this.render);
        this.render();
    }
}) 



















