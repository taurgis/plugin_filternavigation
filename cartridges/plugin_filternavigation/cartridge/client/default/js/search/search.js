const Search = require('base/search/search');

Search.initHistory = function () {
    let previousHistoryState;
    let doNotPushHistory = false;

    /**
     * Listen to all possible AJAX calls on a search page (Filters, sorting, show more, ...).
     */
    $(document).ajaxSuccess(
        function (event, xhr) {
            // Make the assumption that a product-tile being present in the response means a grid-refresh
            if (xhr.responseText.indexOf('<div class="product-tile">') >= 0) {
                if (!doNotPushHistory) {
                    setTimeout(function () {
                        history.pushState({ reapplyFilters: true }, document.title, decodeURI($('.permalink').val()));
                    });
                }

                doNotPushHistory = false;
            }
        }
    );

    /**
     * Listen to the back and forward button of the browser to detect URL changes.
     */
    window.addEventListener('popstate', () => {
        if ((history.state && history.state.reapplyFilters)
            || (previousHistoryState && previousHistoryState.reapplyFilters)) {
            const $resetButton = $('.refinement-bar button.reset');

            previousHistoryState = history.state;

            // This async call should not cause a new history state to be pushed.
            doNotPushHistory = true;

            // Use the reset button listeners to do a refresh
            $resetButton.data('href', decodeURI(window.location.href));
            $resetButton.trigger('click');
        }
    });
};

module.exports = Search;
