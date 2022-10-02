const fsf = require('fs');
var students = [];
var programs = [];

module.exports.initialize = function(){
    return new Promise((resolve, reject) => {
        fsf.readFile('./data/students.json', 'utf8',(err,data)=>{
            if(err){
                reject("Unable to read file!"); return;
            } 
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