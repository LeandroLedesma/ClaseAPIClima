var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express()

var apiKey = '80c1245dc664673c681da5a0f58cf629';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')


var provincies = {};
app.get ('/', function (req,res){
  
  var url = 'https://apis.datos.gob.ar/georef/api/provincias';
  request(url, function(err,response, data){
    provincies = JSON.parse(data);
    res.render('index', {weather: null, error: null, provincies: provincies});
  })
})

app.post('/', function (req, res) {

  var location = JSON.parse(req.body.location);
  var lat = location.lat;
  var lon = location.lon;
  var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  request(url, function (err, response, data) {
    if (err){
      res.render('index', {weather: null, error: err, provincies: [provincies]});
    } else{
      var weather = JSON.parse (data);
      console.log(weather);
      if (weather.cod != 200){
        res.render('index', {weather: null, error: 'Error, please try again', provincies: provincies});
      } else {
        
        var weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null , provincies: provincies});
      }
    }

    /*if(err){
      res.render('index', {weather: null, error: err});
    } else {
      //console.log(data)
      var weather = JSON.parse(data)

      if(weather.cod != 200){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        var w = weather.list[0];
        
        var weatherText = `It's ${w.main.temp} degrees in ${w.name}!`;
        res.render('index', {weather: weatherText, error: null});
      }
    }*/
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
