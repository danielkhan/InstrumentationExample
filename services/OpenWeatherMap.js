var sa = require('superagent');

function OpenWeatherMap(config) {
    this.config = config;
}

OpenWeatherMap.prototype.fetchLocation = function(lat, lng, done) {

    var url = 'http://api.openweathermap.org/data/2.5/weather?units=metric&lat=' + lat + '&lon=' + lng;
    // console.log("Call OpenWeatherMap with " + url);
    sa.get(url)
        .accept('json')
        .end(function(error, res) {
            if(error) return done(error);


            return done(null, res.body);
        });
};

module.exports = OpenWeatherMap;