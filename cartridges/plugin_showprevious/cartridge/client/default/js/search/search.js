var Search = require('base/search/search');

/**
 * Update DOM elements with Ajax results
 *
 * @param {Object} $results - jQuery DOM element
 * @param {string} selector - DOM element to look up in the $results
 * @return {undefined}
 */
function updateDom($results, selector) {
    var $updates = $results.find(selector);
    $(selector).empty().html($updates.html());
}


/**
 * Keep refinement panes expanded/collapsed after Ajax refresh
 *
 * @param {Object} $results - jQuery DOM element
 * @return {undefined}
 */
function handleRefinements($results) {
    $('.refinement.active').each(function () {
        $(this).removeClass('active');
        var activeDiv = $results.find('.' + $(this)[0].className.replace(/ /g, '.'));
        activeDiv.addClass('active');
        activeDiv.find('button.title').attr('aria-expanded', 'true');
    });

    updateDom($results, '.refinements');
}

/**
 * Parse Ajax results and updated select DOM elements
 *
 * @param {string} response - Ajax response HTML code
 * @return {undefined}
 */
function parseResults(response) {
    var $results = $(response);
    var specialHandlers = {
        '.refinements': handleRefinements
    };

    // Update DOM elements that do not require special handling
    [
        '.grid-header',
        '.header-bar',
        '.header.page-title',
        '.product-grid',
        '.show-more',
        '.filter-bar'
    ].forEach(function (selector) {
        updateDom($results, selector);
    });

    Object.keys(specialHandlers).forEach(function (selector) {
        specialHandlers[selector]($results);
    });
}

/**
 * Makes a call to the given url
 * @param {string} url - URL to call
 * @return {Promise} promise
 */
function doSearch(url) {
    $.spinner().start();
    const data = { page: $('.grid-footer').data('page-number'), selectedUrl: url };
    return $.get(url, data).then(response => {
        parseResults(response);
        $(document).trigger('search:filter');
    }).always(() => $.spinner().stop());
}

Search.initHistory = function() {
    $(document).ajaxSuccess(
        function(event, xhr, settings){
            console.debug(event);
            setTimeout(function() {
                history.pushState({ reapplyFilters: true }, document.title, $('.permalink').val());
            });
        }
    );

    let previousHistoryState;
    window.addEventListener('popstate', () => {
        if ((history.state && history.state.reapplyFilters)
            || (previousHistoryState && previousHistoryState.reapplyFilters)) {
            previousHistoryState = history.state;
            doSearch(window.location.href);
        }
    });
};

module.exports = Search;
