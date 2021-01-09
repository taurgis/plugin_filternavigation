'use strict';

var server = require('server');
server.extend(module.superModule);

var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

server.replace('List', userLoggedIn.validateLoggedIn, consentTracking.consent, function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var Resource = require('dw/web/Resource');
    var AccountModel = require('*/cartridge/models/account');

    res.render('account/payment/payment', {
        paymentMethods: AccountModel.getCustomerPaymentMethods(req.currentCustomer.raw),
        actionUrl: URLUtils.url('PaymentInstruments-DeletePayment').toString(),
        breadcrumbs: [
            {
                htmlValue: Resource.msg('global.home', 'common', null),
                url: URLUtils.home().toString()
            },
            {
                htmlValue: Resource.msg('page.title.myaccount', 'account', null),
                url: URLUtils.url('Account-Show').toString()
            }
        ]
    });
    next();
});

server.replace('DeletePayment', userLoggedIn.validateLoggedInAjax, function (req, res, next) {
    var AccountModel = require('*/cartridge/models/account');
    var SalesforcePaymentsMgr = require('dw/extensions/payments/SalesforcePaymentsMgr');

    var array = require('*/cartridge/scripts/util/array');
    var accountHelpers = require('*/cartridge/scripts/helpers/accountHelpers');

    var data = res.getViewData();
    if (data && !data.loggedin) {
        res.json();
        return next();
    }

    var ID = req.querystring.ID;
    var paymentMethods = AccountModel.getCustomerPaymentMethods(req.currentCustomer.raw);
    var paymentToDelete = array.find(paymentMethods, function (item) {
        return ID === item.ID;
    });
    res.setViewData(paymentToDelete);
    this.on('route:BeforeComplete', function () { // eslint-disable-line no-shadow
        var CustomerMgr = require('dw/customer/CustomerMgr');
        var Transaction = require('dw/system/Transaction');
        var Resource = require('dw/web/Resource');

        var customer = CustomerMgr.getCustomerByCustomerNumber(
            req.currentCustomer.profile.customerNo
        );
        Transaction.wrap(function () {
            SalesforcePaymentsMgr.detachPaymentMethod(paymentToDelete.raw);
        });

        // Send account edited email
        accountHelpers.sendAccountEditedEmail(customer.profile);

        paymentMethods = AccountModel.getCustomerPaymentMethods(req.currentCustomer.raw);
        if (paymentMethods.length === 0) {
            res.json({
                ID: ID,
                message: Resource.msg('msg.no.saved.payments', 'payment', null)
            });
        } else {
            res.json({ ID: ID });
        }
    });

    return next();
});

module.exports = server.exports();
