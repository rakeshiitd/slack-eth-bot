var express = require('express')
var app = express()
var cron = require('node-cron');
var rp = require('request-promise');

var extServerOptions = {
    host: 'coinmarketcap-nexuist.rhcloud.com/',
    port: '80',
    path: '/api/eth',
    method: 'GET'
};

cron.schedule('*/100 * * * *', function(){
  console.log('running a task every two minutes');
  rp('http://coinmarketcap-nexuist.rhcloud.com/api/eth')
    .then(function (htmlString) {
        // Process html... 
        data = JSON.parse(htmlString)
        console.log(data)

        current_price = data['price']['usd']
        current_mkp = data['market_cap']['usd']

        var options = {
    method: 'POST',
    uri: 'https://hooks.slack.com/services/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',
    body: {
        text: '*Current ether price:  '+ current_price+ "*",
        "username": "Vitalik buterin",
        "icon_emoji": ":ghost:"
    },
    json: true // Automatically stringifies the body to JSON 
};
rp(options)
    .then(function (parsedBody) {
        // POST succeeded... 
    })
    .catch(function (err) {
        // POST failed... 
    });

    })
    .catch(function (err) {
        // Crawling failed... 
    });
});


app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
