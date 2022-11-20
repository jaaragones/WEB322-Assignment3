// *********************************************** ASSIGNMENT 5 *************************************************************
const Sequelize = require('sequelize');

var sequelize = new Sequelize('lpuvneco', 'lpuvneco', 'q14PDogxGdwagYXbsZs0aAsVcz0uIXg-', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }
    , query: { raw: true }
});

var Student = sequelize.define('Student', {
    studentID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    phone: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    isInternationalStudent: Sequelize.BOOLEAN,
    expectedCredential: Sequelize.STRING,
    status: Sequelize.STRING,
    registrationDate: Sequelize.STRING
});

var Program = sequelize.define('Program', {
    programCode: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    programName: Sequelize.STRING
});

Program.hasMany(Student, { foreignKey: 'program' });
// **************************************************************************************************************************

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize
            .sync()
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject("Unable to sync with database");
            });
    });
}



// Students *********************************************************************************************
module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        studentData.isInternationalStudent = (studentData.isInternationalStudent) ? true : false;
        for (var i in studentData) {
            if (studentData[i] == "") {
                studentData[i] = null;
            }
        }
        Student.create({
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            phone: studentData.phone,
            addressStreet: studentData.addressStreet,
            addressCity: studentData.addressCity,
            addressState: studentData.addressState,
            addressPostal: studentData.addressPostal,
            isInternationalStudent: studentData.isInternationalStudent,
            program: studentData.program,
            expectedCredential: studentData.expectedCredential,
            status: studentData.status,
            registrationDate: studentData.registrationDate,
          })
            .then((students) => {
              resolve(students);
            })
            .catch(() => {
                reject("unable to create student");
            })
    });
}


module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        sequelize
            .Student.findAll(Student)
            .then(() => {
                resolve(Student);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}


module.exports.getInternationalStudents = function () {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where:
            {
                isInternationalStudent: true
            }
        })
            .then(function (Student) {
                resolve(Student);
            })
            .catch(() => {
                reject("no results returned");
            });
    });
}



module.exports.getStudentsByStatus = function (status) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where:
            {
                status: status
            }
        })
            .then(function (Student) {
                resolve(Student);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}

module.exports.getStudentsByProgramCode = function (programCode) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where:
            {
                program: programCode
            }
        })
            .then(function (programs) {
                resolve(programs);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}

module.exports.getStudentsByExpectedCredential = function (credential) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where:
            {
                expectedCredential: credential
            }
        })
            .then(function (credential) {
                resolve(credential);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}

module.exports.getStudentById = function (sid) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where:
            {
                studentID: sid
            }
        })
            .then(function (sid) {
                resolve(sid);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}

module.exports.updateStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        studentData.isInternationalStudent = (studentData.isInternationalStudent) ? true : false;
        for (var i in studentData) {
            if (studentData[i] == "") {
                studentData[i] = null;
            }
        }
        Student.update(
            {
              firstName: studentData.firstName,
              lastName: studentData.lastName,
              email: studentData.email,
              phone: studentData.phone,
              addressStreet: studentData.addressStreet,
              addressCity: studentData.addressCity,
              addressState: studentData.addressState,
              addressPostal: studentData.addressPostal,
              isInternationalStudent: studentData.isInternationalStudent,
              program: studentData.program,
              expectedCredential: studentData.expectedCredentials,
              status: studentData.status,
              registrationDate: studentData.registrationDate,
            },
            {
              where: {
                studentID: studentData.studentID,
              },
            }
          )
            .then(() => {
              resolve();
            })
            .catch(() => {
                reject("unable to create student");
            })
    });
}


// Program *************************************************************************************
module.exports.addProgram = function (programData) {
    return new Promise(function(resolve, reject)  {
        for (var i in programData) {
            if (programData[i] == "") {
                programData[i] = null;
            }
        }
        Program.create({
            programCode: programData.programCode,
            programName: programData.programName,
        })
            .then(() =>{ resolve();})
            .catch(() => reject("unable to create program"));
    });
};

// Adding new data-service.js functions
module.exports.getPrograms = function () {
    return new Promise(function (resolve, reject) {
        Program.findAll()
            .then(function(programs) {
                resolve(programs);
            })
            .catch(() => {
                reject("no results returned");
            });
    });
}


module.exports.updateProgram = function (programData) {
    return new Promise((resolve, reject) => {
        for (var i in programData) {
            if (programData[i] == "") {
                programData[i] = null;
            }
        }
        Program.update({ programName: programData.programName }, {
            where: {
                programCode: programData.programCode,
            },
        })
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject("could not update program");
            })
    });
}

module.exports.getProgramByProgramCode = function (pcode) {
    return new Promise(function(resolve, reject) {
        Program.findAll({
            where: {
                programCode: pcode,
            }
        }).then(function(program) {
            resolve(program[0]);
        }).catch(() => {
            reject("unable to update program");
        })
    });
}

module.exports.deleteProgramByCode = function (pcode) {
    return new Promise((resolve, reject) => {
        Program.destroy({
            where: {
                programCode: pcode
            }
        }).then(function (program) {
            resolve("destroyed");
        }).catch((err) => {
            reject("Destroy method encountered an error!");
        })
    });
}

module.exports.deleteStudentById = function (id) {
    return new Promise((resolve, reject) => {
        Student.destroy({
            where: {
                studentID: id
            }
        }).then(() => resolve())
            .catch(() => reject("Destroy method encountered an error!"));
    });
};







