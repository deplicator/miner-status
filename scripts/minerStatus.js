require.config({
  paths: {
    'jquery':     '../lib/jquery-2.0.3',
    'underscore': '../lib/underscore-1.5.1',
    'backbone':   '../lib/backbone-1.0.0',
    'rig':        'rig',
    'miners':     'miners'
  }
});

define(['jquery', 'underscore', 'backbone', 'rig', 'miners'], function() {

    /**
     * Main application display.
     */
    var PrimaryDisplay = Backbone.View.extend({
        events: {
            'click #pause' : 'updatePauseButton'
        },
        addMiner: function(minermodel) {
            var newMiner = new DisplayMiner({model: minermodel});
        },
        render: function () {
            $('#main').show();
            $('#error').hide();
        },
        updateFrequency: function (interval) {
            MiningRig.model.updateAuto(interval);
            Miners.updateAll(interval);
        },
        updatePause: function () {
            MiningRig.model.updatePause();
            Miners.updatePause();
        },
        updatePauseButton: function () {
            if ($('#pause').val() === 'pause updating') {
                this.updatePause();
                $('#pause').val('resume updating');
            } else {
                this.updateFrequency(3000);
                $('#pause').val('pause updating');
            }
            
        },
        initialize: function () {
            $('#main').append('<input id="pause" type="button" value="pause updating">');

            MiningRig = new DisplayRig({model: new Rig()});
            Miners = new MinerCollection();
            
            this.listenTo(Miners, 'add', this.addMiner);
            
            Miners.createAll();
            this.render();
        }
    });


    // Get this party started.
    $(document).ready(function () {
        start = new PrimaryDisplay({el: $("#main")});
    });

});