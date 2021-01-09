'use strict';

var server = require('server');
server.extend(module.superModule);

server.append('Confirm', function (req, res, next) {
    var OrderMgr = require('dw/order/OrderMgr');
    var SalesforcePaymentMethod = require('dw/extensions/payments/SalesforcePaymentMethod');
    var SalesforcePaymentsMgr = require('dw/extensions/payments/SalesforcePaymentsMgr');

    var viewData = res.getViewData();
    var order = OrderMgr.getOrder(viewData.order.orderNumber);

    if (order && order.customer && !order.customer.registered) {
        var paymentIntent = SalesforcePaymentsMgr.getPaymentIntent(order);
        viewData.allowSavePaymentMethod = paymentIntent && paymentIntent.paymentMethod
            && paymentIntent.paymentMethod.type === SalesforcePaymentMethod.TYPE_CARD;
    }

    res.setViewData(viewData);
    next();
});

server.append('CreateAccount', function (req, res, next) {
    this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
        var Transaction = require('dw/system/Transaction');
        var SalesforcePaymentMethod = require('dw/extensions/payments/SalesforcePaymentMethod');
        var SalesforcePaymentsMgr = require('dw/extensions/payments/SalesforcePaymentsMgr');

        var viewData = res.getViewData();
        var passwordForm = viewData.passwordForm;
        var newCustomer = viewData.newCustomer;
        var order = viewData.order;

        if (passwordForm.savepaymentmethod.checked) {
            var paymentIntent = SalesforcePaymentsMgr.getPaymentIntent(order);
            var allowSavePaymentMethod = paymentIntent && paymentIntent.paymentMethod
                && paymentIntent.paymentMethod.type === SalesforcePaymentMethod.TYPE_CARD;

            if (allowSavePaymentMethod) {
                Transaction.wrap(function () {
                    SalesforcePaymentsMgr.attachPaymentMethod(paymentIntent.paymentMethod, newCustomer);
                });
            }
        }
    });
    next();
});

module.exports = server.exports();
