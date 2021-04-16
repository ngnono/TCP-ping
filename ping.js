var net = require('net');

String.prototype.toBytes = function(encoding){
    var bytes = [];
    var buff = new Buffer(this, encoding);
    for(var i= 0; i< buff.length; i++){
      var byteint = buff[i];
      bytes.push(byteint);
    }
    return bytes;
}


var bytes = Buffer.alloc(1024);
str = Buffer.from(bytes).toString('utf8');

console.log(str + ": " + str.length + " characters, " +
Buffer.byteLength(str, 'utf8') + " Bytes");//1Byte = 8 bit, 1k = 1024 Byte

var ping = function(o, callback, sorttag) {
    var optionsArry = [];
    if (Object.prototype.toString.call(o) === '[object Array]') {
        optionsArry = o
    } else if (Object.prototype.toString.call(o) === '[object Object]') {
        optionsArry.push(o);
    } else {
        console.warn("parameter error");
    }
    var optionSize = optionsArry.length;
    var outArry = [];
    optionsArry.forEach(function(item) {
        var options = {};
        var i = 0;
        var results = [];
        options.address = item.address || 'localhost';
        options.port = item.port || 80;
        options.attempts = item.attempts || 100;
        options.timeout = item.timeout || 5000;
        connect(options);

        function check(options) {
            if (i < options.attempts) {
                connect(options);
            } else {
                var avg = results.reduce(function(prev, curr) {
                    return prev + curr.time;
                }, 0);
                var max = results.reduce(function(prev, curr) {
                    return (prev > curr.time) ? prev : curr.time;
                }, results[0].time);
                var min = results.reduce(function(prev, curr) {
                    return (prev < curr.time) ? prev : curr.time;
                }, results[0].time);
                avg = avg / results.length;
                var out = {
                    address: options.address,
                    port: options.port,
                    attempts: options.attempts,
                    avg: avg,
                    max: max,
                    min: min,
                    results: results
                };
                outArry.push(out);
                if (outArry.length === optionSize) {
                    if (sorttag !== undefined) {
                        outArry.sort(function(a, b) {
                            return sorttag == true ? (a.avg - b.avg) : (b.avg - a.avg);
                        });
                    }
                    callback(outArry);
                }

            }
        };

        function connect(options) {



            var s = new net.Socket();
            var start = process.hrtime();
            
            s.connect(options.port, options.address, function() {
                var time_arr = process.hrtime(start);
                var time = (time_arr[0] * 1e9 + time_arr[1]) / 1e6;
                results.push({
                    seq: i,
                    time: time
                });
                s.write(str,'utf-8');
                s.destroy();
                i++;
                check(options);
            });
            s.on('error', function(e) {
                console.error(e);
                results.push({
                    seq: i,
                    time: undefined,
                    err: e
                });
                s.destroy();
                i++;
                check(options);
            });
            s.setTimeout(options.timeout, function() {
                results.push({
                    seq: i,
                    time: undefined,
                    err: Error('Request timeout')
                });
                s.destroy();
                i++;
                check(options);
            });
        };
    });



};
module.exports.ping = ping;
