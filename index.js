var express = require('express')
var app = express()
var cron = require('node-cron');
var rp = require('request-promise');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 0, checkperiod: 0 } );

var extServerOptions = {
    host: 'coinmarketcap-nexuist.rhcloud.com/',
    port: '80',
    path: '/api/eth',
    method: 'GET'
};

eth_values = [0]

cron.schedule('*/10 * * * * *', function(){
  console.log('running a task every two minutes');
  rp('http://coinmarketcap-nexuist.rhcloud.com/api/eth')
    .then(function (htmlString) {
    	console.log('values', eth_values)
        // Process html... 
        data = JSON.parse(htmlString)
        //console.log(data)

        current_price = data['price']['usd']
        current_mkp = data['market_cap']['usd']

last  = eth_values.slice(-1)[0]
//last_10 = value.slice(-5)

strr=undefined
pp = per_c(last, current_price)
console.log('change:', pp)
if  (pp > 2) {
	strr = "`*Alert. Ether is up by more than 2%: "+ pp+ "%, current_price: "+current_price+ "*`"
}else if (pp < -2){
	strr = "`*Alert. Ether is down by: "+ pp+ "%, current_price: "+current_price+ "*`"
}

if (eth_values.length > 200) eth_values = eth_values.slice(100, 200);

if (strr!=undefined){
	eth_values.push(current_price)
	var options = {
		    method: 'POST',
		    uri: 'https://hooks.slack.com/services/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',
		    body: {
		        text: strr,
		        "username": "Vitalik buterin",
		        "icon_emoji": ":ghost:"
		    },
		    json: true // Automatically stringifies the body to JSON 
};
	console.log('old value:', last)
	console.log('new value:', current_price)
	rp(options)
    .then(function (parsedBody) {
        // POST succeeded... 
    })
    .catch(function (err) {
        // POST failed... 
    });
}

    })
    .catch(function (err) {
        // Crawling failed... 
    });
});

per_c = function(a1, a2){
	return ((a2-a1)*100/a1)
}


app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
