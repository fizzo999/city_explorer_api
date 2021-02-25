// ============== Packages ==============================
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();


// ============== App ===================================
const app = express();
app.use(cors());
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
client.on('error', error => console.log('There was an error like dudh', error));

const PORT = process.env.PORT || 3010;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const PARKS_API_KEY = process.env.PARKS_API_KEY;
// const RESTAURANT_API_KEY = process.env.RESTAURANT_API_KEY;
// ============== Routes ================================
app.get('/location', handleGetLocation);
app.get('/weather', handleWeatherRequest);
app.get('/parks', handleGetParks);
// app.get('/restaurants', handleGetRestaurants);

function handleGetLocation(req, res) {
  let city = req.query.city;
  const sqlCheckingString = 'SELECT * FROM previous_requests WHERE search_query=$1';
  const sqlCheckingArray = [req.query.city];
  client.query(sqlCheckingString, sqlCheckingArray)
    .then(stuffFromPostgresql => {
      if (stuffFromPostgresql.rows.length > 0) {
        //here we want to retrieve that entire row and send it to the front end  ??? constructor ???
        // res.send([req.query.search_query, req.query.formatted_query, req.query.latitude, req.query.longitude]);
        res.send(stuffFromPostgresql.rows[0]);
      } else {
        let url1 = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json`;
        superagent.get(url1)
          .then(stuffThatComesBack => {
            const output = new Location(stuffThatComesBack.body, city);
            res.send(output);
            const sqlString = 'INSERT INTO previous_requests (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4)';
            const sqlArray = [req.search_query, req.formatted_query, req.latitude, req.longitude];
            client.query(sqlString, sqlArray)
              .then(() => res.redirect('/'));
          }).catch(errorThatComesBack => {
            console.log(errorThatComesBack);
            res.status(500).send('Sorry something went wrong with LOCATION');
          });
      }
    });
}

function Location(hereNow, cityName) {
  this.search_query = cityName;
  this.formatted_query = hereNow[0].display_name;
  this.latitude = hereNow[0].lat;
  this.longitude = hereNow[0].lon;
}

function handleWeatherRequest(req, res) {
  const cityName = req.query.search_query;
  // const lat = req.query.latitude;
  // const lon = req.query.longitude;
  // let url3 = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}&include=minutely`;
  let url3 = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${WEATHER_API_KEY}&include=minutely`;
  superagent.get(url3)
    .then(stuffThatComesBack2 => {
      const weatherLiveArray = stuffThatComesBack2.body.data.map(day => new Weather(day));
      res.send(weatherLiveArray);
    })
    .catch(errorThatComesBack => {
      console.log(errorThatComesBack);
      res.status(500).send('Sorry something went wrong with WEATHER');
    });
}

function Weather(weatherData) {
  this.forecast = weatherData.weather.description;
  this.time = weatherData.datetime;
}

function handleGetParks(req, res) {
  const parkCode = req.query.formatted_query;
  // const lat = req.query.latitude;
  // const lon = req.query.longitude;
  const url4 = `https://developer.nps.gov/api/v1/parks?q=${parkCode}&api_key=${PARKS_API_KEY}`;
  superagent.get(url4)
    .then(stuffThatComesBack3 => {
      const natParksArray = stuffThatComesBack3.body.data.map(park => new Parks(park));
      res.send(natParksArray);
    })
    .catch(errorThatComesBack => {
      console.log(errorThatComesBack);
      res.status(500).send('Sorry something went wrong with the PARKS');
    });
}


function Parks(parksData) {
  this.name = parksData.fullName;
  this.address = `${parksData.addresses[0].line1} ${parksData.addresses[0].city} ${parksData.addresses[0].stateCode} ${parksData.addresses[0].postalCode}`;
  if (parksData.entranceFees[0].cost) {
    this.fee = parksData.entranceFees[0].cost;
  } else {
    this.fee = 'no cost found';
  }
  // this.fee = parksData.entranceFees[0].cost ? parksData.entranceFees[0].cost : 'no cost found';
  this.description = parksData.description;
  this.url = parksData.url;
}

function handleGetRestaurants(req, res) {
  const city = req.query.city;
  // const url5 = `https://developer.nps.gov/api/v1/parks?q=${city}&api_key=${RESTAURANT_API_KEY}`;
  superagent.get(url5)
    .then(stuffThatComesBack4 => {
      const restaurantsArray = stuffThatComesBack4.body.data.map(restaurant => new Parks(restaurant))
      res.send(restaurantsArray);
    })
    .catch(errorThatComesBack => {
      console.log(errorThatComesBack);
      res.status(500).send('Sorry something went wrong with the RESTAURANTS');
    });
}
// ============== Initialization ========================

client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`app is up on port http://localhost:${PORT}`));
  });


