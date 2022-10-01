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

app.get("/students", (req, res) => {
    data.getStudents()
      .then((data) => {
        res.json(data);
      })
      res.status(500).jsonp({ error: 'message' })
// => callback({ "error": "message" })
  });

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);