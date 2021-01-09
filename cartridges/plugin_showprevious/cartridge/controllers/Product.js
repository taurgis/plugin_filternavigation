'use strict';

var server = require('server');
server.extend(module.superModule);

server.append('Variation', function (req, res, next) {
    var Money = require('dw/value/Money');
    var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');

    var viewData = res.getViewData();

    var product = viewData.product;
    var price = new Money(product.price.sales.value, product.price.sales.currency);
    var buynow = COHelpers.calculateBuyNowData(product.id, product.selectedQuantity, price, product.options);
    buynow.options = SalesforcePaymentRequest.format(buynow.options);

    viewData.product.buynow = buynow;
    res.setViewData(viewData);
    next();
});

module.exports = server.exports();
