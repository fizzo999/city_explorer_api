/*
- create and clone down a github repository
- touch server.js
- npm init
- npm install -S express dotenv cors
- setup the server.js file
  - load the packages
  - create the app
  - create routes
  - start the server
- THEN work on your routes
*/

/*
The Environment: the collection of all variables that belong the the terminal window your code is running in
I want to use the PORT the computer wants me to use since the port is a computerish thing
I will pick my port from the environment.
creating a variable in your terminal's env is `export VARNAME=value`
It is semantic to name your variables in all caps
If I want to look at the env variables in the terminal type: `env`
if I want to see them in javascript: `process.env.VARNAME`
As devs, we can save our environment variables in a file called `.env`
When data is sent from the client to the back end it comes in a property: `request.query`
*/


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
function handleGetLocation(req, res) {
  // console.log(req.query);
  // const dataFromTheFile = require('./data/location.json');
  // let searchstring = req.query;
  const city = req.query.city;
  let url1 = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json`;

  superagent.get(url1)
    .then(stuffThatComesBack => {
      // console.log('!!!!!!!!!!!!!!!!!!', stuffThatComesBack.body);
      const output = new Location(stuffThatComesBack.body, req.query.city);
      // console.log(stuffThatComesBack.body);
      res.send(output);
    });

  // for (let i = 0; i < dataFromTheFile.length; i++) {
  //   output.push(new Location(dataFromTheFile[0], req.query.city));
  // }
  // const output = new Location(dataFromTheFile, req.query.city);
  // res.send(output);
}
function Location(hereNow, cityName) {
  this.search_query = cityName;
  this.formatted_query = hereNow[0].display_name;
  this.latitude = hereNow[0].lat;
  this.longitude = hereNow[0].lon;
}

app.get('/weather', handleWeatherRequest);
function handleWeatherRequest(req, res) {


  const lat = req.query.latitude;
  const lon = req.query.longitude;
  let url3 = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}&include=minutely`;
  superagent.get(url3)
    .then(stuffThatComesBack2 => {
      console.log('line 85 !!!!!!', stuffThatComesBack2.body);
      const weatherLiveArray = [];
      weatherLiveArray.push(new Weather(stuffThatComesBack2.body.data[0], req.query.city));
      console.log('this is line 86', weatherLiveArray);
      res.send(weatherLiveArray);
    })
    .catch(errorThatComesBack => {
      console.log(errorThatComesBack);
      res.status(500).send('Sorry something went wrong');
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

app.get('/parks', handleGetParks);
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

