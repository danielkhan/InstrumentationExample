var gcprofiler = require('gc-profiler');
var fs = require('fs');



module.exports.init = function (time) {


    fs.writeFile("/tmp/gc_Scavenge", 'Start;Duration\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    fs.writeFile("/tmp/gc_MarkSweepCompact", 'Start;Duration\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    // Listen to GC events
    gcprofiler.on('gc', function (info) {

        var diff = process.hrtime(time);
        var ms = diff[0] * 1e9 + diff[1];

        fs.appendFile("/tmp/gc_" + info.type, (ms - info.duration * 1000) + ';' + (info.duration * 1000) + "\n", function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
};
