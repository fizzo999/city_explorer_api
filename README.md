# city_explorer_api
code 301 lab6 project - introduction to building a server app

# Project Name

**Author**: Fizzo Pannosch
**Version**: 1.0.2  

## Overview
<!-- Provide a high level overview of what this application is and why you are building it, beyond the fact that it's an assignment for this class. (i.e. What's your problem domain?) -->
This app is an exercise in connecting a Javascript server (server.js) application to a frontend (cityexploerer) and as a first step take dummy data that lives on our local machine and renders it useful to the front end application where it will be displayed. For that we create 2 routes (/weather and /location) and send the appropriately formatted data.

## Getting Started
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->
setup correct file structure, npm init, npm install -S express dotenv cors, then setup the server.js file

## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->
we use a Javascript server.js file that utilizes the libraries express and cors and dotenv. We are using locally stored dummy data that is JSON formatted (so it is getting us ready for real outbound server calls)

## Change Log
<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples: -->

02-22-2021 4:30pm - Application now has a fully-functional express server, with two GET routes (/location and /weather on PORT:3000) for the location resource.

## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application.
 -->
 thank you for helping with a debug issue to James Mansour.
 thank you to Ron Dunphy for helping me fix my app. We found the right path for all the data - even if we had to keep moving ports (to 3005) lol. 
 thank you Dario Thornhill for helping me find the correct variables from the data that comes back (both server and sql)
 thank you Ron Dunphy for more help on understanding header requests


Number and name of feature: 2 GET routes and 2 x json data formatted correctly

Estimate of time needed to complete: 4:00 HRS

Start time: 2:00 PM

Finish time: 4:30 PM

Actual time needed to complete: 2,5 HRS

<hr>

Number and name of feature: code review with Barrett Nance

Estimate of time needed to complete: 1 HOUR

Start time: 2:15PM

Finish time: 3:15PM

Actual time needed to complete: 1 HOUR

<hr>

Number and name of feature: map live location data

Estimate of time needed to complete: 2 HOUR

Start time: 3:15PM

Finish time: 4:15PM

Actual time needed to complete: 1 HOUR

<hr>

Number and name of feature: map finished weather data live

Estimate of time needed to complete: 2 HOUR

Start time: 5:30PM

Finish time: 8:30PM

Actual time needed to complete: 3 HOUR

<hr>

Number and name of feature: weather data live finished and parks

Estimate of time needed to complete: 2 HOUR

Start time: 8:30PM

Finish time: 10:30PM

Actual time needed to complete: 2 HOUR
<hr>

Number and name of feature: map finished weather data live

Estimate of time needed to complete: 2 HOUR

Start time: 5:30PM

Finish time: 8:30PM

Actual time needed to complete: 3 HOUR

<hr>

### 02/25/2021 

Number and name of feature: transfer fake data for yelp and movies, API keys, constructor, error handling

Estimate of time needed to complete: 2 HOUR

Start time: 5:30AM

Finish time: 8:30AM

Actual time needed to complete: 3 HOUR

<hr>

### 02/25/2021 

Number and name of feature: fix database call - variable; fix movies variable - find url link

Estimate of time needed to complete: 2 HOUR

Start time: 2:00PM

Finish time: 5:00PM

Actual time needed to complete: 3 HOUR

<hr>

### 02/25/2021 

Number and name of feature: finish up with yelp + pagination

Estimate of time needed to complete: 2 HOUR

Start time: 6:00PM

Finish time: 8:00PM

Actual time needed to complete: 2 HOUR