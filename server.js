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
const dataServ = require('./data-service.js');



function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,'/views/home.html'));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname,'/views/about.html'));
});

// Retrieves Students Data
app.get("/students", (req, res) => {
  dataServ.getAllStudents()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log("Error retrieving students: " + err);
        res.json({ message: err });
      });
        
  });

  app.get("/intlstudents", (req, res) => {
      dataServ.getInternationalStudents()
      .then((data) => {
        res.json(result);
    })
  });

    app.get("/programs", (req, res) => {
        dataServ.getPrograms()
         .then((data) => {
        res.json(data);
      })
  });


  app.use((req, res) => {
    res.status(404).send("<h2>404</h2><p>Im sorry! The page you are trying to reach is NOT FOUND!</p>");
});


// setup http server to listen on HTTP_PORT
dataServ.initialize()
.then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err)=>{
    console.log("Error: ", err)
})
