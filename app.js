const stringifyObject = require('stringify-object');
var ping = require('./ping');

ping.ping({address: '150.129.136.104', port: 6002, attempts: 10, size: 4024 , content: '我是中国人，不能学外文。'}, function(data) {

  const pretty = stringifyObject(data, {
    indent: '  ',
    singleQuotes: false
  });

  console.log(pretty);

});
