/*****************************/
/*
/*   JQuery Event Timeline
/*
/*****************************/
var JQueryEventTimeline = function(data){
    this.data = data;
    return this;
};

JQueryEventTimeline.prototype.plotEvents = function() {
    var columnWidth = this.getColumnWidthPercentage(),
        eventsHtmlArray = this.prepareEvents()
        topRow = [],
        bottomRow = [];

    // Debug Output
    // console.log('Start: ' + this.getStartDate(), 'End: ' + this.getEndDate() );
    // console.log('Total Days: ' + this.getTotalDays() );
    // console.log('Column Width: '+ this.getColumnWidthPercentage() + '%' );
    // console.log('Months: ' + this.getMonthLabels() );

    // Sort events into timeline rows
    eventsHtmlArray.forEach( function( item ) {
        if ( item.indexOf('row="0"') > -1 ) {
            topRow.push(item);
        } else {
            bottomRow.push(item);
        }
    } );

    // Append timeline events to DOM
    $('#events-timeline').html( '<div class="timeline-row">' + topRow.join('') + '</div><div class="timeline-row">' + bottomRow.join('') + '</div>' );

    var monthsArray = this.getMonthLabels(),
        htmlMonthsList = [];

    // Timeline Months
    monthsArray.forEach( function(item) {
        htmlMonthsList.push( '<li>' + item + '</li>' );
    } );

    // Append months to DOM
    $('#timeline-months').html( htmlMonthsList ).find('li').css('width', 100 / monthsArray.length + '%');

    // Position Elements
    this.positionElements();
};

JQueryEventTimeline.prototype.prepareEvents = function() {
    var items = [],
        that = this;

    // Grab all start dates
    this.data.forEach( function ( item ) {
        items.push( that.prepareEvent( item ) );
    });

    return items;
};

JQueryEventTimeline.prototype.prepareEvent = function( item ) {
    var htmlDomElement = '';
        eventStartDate = item.startDate ? new Date( item.startDate.substr(0,4), item.startDate.substr(4,2) - 1, item.startDate.substr(6,2) ) : undefined,
        eventEndDate = item.endDate ? new Date( item.endDate.substr(0,4), item.endDate.substr(4,2) - 1, item.endDate.substr(6,2) ) : undefined,
        attributes = [
            'data-left-pos="' + this.getNumberOfDaysBetween( this.getStartDate(), eventStartDate ) + '"',
            'data-event-index="' + item.eventIndex + '"',
            'data-event-name="' + item.eventName + '"',
            'data-event-dates="' + this.formatDateString( eventStartDate, eventEndDate ) + '"',
            'data-row="' + item.row + '"',
        ];

    // Determine if event is a single day event
    if ( eventEndDate === undefined ) {
        attributes.push('data-span-cols="1"');
        attributes.push('data-single-day="1"');
    } else {
        attributes.push('data-span-cols="' + this.getNumberOfDaysBetween( eventStartDate, eventEndDate ) + '"');
    }

    htmlDomElement = '<div class="event-item" ' + attributes.join(' ') + '></div>';

    return htmlDomElement;
};

JQueryEventTimeline.prototype.getNumberOfDaysBetween = function( startDate, endDate ) {
    var oneDay = 24*60*60*1000, // hours*minutes*seconds*milliseconds
        totalDays = Math.round( Math.abs( ( startDate.getTime() - endDate.getTime() ) / ( oneDay ) ) ); // Number of days between two dates

    return totalDays;
};

JQueryEventTimeline.prototype.formatDateString = function( startDate, endDate ) {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    var dateString = days[ startDate.getDay() ] + ', ' + months[ startDate.getMonth() ] + ' ' + startDate.getDate();

    if ( ( endDate != undefined  && endDate.getFullYear() != startDate.getFullYear() ) || ( endDate === undefined ) ) {
        dateString += ', ' + startDate.getFullYear();
    }

    if ( endDate != undefined ) {
        dateString += ' - ' + days[ startDate.getDay() ] + ', ' + months[ endDate.getMonth() ] + ' ' + endDate.getDate() + ', ' + endDate.getFullYear();
    }

    return dateString;
};

JQueryEventTimeline.prototype.getTotalMonths = function() {
    return this.totalMonths || this.calculateTotalMonths();
};

JQueryEventTimeline.prototype.calculateTotalMonths = function() {
    var totalMonths,
        startMonth =this.getStartDate().getMonth(),
        endMonth = this.getEndDate().getMonth();

    if ( startMonth < endMonth ) {
        totalMonths = ( endMonth ) - ( startMonth );
    } else {
        totalMonths = ( 12 - startMonth ) + endMonth;
    }

    return totalMonths;
};

JQueryEventTimeline.prototype.getMonthLabels = function() {
    return this.monthLabels || this.parseMonthLabels();
};

JQueryEventTimeline.prototype.parseMonthLabels = function() {
    var months = [],
        currentMonth = this.getStartDate().getMonth(),
        monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
            "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

    for (var i = this.getTotalMonths(); i >= 0; i--) {
        months.push( monthNames[currentMonth] );

        if ( currentMonth >= 11 ) {
            currentMonth = 0;
        } else {
            currentMonth += 1;
        }
    }

    return months;
};

JQueryEventTimeline.prototype.getTotalDays = function() {
    return this.totalDays || this.calculateTotalDays();
};

JQueryEventTimeline.prototype.setTotalDays = function( days ) {
    this.totalDays = days;
};

JQueryEventTimeline.prototype.getDaysInMonth = function( month, year ) {
    return new Date(year, month+1, 0).getDate();
};

JQueryEventTimeline.prototype.calculateTotalDays = function( ) {
    var oneDay = 24*60*60*1000, // hours*minutes*seconds*milliseconds
        firstDate = new Date( this.getStartDate().getFullYear(), this.getStartDate().getMonth(), 1 ), // (startDate year, startDate month, 1)
        secondDate = new Date ( this.getEndDate().getFullYear(), this.getEndDate().getMonth(), this.getDaysInMonth( this.getEndDate().getMonth(), this.getEndDate().getFullYear() ) ), // (endDate year, endDate month, last of of endDate month)
        totalDays = Math.round( Math.abs( ( firstDate.getTime() - secondDate.getTime() ) / ( oneDay ) ) ); // Number of days between two dates

    this.setTotalDays( totalDays );

    return totalDays;
};

JQueryEventTimeline.prototype.getColumnWidthPercentage = function() {
    return this.columnWidthPercentage || this.calculateColumnWidthPercentage();
};

JQueryEventTimeline.prototype.calculateColumnWidthPercentage = function(data) {
    return 100 / this.getTotalDays();
};

JQueryEventTimeline.prototype.getStartDate = function() {
    return this.startDate || this.calculateEndpoints( "start" );
};

JQueryEventTimeline.prototype.setStartDate = function( date ) {
    this.startDate = date;
};

JQueryEventTimeline.prototype.getEndDate = function() {
    return this.endDate || this.calculateEndpoints( "end" );
};

JQueryEventTimeline.prototype.setEndDate = function( date ) {
    this.endDate = date;
};

JQueryEventTimeline.prototype.calculateEndpoints = function( location ) {
    var dates = [],
        locationValue;

    // Grab all start dates
    this.data.forEach( function (item) {

        // dates.push( item.startDate, item.endDate );
        if ( item.startDate != undefined ) {
            dates.push( item.startDate );
        }

        if ( item.endDate != undefined ) {
            dates.push( item.endDate );
        }

    });

    // Sort Dates Array
    dates.sort(function(a, b) {
        return parseFloat(a) - parseFloat(b);
    });

    // Store values
    var startDate = dates[0],
        endDate = dates[dates.length-1];

    this.setStartDate( new Date( startDate.substr(0, 4),  startDate.substr(4, 2) - 1, startDate.substr(6, 2) ) );
    this.setEndDate( new Date( endDate.substr(0, 4),  endDate.substr(4, 2) - 1, endDate.substr(6, 2) ) );

    // Return
    if ( location === "start" ) {
        locationValue = this.getStartDate();
    }

    if ( location === "end" ) {
        locationValue = this.getEndDate();
    }

    return locationValue || false;
};

JQueryEventTimeline.prototype.positionElements = function() {
    var $this = this;
    $('#events-timeline').find('.timeline-row').each( function( index, element ){
        $this.positionRowElements( $( this ) );
    });
};

JQueryEventTimeline.prototype.positionRowElements = function($row) {
    var that = this;
    $row.find('div').each( function( index, element ){
        var $this = $(this),
            width = undefined;

        if (parseInt($this.attr('data-single-day')) == 1) {
            $this.addClass('single-day');
            width = '24px';
        } else {
            width = parseInt($this.attr('data-span-cols')) * that.getColumnWidthPercentage() + 3 + '%';
        }

        $this.css({
            position: 'absolute',
            top: 0,
            height: '24px',
            left: parseInt($this.attr('data-left-pos')) * that.getColumnWidthPercentage() + 3 + '%',
            width: width
        });

    });
};

