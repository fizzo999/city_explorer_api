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
// let req = [];

// const errormessage = {
//   status: 500,
//   responseText: "Sorry, something went wrong",
// };

const express = require('express');
const cors = require('cors');
require('dotenv').config();


// ============== App ===================================
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3009;



// ============== Routes ================================

// function checkInput(req) {
//   if (!req.query) {
//     // console.log(errormessage);
//     res.send(errormessage);

//   }
// }

app.get('/location', handleGetLocation);
function handleGetLocation(req, res) {
  console.log(req.query);
  const dataFromTheFile = require('./data/location.json');

  // const output = {
  //   search_query: 'Seattle',
  //   formatted_query: 'Seattle, WA, USA',
  //   latitude: dataFromTheFile[0].lat,
  //   longitude: dataFromTheFile[0].lon
  // };

  const output = new Location(dataFromTheFile, req.query.city);

  res.send(output);

}

function Location(dataFromTheFile, cityName) {
  this.search_query = cityName;
  this.formatted_query = dataFromTheFile[0].display_name;
  this.latitude = dataFromTheFile[0].lat;
  this.longitude = dataFromTheFile[0].lon;
}




app.get('/weather', handleWeatherRequest);

function handleWeatherRequest(req, res) {
  const weatherJSON = require('./data/weather.json');

  // const output2 = [
  //   {
  //     "forecast": "Partly cloudy until afternoon.",
  //     "time": "Mon Jan 01 2001"
  //   },
  //   {
  //     "forecast": "Mostly cloudy in the morning.",
  //     "time": "Tue Jan 02 2001"
  //   },
  // ];


  const output2 = [];

  for (let i = 0; i < weatherJSON.data.length; i++) {
    output2.push(new Weather(weatherJSON.data[i]));
  }



  res.send(output2);

}

function Weather(object) {
  this.forecast = object.weather.description;
  this.time = object.datetime;

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

