$(document).ready(function() {

  let socket = io.connect('http://localhost:1123');
  let coins = []
  socket.on('hey', list => {
    coins = list
  })
  let high = 0
  let low = 0

  $('#high').bind('input', function() {
    high = $('#high').val()
  });
  $('#low').bind('input', function() {
    low = $('#low').val()
  });


  socket.on('update', list => {
    prices = list[0]
    rate = list[1]
    $('#tab').html('')

    // new
    let rowone = $('<tr />');

    ['*', 'KOI', 'INR', 'USD'].map(coin => {
      rowone.append($('<th />').html(coin));
    })
    $('#tab').append(rowone);

    coins.map(coin => {
      let row = $('<tr />');
      row.append($('<th />').html(coin));
      //koi
      if (typeof(rate[coin].KOI) != 'undefined' && rate[coin].KOI != null) {
        row.append($('<th />').html(rate[coin].KOI.toPrecision(4)));
      } else {
        row.append($('<th />').html('NA'));
      }
      row.append($('<th />').html(prices[coin].KOI));
      row.append($('<th />').html(prices[coin].USD));
      $('#tab').append(row);
    })

    /*old
    let rowone = $('<tr />');
    rowone.append($('<th />').html('*'));
    coins.map(coin => {
      rowone.append($('<th />').html(coin));
    }) $('#tab').append(rowone);

    let koi_rate = $('<tr />');
    koi_rate.append($('<th />').html('KOI'));
    console.log(rate, coins) coins.map(coin => {
      if (typeof(rate[coin].KOI) != 'undefined' && rate[coin].KOI != null) {
        koi_rate.append($('<th />').html(rate[coin].KOI.toPrecision(4)));
      } else {
        koi_rate.append($('<th />').html('NA'));

      }
    }) $('#tab').append(koi_rate);

    let zeb_rate = $('<tr />');
    zeb_rate.append($('<th />').html('ZEB'));
    coins.map(coin => {
      if (rate[coin].ZEB != null) {
        zeb_rate.append($('<th />').html(rate[coin].ZEB.toPrecision(4)));
      } else {
        zeb_rate.append($('<th />').html('NA'));
      }

    }) $('#tab').append(zeb_rate);

    let koi = $('<tr />');
    koi.append($('<th />').html('INRK'));
    coins.map(coin => {
      koi.append($('<th />').html(prices[coin].KOI));
    }) $('#tab').append(koi);

    let zeb = $('<tr />');
    zeb.append($('<th />').html('INRZ'));
    coins.map(coin => {
      zeb.append($('<th />').html(prices[coin].ZEB));
    }) $('#tab').append(zeb);

    let usd = $('<tr />');
    usd.append($('<th />').html('USD'));
    coins.map(coin => {
      usd.append($('<th />').html(prices[coin].USD));
    }) $('#tab').append(usd);

    if (high != 0 && (high < rate.ETH.KOI || high < rate.ETH.ZEB)) {
      responsiveVoice.speak(high);
    }
    if (low != 0 && (low > rate.ETH.KOI || low > rate.ETH.ZEB)) {
      responsiveVoice.speak(low);
    }
    //responsiveVoice.speak(list[1].KOI.ETH, 'Hindi Female');

    //    $('#high').change(() => {
    //    console.log($('#high').val());

    //console.log( high < rate.ETH.KOI ||  high < rate.ETH.KOI);

    */
  })
})
