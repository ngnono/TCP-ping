
const stringifyObject = require('stringify-object');
var ping = require('./ping');

ping.ping({ address: '150.129.136.104', port:6002}, function(data) {

    const pretty = stringifyObject(data, {
        indent: '  ',
        singleQuotes: false
    });

    console.log(pretty);

});
