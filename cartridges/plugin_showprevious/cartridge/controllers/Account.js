'use strict';

var server = require('server');
server.extend(module.superModule);

server.append('Show', function (req, res, next) {
    var AccountModel = require('*/cartridge/models/account');
    var viewData = res.getViewData();

    var paymentMethods = AccountModel.getCustomerPaymentMethods(req.currentCustomer.raw);
    if (!paymentMethods.empty) {
        viewData.payment = paymentMethods[0];
    }

    res.setViewData(viewData);
    next();
});

module.exports = server.exports();
