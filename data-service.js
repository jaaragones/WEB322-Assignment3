const fsf = require('fs');
var students = [];
var programs = [];

module.exports.initialize = function(){
    return new Promise((resolve, reject) => {
        fsf.readFile('./data/students.json', 'utf8',(err,data)=>{
            if(err){
                reject("Unable to read file!"); return;
successfully            } 
            students = JSON.parse(data);
        });
        fsf.readFile('./data/programs.json', 'utf8',(err,data)=>{
            if(err){
                reject("unable to read file!"); return;
            } 
            programs = JSON.parse(data);
        });
        resolve("Data has been read successfully!");
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve, reject) =>{
        if(students.length == 0){
            reject("There are no students listed!"); return;
        }
        resolve(students);
    });
}

module.exports.getInternationalStudents = function(){
    return new Promise((resolve, reject) => {
        var intStudents = students.filter(s => s.isInternationalStudent === true);
        if(intStudents == 0){
            reject("There are no International Students listed!"); return;
        }
        resolve(intStudents);
    });
}

module.exports.getPrograms = function(){
    return new Promise((resolve, reject) =>{
        if(programs.length == 0){
            reject("There isn't any programs listed!"); return;
        }
        resolve(programs);
    });
}

module.exports.addStudent = function(studentData){
    return new Promise((resolve, reject) =>{
        if(studentData.isInternationalStudent  === undefined){
            studentData.isInternationalStudent  == false;
        }
        else{
            studentData.isInternationalStudent  == true;
        }
        
        let tempArr = new Array();
        for(let i = 0; i < students.length; i++) {
            tempArr.push(parseInt(students[i].studentID));
        }
        studentData.studentID = Math.max.apply(Math, tempArr) + 1;
        students.push(studentData);
        resolve(students)
    }); 
}

module.exports.getStudentsByStatus = function(status){
    return new Promise((resolve, reject) => {
        let tempArr = new Array();
        for(let i = 0; i < students.length; i++) { 
           if(students[i].status == status)
            tempArr.push(students[i]); 
         }
         if(tempArr.length === 0){
            reject("There isn't any students that has " + status + " status!");
         }
        resolve(tempArr);
    });
}

module.exports.getStudentsByProgramCode = function(programCode){
    return new Promise((resolve, reject) => {
        let tempArr = new Array();
        for(let i = 0; i < students.length; i++) { 
           if(students[i].program == programCode)
            tempArr.push(students[i]); 
         }
         if(tempArr.length === 0){
            reject("There isn't any students in" + programCode + " program!");
         }

        resolve(tempArr);
    });
}

module.exports.getStudentsByExpectedCredential = function(credential){
    return new Promise((resolve, reject) => {
        let tempArr = new Array();
        for(let i = 0; i < students.length; i++) { 
           if(students[i].expectedCredential == credential)
            tempArr.push(students[i]); 
         }
         if(tempArr.length === 0){
            reject("There isn't any students under" + credential + "!");
         }

        resolve(tempArr);
    });
}

module.exports.getStudentById = function(sid){
    return new Promise((resolve, reject) => {
        let tempArr = new Array();
        for(let i = 0; i < students.length; i++) { 
           if(students[i].studentID == sid)
            tempArr.push(students[i]); 
         }
         if(tempArr.length === 0){
            reject("There isn't any students who has an ID of " + sid + "!");
         }

        resolve(tempArr);
    });
}