'use strict';

var base = module.superModule;

/**
 * Disable the back button functionality as this has been overwritten.
 * @type {boolean}
 */
base.plpBackButtonOn = false;

module.exports = base;
