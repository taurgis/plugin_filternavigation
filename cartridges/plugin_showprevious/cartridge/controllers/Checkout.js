'use strict';

var server = require('server');
server.extend(module.superModule);

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

// Return from async payment
server.get(
    'Async',
    server.middleware.https,
    consentTracking.consent,
    csrfProtection.generateToken,
    function (req, res, next) {
        var OrderMgr = require('dw/order/OrderMgr');
        var Transaction = require('dw/system/Transaction');
        var URLUtils = require('dw/web/URLUtils');
        var validationHelpers = require('*/cartridge/scripts/helpers/basketValidationHelpers');

        var orderNo = req.querystring.orderNo;
        var token = req.querystring.token;
        if (!orderNo || !token) {
            res.redirect(URLUtils.url('Home-Show'));
            return next();
        }

        var order = OrderMgr.getOrder(orderNo);
        if (!order || token !== order.orderToken || order.customer.ID !== req.currentCustomer.raw.ID) {
            res.redirect(URLUtils.url('Home-Show'));
            return next();
        }

        var paymentValidation = validationHelpers.validatePaymentIntent(order, false);
        if (!paymentValidation.error) {
            res.redirect(URLUtils.url('Order-Confirm', 'ID', order.orderNo, 'token', order.orderToken));
            return next();
        }

        Transaction.wrap(function () {
            OrderMgr.failOrder(order, true);
        });

        res.redirect(URLUtils.url('Checkout-Begin', 'stage', 'payment', 'error', 'payment'));
        return next();
    }
);

server.append('Begin', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Resource = require('dw/web/Resource');
    var validationHelpers = require('*/cartridge/scripts/helpers/basketValidationHelpers');

    var viewData = res.getViewData();
    var currentBasket = BasketMgr.getCurrentBasket();

    if (currentBasket && viewData.currentStage === 'payment' && req.querystring.error === 'payment') {
        var paymentValidation = validationHelpers.validatePaymentIntent(currentBasket);
        if (paymentValidation.error) {
            viewData.paymentError = Resource.msg('error.payment.failed', 'checkout', null);
        }
    }

    res.setViewData(viewData);
    next();
});


module.exports = server.exports();
