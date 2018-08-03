const cloudscraper = require('cloudscraper');
const request = require('request');
const express = require('express');
const server = express();
const http = require('http').Server(server);
const io = require('socket.io')(http);
const fs = require('fs');

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
    ETH: {},
    XRP: {},
    TRX: {},
    OMG: {},
    LTC: {},
    KNC: {},
    CMT: {},
    ZRX: {},
    NCASH: {},
    ZRX: {},
    BCH: {},
    REP: {},
    IOST: {},
    ZIL:{},
};

// rate = copy = Object.assign({}, prices);
rate = {
    ETH: {},
    XRP: {},
    TRX: {},
    OMG: {},
    LTC: {},
    KNC: {},
    CMT: {},
    ZRX: {},
    NCASH: {},
    ZRX: {},
    BCH: {},
    REP: {},
    IOST: {},
    ZIL:{},
};

io.on('connection', client => {
    client.emit('hey', Object.keys(rate));
});

let btc = {}
btc.yo = 0.0001

// get USDT pricess
function getbin() {
    request('https://api.binance.com/api/v3/ticker/price', function(
        error,
        response,
        body
    ) {
        try {
            prices['ETH']['USD'] = JSON.parse(body).find(
                x => x.symbol == 'ETHUSDT'
            ).price;
            prices['XRP']['USD'] = JSON.parse(body).find(
                x => x.symbol == 'XRPUSDT'
            ).price;
            prices['LTC']['USD'] = JSON.parse(body).find(
                x => x.symbol == 'LTCUSDT'
            ).price;
            prices['BCH']['USD'] = JSON.parse(body).find(
                x => x.symbol == 'BCCUSDT'
            ).price;
            console.log(JSON.parse(body));
            btc.yo = JSON.parse(body).find(
                x => x.symbol == 'BTCUSDT'
            ).price;
            console.log('yoyoy', btc.yo)
            prices['NCASH']['USD'] = (JSON.parse(body).find(
                x => x.symbol == 'NCASHBTC'
            ).price) * btc.yo;
            prices['ZRX']['USD'] = (JSON.parse(body).find(
                x => x.symbol == 'ZRXBTC'
            ).price) * btc.yo;
            prices['REP']['USD'] = (JSON.parse(body).find(
                x => x.symbol == 'REPBTC'
            ).price) * btc.yo;
            prices['IOST']['USD'] = (JSON.parse(body).find(
                x => x.symbol == 'IOSTBTC'
            ).price) * btc.yo;
            prices['ZIL']['USD'] = (JSON.parse(body).find(
                x => x.symbol == 'ZILBTC'
            ).price) * btc.yo;
            update();
        } catch (e) {
            console.log(e);
        }
    });
}

async function geteachok(tok) {
    return new Promise(function(resolve, reject) {
        request(
            'https://www.okex.com/api/v1/ticker.do?symbol=' + tok + '_usdt',
            function(error, response, body) {
                try {
                    resolve(JSON.parse(body).ticker.last);
                } catch (e) {
                    console.log(e);
                    reject();
                }
            }
        );
    });
}

function getok() {
    geteachok('trx')
        .then(dol => {
            prices['TRX']['USD'] = dol;
            update();
            geteachok('omg')
                .then(dol1 => {
                    prices['OMG']['USD'] = dol1;
                    update();
                    geteachok('knc')
                        .then(dol2 => {
                            prices['KNC']['USD'] = dol2;
                            update();
                            geteachok('cmt')
                                .then(dol3 => {
                                    prices['CMT']['USD'] = dol3;
                                    update();
                                })
                                .catch(e => {
                                    console.log(e);
                                });
                        })
                        .catch(e => {
                            console.log(e);
                        });
                })
                .catch(e => {
                    console.log(e);
                });
        })
        .catch(e => {
            console.log(e);
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
                prices['TRX']['KOI'] = JSON.parse(body).prices.inr.TRX;
                prices['OMG']['KOI'] = JSON.parse(body).prices.inr.OMG;
                prices['LTC']['KOI'] = JSON.parse(body).prices.inr.LTC;
                prices['ZRX']['KOI'] = JSON.parse(body).prices.inr.ZRX;
                prices['NCASH']['KOI'] = JSON.parse(body).prices.inr.NCASH;
                prices['REP']['KOI'] = JSON.parse(body).prices.inr.REP;
                prices['IOST']['KOI'] = JSON.parse(body).prices.inr.REP;
                prices['ZIL']['KOI'] = JSON.parse(body).prices.inr.REP;
                update();
            } catch (e) {
                console.log('json shit');
            }
        }
    });
}

async function geteachzeb(tok) {
    return new Promise(function(resolve, reject) {
        request(
            'https://www.zebapi.com/api/v1/market/ticker-new/' + tok + '/inr',
            function(error, response, body) {
                try {
                    resolve(JSON.parse(body).market);
                } catch (e) {
                    console.log(e);
                    reject();
                }
            }
        );
    });
}

function getzeb() {
    geteachzeb('eth')
        .then(ru => {
            prices['ETH']['ZEB'] = ru;
            update();
            geteachzeb('xrp')
                .then(ru1 => {
                    prices['XRP']['ZEB'] = ru1;
                    update();
                    geteachzeb('trx')
                        .then(ru2 => {
                            prices['TRX']['ZEB'] = ru2;
                            update();
                            geteachzeb('omg')
                                .then(ru3 => {
                                    prices['OMG']['ZEB'] = ru3;
                                    update();
                                    geteachzeb('ltc')
                                        .then(ru3 => {
                                            prices['LTC']['ZEB'] = ru3;
                                            update();
                                            geteachzeb('knc')
                                                .then(ru3 => {
                                                    prices['KNC']['ZEB'] = ru3;
                                                    update();
                                                    geteachzeb('cmt')
                                                        .then(ru3 => {
                                                            prices['CMT']['ZEB'] = ru3;
                                                            update();
                                                            geteachzeb('zrx')
                                                                .then(ru3 => {
                                                                    prices['ZRX']['ZEB'] = ru3;
                                                                    update();
                                                                    geteachzeb('ncash')
                                                                        .then(ru3 => {
                                                                            prices['NCASH']['ZEB'] = ru3;
                                                                            update();
                                                                            geteachzeb('rep')
                                                                                .then(ru3 => {
                                                                                    prices['REP']['ZEB'] = ru3;
                                                                                    update();
                                                                                    geteachzeb('iost')
                                                                                        .then(ru3 => {
                                                                                            prices['IOST']['ZEB'] = ru3;
                                                                                            update();
                                                                                            geteachzeb('zil')
                                                                                                .then(ru3 => {
                                                                                                    prices['ZIL']['ZEB'] = ru3;
                                                                                                    update();

                                                                                                })
                                                                                                .catch(e => {
                                                                                                    console.log(e);
                                                                                                });

                                                                                        })
                                                                                        .catch(e => {
                                                                                            console.log(e);
                                                                                        });

                                                                                })
                                                                                .catch(e => {
                                                                                    console.log(e);
                                                                                });

                                                                        })
                                                                        .catch(e => {
                                                                            console.log(e);
                                                                        });
                                                                })
                                                                .catch(e => {
                                                                    console.log(e);
                                                                });
                                                        })
                                                        .catch(e => {
                                                            console.log(e);
                                                        });
                                                })
                                                .catch(e => {
                                                    console.log(e);
                                                });
                                        })
                                        .catch(e => {
                                            console.log(e);
                                        });
                                })
                                .catch(e => {
                                    console.log(e);
                                });
                        })
                        .catch(e => {
                            console.log(e);
                        });
                })
                .catch(e => {
                    console.log(e);
                });
        })
        .catch(e => {
            console.log(e);
        });
}

function update() {
    Object.keys(prices).map(each => {
        try {
            rate[each]['KOI'] = prices[each]['KOI'] / prices[each]['USD'];
            rate[each]['ZEB'] = prices[each]['ZEB'] / prices[each]['USD'];
            //console.log('\nPRICES');
            //console.log(prices);
            //console.log('\nRATES');
            //console.log(rate);

            // filters
            if (rate.ETH.KOI > 70 || rate.ETH.ZEB > 70 || rate.ETH.ZEB < 67 || rate.ETH.KOI < 67) {
                bot.sendMessage(
                    442494900,
                    ' koi ' + rate.ETH.KOI + '\nzeb ' + rate.ETH.ZEB
                );
            }
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

// write every 5 mins
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

setInterval(write, 300000);
setInterval(getkoin, 8000);
setInterval(getzeb, 15000);
setInterval(getbin, 8000);
setInterval(getok, 10000);
