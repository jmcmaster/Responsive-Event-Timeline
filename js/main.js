(function ($, root, undefined) {
    $(function () {

        'use strict';

        if ( $('#events-timeline').length ) {
            timelineGraph.init();
            timelineEvents.init();
        }
    });
})(jQuery, this);

/*
   Timeline Events
*/
var timelineEvents = {
    init: function() {
        timelineEvents.tooltips();
        timelineEvents.navigation();
    },
    updateInfo: function(index) {
        var $info = $('.event-information-item[data-event-index="'+index+'"]');
        var $item = $('.event-item');

        $item.removeClass('active');
        $('.event-item[data-event-index="'+index+'"]').addClass('active');

        $('.event-information-item').removeClass('active');
        $info.addClass('active');
    },
    navigation: function() {
        var $item = $('.event-item');

        $item.on('click', _.throttle(function(e) {
            e.preventDefault();
            var $this = $(this);
            var index = $this.attr('data-event-index');

            if (index == 5) {
                $('.event-navigation.right').addClass('empty');
                $('.event-navigation.left').removeClass('empty');
            } else if (index == 0) {
                $('.event-navigation.right').removeClass('empty');
                $('.event-navigation.left').addClass('empty');
            } else {
                $('.event-navigation.right').removeClass('empty');
                $('.event-navigation.left').removeClass('empty');
            }

            timelineEvents.updateInfo(index);
        }, 150));
    },
    tooltips: function() {
        $('.event-item').each(function( index, element ) {
            var $this = $(this);
            var event_index = $this.attr('data-event-index');
            $('.event-item[data-event-index="'+event_index+'"]').tooltipster({
                content: $('<h1>'+$('.event-item[data-event-index="'+event_index+'"]').attr('data-event-name')+'</h1><p>'+$('.event-item[data-event-index="'+event_index+'"]').attr('data-event-dates')+'</p>' ),
            });
        });
    }
};

/*
   Timeline Graph
*/
var timelineGraph = {
    init: function() {
        var data = timelineGraph.getEvents(),
            timeline = new JQueryEventTimeline( data );

        timeline.plotEvents();

        $('.event-item[data-event-index="0"]').addClass('active');
        $('.event-information-item[data-event-index="0"]').addClass('active');
    },

    getEvents: function() {
        var data = [];

        $('.event-information-item').each(function(index) {
            var $this = $(this),
                event = {};

            event.eventIndex = $this.attr('data-event-index');
            event.eventName = $this.attr('data-event-name');
            event.row = $this.attr('data-timeline-row') == 'top' ? 0 : 1;
            event.startDate = $this.attr('data-event-start-date') ? timelineGraph.formatDate( $this.attr('data-event-start-date') ) : undefined;
            event.endDate = $this.attr('data-event-end-date') ? timelineGraph.formatDate( $this.attr('data-event-end-date') ) : undefined;

            data.push( event );
        });

        return data;
    },

    formatDate: function(date) {
        if ( date === undefined || date == "" ) {
            return undefined;
        }

        var dateArray = date.split("/");

        return dateArray[2] + dateArray[0] + dateArray[1];
    }
};
