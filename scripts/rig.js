/**
 * Model for mining rig statistics.
 */
var Rig = Backbone.Model.extend({
    defaults: {
        lastUpdated: '',
        updateCount: 0
    },
    update: function () {
        // this.set('lastUpdated', Date.now());
        // currentCount = this.get('updateCount');
        // this.set('updateCount', currentCount + 1);
        this.fetch();
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
    urlRoot: "scripts/bfgapi.php",
    url: function () {
        return this.urlRoot + '?rpc=summary';
    },
    initialize: function () {
        //this.updateAuto(3000);
    }
});

/**
 * Display for rig.
 */
var DisplayRig = Backbone.View.extend({
    render: function () {
        var self = this;
        var modelasjson = this.model.toJSON();
        $('#summary').children().each(function () {
            $(this).remove();
        });
        this.$el.children('ul').append('<h2>SUMMARY</h2>');
        _.each(modelasjson['SUMMARY'], function (val, key) {
            self.$el.children('ul').append('<li><div class="key">' + key + ':</div><div class="value">' + val +'</div></li>');
        });
        $("#main").append(self.$el);
    },
    initialize: function () {
        this.$el.append('<ul id="summary" class="rig"></ul>');
        this.listenTo(this.model, 'change', this.render);
        this.render();
    }
})