var express = require('express');
var router = express.Router();
var sa = require('superagent');
var theThing = null;
var time = process.hrtime();
var fs = require('fs');

require('../monitoring/gc').init(time);

fs.writeFile("/tmp/memory.csv", 'Start;RSS;HeapTotal;HeapUsed\n', function (err) {
    if (err) {
        return console.log(err);
    }
});

var primCalculator = function (start, end) {
    var primes = [];
    for (var number = start; number < end; number++) {
        var primeNumberDividers = []; //there should only be 2: 1 & number
        for (var divider = 1; divider <= number; divider++) {
            if (number % divider === 0) {
                primeNumberDividers.push(divider);
            }
        }
        if (primeNumberDividers.length === 2) {
            primes.push(number);
        }
    }
    return primes;
};


var replaceThing = function () {
    var originalThing = theThing;
    var unused = function () {
        if (originalThing) console.log("hi");
    };
    theThing = {
        longStr: new Array(1000000).join('*'),
        someMethod: function () {
            console.log('someMessage');
        }
    };

};


router.get('/', function (req, res, next) {
    sa.get('https://ajax.googleapis.com/ajax/services/feed/find?v=1.0&q=node.js')
        .accept('json')
        .end(function (e, r) {
            // primCalculator(10000, 50000);
            // replaceThing();
            if (e) return next(e);

            res.render('index', {
                news: JSON.parse(r.text)
            });

            var mem = process.memoryUsage();
            var diff = process.hrtime(time);
            var ms = diff[0] * 1e9 + diff[1];
            fs.appendFile("/tmp/memory.csv", ms + ';' + mem.rss + ';' + mem.heapTotal + ';' + mem.heapUsed + "\n", function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        });
});


module.exports = router;
