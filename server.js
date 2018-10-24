const cloudscraper = require('cloudscraper');
const request = require('request');
const express = require('express');
const server = express();
const http = require('http').Server(server);
const io = require('socket.io')(http);
//const fs = require('fs');

// telebot
const TeleBot = require('telebot');
const bot = new TeleBot('455360254:AAG3YJQVNn_ejPCr7e8kRrvKJX0eqTed5Rk');

//const express = require('express');
//const server = express();
//const servermod = require('http').createServer(server);

// telebot
// const TeleBot = require('telebot');
// const bot = new TeleBot('455360254:AAG3YJQVNn_ejPCr7e8kRrvKJX0eqTed5Rk');

// serve
server.use(express.static(__dirname + '/node_modules'));
server.use('/new', express.static('new'));
server.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});

http.listen(1123, function() {
  console.log('arbMan listening on port 1123');
});

prices = {
  USD: {
    USD: 1
  },
  XRP: {},
  NCASH: {},
  TRX: {},
  REQ: {},
  ETH: {},
  BTC: {},
  BCH: {},
};

// rate = copy = Object.assign({}, prices);
rate = {
  USD: {},
  XRP: {},
  NCASH: {},
  TRX: {},
  REQ: {},
  ETH: {},
  BTC: {},
  BCH: {},
};

io.on('connection', client => {
  client.emit('hey', Object.keys(rate));
});

let btc = {
  yo: 0.0001
}

// get USDT pricess
function getbin() {
  request('https://api.binance.com/api/v3/ticker/price', function(
    error,
    response,
    body
  ) {
    try {
      btc.yo = 1 / JSON.parse(body).find(
        x => x.symbol == 'TUSDBTC'
      ).price;

      prices['BTC']['USD'] = btc.yo;

      prices['ETH']['USD'] = 1 / JSON.parse(body).find(
        x => x.symbol == 'TUSDETH'
      ).price;

      prices['XRP']['USD'] = JSON.parse(body).find(
        x => x.symbol == 'XRPBTC'
      ).price * btc.yo;

      prices['BCH']['USD'] = JSON.parse(body).find(
        x => x.symbol == 'BCCBTC'
      ).price * btc.yo;

      prices['NCASH']['USD'] = (JSON.parse(body).find(
        x => x.symbol == 'NCASHBTC'
      ).price) * btc.yo;
      prices['TRX']['USD'] = (JSON.parse(body).find(
        x => x.symbol == 'TRXBTC'
      ).price) * btc.yo;
      prices['REQ']['USD'] = (JSON.parse(body).find(
        x => x.symbol == 'REQBTC'
      ).price) * btc.yo;

      update();
    } catch (e) {
      console.log(e);
    }
  });
}

function getkoin() {
  cloudscraper.get('https://koinex.in/api/ticker/', function(
    error,
    response,
    body
  ) {
    if (error) {
      console.log(error);
    } else {
      try {
        prices['ETH']['KOI'] = JSON.parse(body).prices.inr.ETH;
        prices['XRP']['KOI'] = JSON.parse(body).prices.inr.XRP;
        prices['BCH']['KOI'] = JSON.parse(body).prices.inr.BCH;
        prices['BTC']['KOI'] = JSON.parse(body).prices.inr.BTC;
        prices['NCASH']['KOI'] = JSON.parse(body).prices.inr.NCASH;
        prices['TRX']['KOI'] = JSON.parse(body).prices.inr.TRX;
        prices['REQ']['KOI'] = JSON.parse(body).prices.inr.REQ;
        prices['USD']['KOI'] = JSON.parse(body).prices.inr.TUSD;
        update();
      } catch (e) {
        console.log('json shit');
      }
    }
  });
}



function update() {
  Object.keys(prices).map(each => {
    try {
      rate[each]['KOI'] = prices[each]['KOI'] / prices[each]['USD'];

      /* filters
      if (rate.ETH.KOI > 70 || rate.ETH.ZEB > 70 || rate.ETH.ZEB < 67 || rate.ETH.KOI < 67) {
        bot.sendMessage(
          442494900,
          ' koi ' + rate.ETH.KOI + '\nzeb ' + rate.ETH.ZEB
        );
      }
      */

    } catch (e) {
      console.log(each + 'not ready');
    }
  });
  io.emit('update', [prices, rate])
}
bot.sendMessage(442494900, 'niga niga')

bot.on(['/start'], msg => msg.reply.text(JSON.stringify(rate, null, 4)));
bot.on(['/price'], msg => msg.reply.text(JSON.stringify(prices, null, 4)));
bot.start();

/* write every 5 mins
function write() {
  let now = Date.now();
  fs.writeFile(
    '/home/mendu/git/pre2/newlogs/' + now + '.json',
    JSON.stringify({
      rate: rate,
      prices: prices
    }),
    err => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(now, 'File has been created');
      store = [];
    }
  );
}
*/
getkoin()
getbin()
//setInterval(write, 300000);
setInterval(getkoin, 8000);
setInterval(getbin, 8000);
