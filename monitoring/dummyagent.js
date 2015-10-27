'use strict';

var fs = require('fs');

var RuxitAgent = function () {
    this.linkId = null;
    this.pathId = null;
    this.nodeId = null;
};

var randomId = function () {
    return Math.floor(Math.random() * (99999 - 10000) + 10000);
};

RuxitAgent.prototype.createAsyncLink = function () {
    this.linkId = randomId();
    fs.writeSync(1, "Async link created " + this.linkId + "\n\n");
    return this.linkId;
};

RuxitAgent.prototype.startSubPath = function () {
    this.pathId = randomId();
    fs.writeSync(1, "Sub path started " + this.pathId + "\n");
};

RuxitAgent.prototype.startNode = function (name) {
    this.nodeId = randomId();
    fs.writeSync(1, "Node started " + name + " " + this.nodeId + "\n");
};

RuxitAgent.prototype.endNode = function () {
    fs.writeSync(1, "Sub path ended " + this.pathId + "\n");
};

RuxitAgent.prototype.endSubPath = function () {
    fs.writeSync(1, "Node ended " + this.nodeId + "\n\n");
};


module.exports.init = function () {

    var ruxitAgent = new RuxitAgent();
    var ruxitTag = ruxitAgent.createAsyncLink();

    var nextTickOrig = process.nextTick;
    process.nextTick = function (cb) {


        var getStack = function (o) {
            var b, e, s;
            b = Error.prepareStackTrace;

            Error.prepareStackTrace = function (_, stack) {
                return stack;
            };
            e = new Error;
            Error.captureStackTrace(e, o);
            s = e.stack;
            fs.writeSync(1, s + "\n\n");
            Error.prepareStackTrace = b;
            return s;
        };

        getStack(this);

        arguments[0] = function wrapped() {
            ruxitAgent.startSubPath(ruxitTag);
            ruxitAgent.startNode("Callback");
            try {
                cb();
            } finally {
                ruxitAgent.endNode();
                ruxitAgent.endSubPath();
            }
        };

        nextTickOrig.apply(this, arguments);
    };
};