var $ = jQuery;
var OVERLAY_ID = 'ocrx-overlay';
var SIDEBAR_ID = 'ocrx-sidebar';
var fieldMap = {};
//var fieldMap = {"#fullName":"#ocrx-full-name","#shipping_address1":"#ocrx-street1","#shipping_address2":"#ocrx-street2","#shipping_city":"#ocrx-city","#shipping_state":"#ocrx-state","#shipping_zip":"#ocrx-zip","#ccNumber":"#ocrx-card-number","#ccExpires":"#ocrx-card-expiration"}
var personalFields = {
    'full-name' : 'Full name',
    'first-name' : 'First name',
    'last-name' : 'Last name',
    'telephone' : 'Telephone'
}

var addressFields = {
    'street1' : 'Street 1',
    'street2' : 'Street 2',
    'city' : 'City',
    'state' : 'State',
    'zip' : 'Zip code'
};

var billingFields = {
    'card-number' : 'CC number',
    'card-expiration' : 'CC expiration date'
}

function revertAll() {
    $('#'+OVERLAY_ID).remove();
    $('input').removeClass("ocrx-droppable");
}
function showOverlay() {
    $('<div></div>')
        .attr("id",OVERLAY_ID)
        .attr("class", OVERLAY_ID)
        .appendTo('body');
}

function initDraggable() {
    $(".ocrx-draggable").draggable();
    $("input").addClass("ocrx-droppable");
    $("input").droppable({
        drop: function( event, ui ) {
            fieldMap[extractSelectorFromInput(this)] = '#' + ui.draggable.attr('id');
            console.log(JSON.stringify(fieldMap));
        }
    });
}
function showSidebar() {
    $('<div></div>')
        .html(getHtmlForDraggables())
        .attr("id",SIDEBAR_ID)
        .attr("class", SIDEBAR_ID)
        .appendTo('#' + OVERLAY_ID);
}

function getHtmlForDraggables() {
    var html = ''
        + getTitleHtml('Personal Info')
        + convertFieldDictToDraggablesHtml(personalFields)
        + getTitleHtml('Address Info')
        + convertFieldDictToDraggablesHtml(addressFields)
        + getTitleHtml('Billing Info')
        + convertFieldDictToDraggablesHtml(billingFields);

    return html;
}

// Return something like id:telephone or name:telephone
function extractSelectorFromInput(elm) {
    var selector = $(elm).attr('id');
    if (selector) {
        selector = '#' + selector; } else {
        selector = $(elm).attr('name');
        selector = 'input[name="' + selector + '"]';
    }

    return selector;
}


function startApp() {
    if ($('#'+OVERLAY_ID).length) {
        revertAll();
    } else {
        showOverlay();
        showSidebar();
        initDraggable();
        animateFieldMap();
    }
}

startApp();


/**
 * HTML BUILDERS
 */

function getTitleHtml(title) {
    return '<h1>'+title+'</h1>';

}

function convertFieldDictToDraggablesHtml(dict) {
    var html = '';
    for (var f in dict) {
        var id = 'ocrx-' + f;
        html += '<div id="'+id+'" class="ocrx-draggable ui-widget-content"><p>'+dict[f]+'</p></div>';
    }
    html += getClearHtml();

    return html;
}

function getClearHtml() {
    return '<div style="clear: both;"></div>';
}

function animateFieldMap() {
    for (field in fieldMap) {
        console.log(field);
        animateTileOverElement(fieldMap[field], field);
    }
}

function animateTileOverElement(tile, elm) {
    console.log(tile);
    console.log(elm);
    var tileOffset = $(tile).offset();
    var elmOffset = $(elm).offset();
    var newTop = elmOffset.top - tileOffset.top;
    var newLeft = elmOffset.left - tileOffset.left;
    $(tile).animate({"left": "+=" + newLeft + "px", "top": "+=" + newTop + "px"}, "fast");
}
