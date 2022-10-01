/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: John Aeron Aragones   Student ID: 121107213   Date: Sept 30 ,2022
*
*  Online (Cyclic) Link: https://awful-dog-shawl.cyclic.app
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path  = require('path');

app.use(express.static('public'));
var data = require(path.join(__dirname, 'data-service.js'));

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,'/views/home.html'));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname,'/views/about.html'));
});

// Retrieves Students Data
app.get("/students", (req, res) => {
    data.getStudents()
      .then((data) => {
        console.log("Error retrieving managers: " + err);
        res.json(data);
      })
  });

  app.get("/intIStudents", (req, res) => {
      data.getIntIStudents()
      .then((data) => {
     if(data.isInternationalStudent == true){
        res.json(data);
      }
    })
  });

  app.get("/programs", (req, res) => {
    data.getPrograms()
      .then((data) => {
        res.json(data);
      })
  });


  app.use((req, res) => {
    res.status(404).send("<h2>404</h2><p>Im sorry! The page you are trying to reach is NOT FOUND!</p>");
});


// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT,() => {
    console.log('Express http server listening on ${HTTP_PORT}')
});