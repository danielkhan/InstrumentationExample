var express = require('express');
var router = express.Router();

var OpenWeatherMapService = require('../../services/OpenWeatherMap');
var owm = new OpenWeatherMapService();


router.get('/:lat/:lng', function(req, res, next) {
    owm.fetchLocation(req.params.lat, req.params.lng, function(e, r) {
        if(e) {
            console.log("Error: " + e);
            return res.status(404).send(e);
        }
        res.json(r);
    });
});

module.exports = router;
