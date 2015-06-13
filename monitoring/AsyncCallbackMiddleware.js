/*
 * Simple middleware that uses the async callback api to time every callback during a
 * request in express
 *
 * @module AsyncCallbackMiddleware
 *
 * Usage:
 * var asyncCallbackMiddleware = require('./lib/AsyncCallbackMiddleware');
 * var app = express();
 * app.use(asyncCallbackMiddleware);
 */

var createNamespace = require('continuation-local' + '-storage').createNamespace;
var clsNamespace = createNamespace('my-clsNamespace');
var fs = require('fs');

module.exports = function (req, res, next) {

    clsNamespace.bindEmitter(req);
    clsNamespace.bindEmitter(res);

    clsNamespace.run(function () {

        clsNamespace.set('request', req);
        var key = process.addAsyncListener({
            create: function onCreate() {
                var req = clsNamespace.get('request') || null;

                if (req && req.originalUrl)
                    return {'uid': req.originalUrl, timer: process.hrtime()};
                else
                    return {'uid': null};
            },
            before: function onBefore(context, storage) {
                if (storage && storage.uid) {

                    fs.writeSync(1, 'uri: ' + storage.uid + ' callback starts\n');
                }
            },
            after: function onAfter(context, storage) {
                if (storage && storage.uid) {

                    var delta = process.hrtime(storage.timer);

                    fs.writeSync(1, 'uri: ' + storage.uid + ' callback ends. Time elapsed: ' + delta + 'ns\n');
                }
            },
            error: function onError(storage, err) {
                console.log(err);
            }
        });

        next();
    });
};