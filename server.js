/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: John Aeron Aragones   Student ID: 121107213   Date: NOV 04 ,2022
*
*  Online (Cyclic) Link: https://dead-red-shrimp-kit.cyclic.app
*
********************************************************************************/
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require('path');
const dataServ = require('./data-service.js');
const fsf = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
const { resolveSoa } = require("dns");
const exphbs = require("express-handlebars");
app.use(express.static('public'));


function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}


//********************************************************************************************** */
//ASS 4
// setting up Handlebars
app.engine('.hbs', exphbs.engine({
  extname: '.hbs', defaultLayout: 'main',
  helpers: {
    navLink: function (url, options) {
      return '<li' +
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },

    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));
app.set('view engine', '.hbs');


// activeRoute
app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
});

//********************************************************************************************** */
app.post("/student/update", (req, res) => {
  console.log(req.body);
  res.render()
});

app.post("/student/update", (req, res) => {
  data.updateStudent(req.body).then((data) => {
    console.log(req.body);
    res.redirect("/students");
  }).catch((err) => {
    console.log(err);
  })
});



// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname,'/views/home.html'));
  res.render("home");
});

app.get("/about", (req, res) => {
  // res.sendFile(path.join(__dirname,'/views/about.html'));
  res.render("about");
});

app.get("/students/add", (req, res) => {
  // res.sendFile(path.join(__dirname,'/views/addStudent.html'));
  //res.render("addStudent");
  dataServ.getPrograms()
  .then((data) =>{
    res.render("addStudent",{programs: data});
  })
  .catch(() => {
    res.render("addStudent", {programs: []}); 
  })
});

app.get("/images/add", (req, res) => {
  // res.sendFile(path.join(__dirname,'/views/addImage.html'));
  res.render("addImage");
});

//********************************************************************************************** */
// Urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));

// Adding multer
const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


// Post Route
app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.post("/students/add", (req, res) => {
  dataServ.addStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
});


app.get("/images", (req, res) => {
  fsf.readdir(path.join(__dirname, "/public/images/uploaded"), function (err, items) {

    var obj = { images: [] };
    var size = items.length;
    for (var i = 0; i < items.length; i++) {
      obj.images.push(items[i]);
    }
    res.render("images", obj);
  });
});


// Retrieves Students Data
app.get("/students", (req, res) => {
  if (req.query.status) {
    dataServ.getStudentsByStatus(req.query.status)
      .then((data) => {
        if (data.length > 0) {
          res.render("students", { students: data });
        }
        else {
          res.render("students", { message: "no results" });
        }
      })
      .catch((err) => {
        res.render({ message: "no results" });
      })
  }
  else if (req.query.program) {
    dataServ.getStudentsByProgramCode(req.query.program)
      .then((data) => {
        if (data.length > 0) {
          res.render("students", { students: data });
        }
        else {
          res.render("students", { message: "no results" });
        }
      })
      .catch((err) => {
        res.render("students", { message: "no results" });
      })
  }
  else if (req.query.expectedCredential) {
    dataServ.getStudentsByExpectedCredential(req.query.expectedCredential)
      .then((data) => {
        if (data.length > 0) {
          res.render("students", { students: data });
        }
        else {
          res.render("students", { message: "no results" });
        }
      })
      .catch((err) => {
        res.render("students", { message: "no results" });
      })
  }
  else {
    dataServ.getAllStudents()
      .then((data) => {
        if (data.length > 0) {
          res.render("students", { students: data });
        }
        else {
          res.render("students", { message: "no results" });
        }
      })
      .catch((err) => {
        res.render("students", { message: "no results" });
      });
  }
});

app.get("/student/:studentId", (req, res) => {

  // initialize an empty object to store the values
  let viewData = {};

  dataServ.getStudentById(req.params.studentId).then((data) => {
      if (data) {
          viewData.student = data; //store student data in the "viewData" object as "student"
      } else {
          viewData.student = null; // set student to null if none were returned
      }
  }).catch(() => {
      viewData.student = null; // set student to null if there was an error 
  }).then(dataServ.getPrograms)
  .then((data) => {
      viewData.programs = data; // store program data in the "viewData" object as "programs"

      // loop through viewData.programs and once we have found the programCode that matches
      // the student's "program" value, add a "selected" property to the matching 
      // viewData.programs object

      for (let i = 0; i < viewData.programs.length; i++) {
          if (viewData.programs[i].programCode == viewData.student.program) {
              viewData.programs[i].selected = true;
          }
      }

  }).catch(() => {
      viewData.programs = []; // set programs to empty if there was an error
  }).then(() => {
      if (viewData.student == null) { // if no student - return an error
          res.status(404).send("Student Not Found");
      } else {
          res.render("student", { viewData: viewData }); // render the "student" view
      }
  }).catch((err)=>{
      res.status(500).send("Unable to Show Students");
    });
});


app.get("/intlstudents", (req, res) => {
  dataServ.getInternationalStudents(req.query.isInternationalStudent)
    .then((data) => {
      res.render("students", { students: data });
    })
    .catch((err) => {
      res.render({ message: "no results" });
    })
});

app.get("/programs", (req, res) => {
  dataServ.getPrograms()
    .then((programs) => {
      if (programs.length > 0) {
        res.render("programs", { data: programs });
      }
      else {
        res.render("programs", { message: "no results" });
      }
    }).catch(() => {
      res.render("programs", { message: "no results" })
    })
});

// new  Routes for Assignment 5
app.get("/programs/add", (req, res) => {
  res.render("addProgram");
});

app.post("/programs/add",(req, res) => {
  dataServ.addProgram(req.body)
    .then(() => {
      res.redirect("/programs")
    });
});

app.post("/program/update", (req, res) => {
  dataServ
    .updateProgram(req.body)
    .then(() => {
      res.redirect("/programs");
    }).catch((err) => {
      res.status(500).send("Unable to Update Program");
    });
});

app.get("/program/:programCode",(req, res) => {
  dataServ
    .getProgramByProgramCode(req.params.programCode)
    .then((data) => {
      if (data.length > 0) {
        res.render("program", { program: data });
      }
      else {
        res.status(404).send("Program Not Found");
      }
    })
    .catch((err) => {
      res.status(404).send("Program Not Found");
    });
});

app.get("/program/delete/:programCode",(req, res) => {
  dataServ
    .deleteProgramByCode(req.params.programCode)
    .then(() => {
      res.redirect("/programs")
    })
    .catch(() => {
      res.status(500).send("Unable to Remove Program / Program not found");
    });
});

app.get("/student/delete/:studentID", (req, res) => {
  dataServ
    .deleteStudentById(req.params.studentID)
    .then(() => res.redirect("/students"))
    .catch(() => {
      res.status(500).send("Unable to Remove Student / Student not found")
    });
});

app.use((req, res) => {
  res.status(404).send("<h2>404</h2><p>Im sorry! The page you are trying to reach is NOT FOUND!</p>");
});


// setup http server to listen on HTTP_PORT
dataServ.initialize()
  .then(() => {
    app.listen(HTTP_PORT, onHttpStart);
  }).catch((err) => {
    console.log("Error: ", err)
  })
