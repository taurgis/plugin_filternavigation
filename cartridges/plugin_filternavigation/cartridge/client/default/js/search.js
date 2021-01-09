'use strict';

const processInclude = require('base/util');

$(document).ready(function () {
    processInclude(require('./search/search'));
    processInclude(require('base/product/quickView'));
});
