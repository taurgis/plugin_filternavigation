'use strict';

var server = require('server');
server.extend(module.superModule);

/**
 * Appends updated payment request options to the given response.
 * @param {Object} req - The request object for the current controller request
 * @param {Object} res - The response object for the current controller request
 * @param {Function} next - Executes the next step in the controller chain
 */
function appendPaymentRequestOptions(req, res, next) {
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');

    var viewData = res.getViewData();
    viewData.paymentRequestOptions = COHelpers.calculatePaymentRequestOptions();
    res.setViewData(viewData);

    next();
}

server.append('EditProductLineItem', appendPaymentRequestOptions);
server.append('RemoveProductLineItem', appendPaymentRequestOptions);
server.append('UpdateQuantity', appendPaymentRequestOptions);
server.append('SelectShippingMethod', appendPaymentRequestOptions);

module.exports = server.exports();
