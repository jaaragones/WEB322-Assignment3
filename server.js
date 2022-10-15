/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: John Aeron Aragones   Student ID: 121107213   Date: Oct 14 ,2022
*
*  Online (Cyclic) Link: https://dead-red-shrimp-kit.cyclic.app
*
********************************************************************************/ 
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path  = require('path');

app.use(express.static('public'));
const dataServ = require('./data-service.js');
const fsf = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser')



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

app.get("/students/add", (req, res) => {
  res.sendFile(path.join(__dirname,'/views/addStudent.html'));
});

app.get("/images/add", (req, res) => {
  res.sendFile(path.join(__dirname,'/views/addImage.html'));
});

app.get("/images", (req, res) => {
  fsf.readdir(path.join(__dirname, "/public/images/uploaded"), function (err, items) {

    var obj = { images: [] };
    var size = items.length;
    for (var i = 0; i < items.length; i++) {
      obj.images.push(items[i]);
    }
    res.json(obj);
  });});


  // Urlencoded 
  app.use(bodyParser.urlencoded({ extended: true }));

 // Adding multer
  const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }});
  const upload = multer({storage:storage});



// Post Route
app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.post("/students/add", (req, res) => {
dataServ.addStudent(req.body)
.then(() => {
  res.redirect("/students");
})});


// Retrieves Students Data
app.get("/students", (req, res) => {
  if (req.query.status) {
    dataServ.getStudentsByStatus(req.query.status)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send(err);;
      })
  }
  else if (req.query.program) {
      dataServ.getStudentsByProgramCode(req.query.program)
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.send(err);
        })
    }
    else if (req.query.expectedCredential) {
      dataServ.getStudentsByExpectedCredential(req.query.expectedCredential)
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.send(err);
        })
    }
    else {
      dataServ.getAllStudents()
      .then((data) => {
          res.json(data);
        })
        .catch((err) => {
        console.log("Error retrieving students: " + err);
        res.json({ message: err });
        });
    }
  // dataServ.getAllStudents()
  //     .then((data) => {
  //       res.json(data);
  //     })
  //     .catch((err) => {
  //       console.log("Error retrieving students: " + err);
  //       res.json({ message: err });
  //     });
  });
  
  app.get("/students/:studentID", (req, res) => {
    dataServ.getStudentById(req.params.studentID)
    .then((data) => {
      res.json(data);
  })
  .catch((err) => {
    console.log(err);
    res.send(err);
  })
});

 

  app.get("/intlstudents", (req, res) => {
      dataServ.getInternationalStudents()
      .then((data) => {
        res.json(data);
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
