// ============== Packages ==============================
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');


// ============== App ===================================
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3010;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const PARKS_API_KEY = process.env.PARKS_API_KEY;
// const RESTAURANT_API_KEY = process.env.RESTAURANT_API_KEY;
// ============== Routes ================================
app.get('/location', handleGetLocation);
app.get('/weather', handleWeatherRequest);
app.get('/parks', handleGetParks);

function handleGetLocation(req, res) {
  const city = req.query.city;
  let url1 = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json`;
  superagent.get(url1)
    .then(stuffThatComesBack => {
      const output = new Location(stuffThatComesBack.body, city);
      res.send(output);
    }).catch(errorThatComesBack => {
      console.log(errorThatComesBack);
      res.status(500).send('Sorry something went wrong with LOCATION');
    });
}
function Location(hereNow, cityName) {
  this.search_query = cityName;
  this.formatted_query = hereNow[0].display_name;
  this.latitude = hereNow[0].lat;
  this.longitude = hereNow[0].lon;
}

function handleWeatherRequest(req, res) {
  // const cityName = req.query.search_query;
  const lat = req.query.latitude;
  const lon = req.query.longitude;
  let url3 = `https://api.weatherbit.io/v2.0/daily?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}&include=minutely`;
  // let url3 = `https://api.weatherbit.io/v2.0/daily?city=${cityName}&key=${WEATHER_API_KEY}&include=minutely`;
  superagent.get(url3)
    .then(stuffThatComesBack2 => {
      const weatherLiveArray = stuffThatComesBack2.body.data.map(day => new Weather(day));
      res.send(weatherLiveArray);
    })
    .catch(errorThatComesBack => {
      console.log(errorThatComesBack);
      res.status(500).send('Sorry something went wrong with WEATHER');
    });

  // ==========for my own reference to understand map functions better - here is three different ways to write the same code !!!===========

  // const weatherLiveArray = weatherJSON.data.map(stuffFromWeatherJSON => new Weather(stuffFromWeatherJSON));

  // const weatherLiveArray = weatherJSON.data.map(callback1);
  // function callback1(dataFromTheWeather) {
  //   return new Weather(dataFromTheWeather);
  // }

  // const weatherLiveArray = [];
  // weatherJSON.data.map(callback1);
  // function callback1(dataFromTheWeather) {
  //   weatherLiveArray.push(new Weather(dataFromTheWeather));
  // }

  // const output2 = [];
  // for (let i = 0; i < weatherJSON.data.length; i++) {
  //   output2.push(new Weather(weatherJSON.data[i]));
  // }
  // res.send(output2);
  // res.send(weatherLiveArray);
}

function Weather(object) {
  this.forecast = object.weather.description;
  this.time = object.datetime;

}


function handleGetParks(req, res) {

  const lat = req.query.latitude;
  const lon = req.query.longitude;


  let url4 = `https://developer.nps.gov/api/v1/parks?q=${req.query.city}&api_key=${PARKS_API_KEY}`;
  superagent.get(url4)
    .then(stuffThatComesBack3 => {
      console.log('line 136 !!!!!!', stuffThatComesBack3.body);
      const natParksArray = [];
      for (let i = 0; i < stuffThatComesBack3.body.data.length; i++) {
        natParksArray.push(new Parks(stuffThatComesBack3.body.data[0]));
      }
      console.log('this is line 139', natParksArray);
      res.send(natParksArray);
    })
    .catch(errorThatComesBack => {
      console.log(errorThatComesBack);
      res.status(500).send('Sorry something went wrong with the PARKS');
    });
}

function Parks(object) {
  this.name = object.fullName;
  this.address = object.addresses[0].line1;
  this.fee = object.fees;
  this.description = object.description;
  this.landscape = 'e';
  this.url = object.url;
}




app.get('/restaurants', handleGetRestaurants);

function handleGetRestaurants(req, res) {

  const restaurantJSON = require('./data/restaurants.json');

  // const firstRest = {
  //   name: restaurantJSON.nearby_restaurants[0].restaurant.name,
  //   area: restaurantJSON.nearby_restaurants[0].restaurant.location.locality_verbose,
  //   // Cannot read property 'locality_verbose' of undefined // the thing to the left is undefined
  //   cuisines: restaurantJSON.nearby_restaurants[0].restaurant.cuisines,
  // };

  const output = [];
  for (let i = 0; i < restaurantJSON.nearby_restaurants.length; i++) {
    output.push(new Restaurant(restaurantJSON.nearby_restaurants[i].restaurant));
  }

  res.send(output);
}
// ============== Initialization ========================
app.listen(PORT, () => console.log(`app is up on port http://localhost:${PORT}`)); // this is what starts the server

