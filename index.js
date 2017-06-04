var express = require('express')
var app = express()
var cron = require('node-cron');
var rp = require('request-promise');
var Pusher = require('pusher');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 0, checkperiod: 0 } );

var pusher = new Pusher({
  appId: '343347',
  key: 'ca8a152359793181d9fe',
  secret: 'b68fbece9a29307e805f',
  cluster: 'ap2',
  encrypted: true
});

var extServerOptions = {
    host: 'coinmarketcap-nexuist.rhcloud.com/',
    port: '80',
    path: '/api/eth',
    method: 'GET'
};

eth_values = [0]

per_c = function(a1, a2){
	return ((a2-a1)*100/a1)
}

cron.schedule('* * * * * * *', function(){
    rp('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=INR')
    .then(function (htmlString) {
        pusher.trigger('my-channel', 'eth-price', {
  "message": JSON.parse(htmlString)[0]
});
    })
})


app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
