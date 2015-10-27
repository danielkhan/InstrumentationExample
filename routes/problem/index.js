var express = require('express');
var router = express.Router();

var theThing = null;

var replaceThing = function () {
    var originalThing = theThing;
    var unused = function () {
        if (originalThing) console.log("hi");
    };
    theThing = {
        longStr: new Array(100).join('*'),
        someMethod: function () {
            console.log('someMessage');
        }
    };

};


var replaceThingSane = function () {
    var originalThing = theThing;
    var unused = function () {
        // if (originalThing) console.log("hi");
    };
    theThing = {
        longStr: new Array(100).join('*'),
        someMethod: function () {
            console.log('someMessage');
        }
    };

};


router.get('/leak', function (req, res, next) {
    replaceThing();
    return res.json({message: 'Everything is not so fine!'})
});


router.get('/leak-sane', function (req, res, next) {
    replaceThingSane();
    return res.json({message: 'Everything is fine!'})
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

router.get('/blocking', function (req, res, next) {

    return res.json(primCalculator(10000, 50000));
});


var loop = function () {
    loop();
};

router.get('/loop', function (req, res, next) {
    loop();
    return res.status(200).end();
});

module.exports = router;