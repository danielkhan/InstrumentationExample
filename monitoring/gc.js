var gcprofiler = require('gc-profiler');
var fs = require('fs');

var _datadir = null;

module.exports.init = function (datadir) {


    var stamp = Date.now();
    var time = process.hrtime();
    var runId = Math.round(time[0] * 1e3 + time[1] / 1e6);
    _datadir = datadir + '/' + runId + '_';

    // Preparing CSV files
    fs.writeFile(_datadir + 'gc_Scavenge.csv', 'Start;Duration\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    fs.writeFile(_datadir + 'gc_MarkSweepCompact.csv', 'Start;Duration\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    fs.writeFile(_datadir + 'memory.csv', 'Start;RSS;HeapTotal;HeapUsed\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    // Listen to GC events
    gcprofiler.on('gc', function (info) {

        var diff = process.hrtime(time);
        var ms = (diff[0] * 1e3 + diff[1] / 1e6);
        fs.appendFile(_datadir + 'gc_' + info.type + ".csv", (ms - info.duration) + ';' + (info.duration) + "\n", function (err) {
            if (err) {
                return console.log(err);
            }
        });

    });


    var profileMemory = function () {
        var mem = process.memoryUsage();
        var diff = process.hrtime(time);
        var ms = (diff[0] * 1e3 + diff[1] / 1e6);
        // console.log('append');
        fs.appendFile(_datadir + "memory.csv", ms + ';' + mem.rss + ';' + mem.heapTotal + ';' + mem.heapUsed + "\n", function (err) {
            if (err) {
                return console.log(err);
            }
        });
    };

    // Profile memory every x ms
    setInterval(function () {
        profileMemory()
    }, 100);
};
