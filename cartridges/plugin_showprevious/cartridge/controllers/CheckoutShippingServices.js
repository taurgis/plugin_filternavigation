'use strict';

var server = require('server');
server.extend(module.superModule);

server.append('SelectShippingMethod', function (req, res, next) {
    this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
        var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');

        var viewData = res.getViewData();
        viewData.paymentRequestOptions = COHelpers.calculatePaymentRequestOptions();
        res.setViewData(viewData);
    });
    next();
});

module.exports = server.exports();
