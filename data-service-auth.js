const bcrypt = require('bcryptjs');
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  userName: { type: String, unique: true },
  password: String,
  email: String,
  loginHistory: [{
    dataTime: { type: Date, default: Date.now },
    userAgent: String
  }]
});

const initialize = function () {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection("mongodb+srv://user:user123@cluster0.smxv1pp.mongodb.net/?retryWrites=true&w=majority");

    db.on('error', (err) => {
      reject(err); // reject the promise with the provided error
    });
    db.once('open', () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};


const registerUser = function (userData) {
  return new Promise(function (resolve, reject) {
    if (userData.password != userData.password2) {
      reject('Passwords do not match');
    }

    bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(userData.password, salt))
      .then(hash => {
        userData.password = hash;
        let newUser = new User(userData);
        newUser.save(function (err) {
          if (err) {
            if (err.code == 11000) {
              reject('User Name already taken');
            } else {
              reject('There was an error creating the user: err');
            }
          } else {
            resolve();
          }
        });
      })
      .catch(err => {
        reject('There was an error encrypting the password');
      });
  });
}

const checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.find({ userName: userData.userName }, (err, users) => {
      if (err) {
        reject('Unable to find user: ' + userData.userName);
      }
      if (users.length == 0) {
        reject('Unable to find user: ' + userData.userName);
      } else {
        bcrypt.compare(userData.password, users[0].password).then((result) => {
          if (!result) {
            reject('Incorrect Password for user: ' + userData.userName);
          } else {
            users[0].loginHistory.push({ dateTime: (new Date()).toString(), userAgent: userData.userAgent });
            User.updateOne({ userName: users[0].name }, { $set: { ...users[0] } }, function (err, res) {
              if (err) {
                reject('There was an error verifying the user: ' + err);
              } else {
                resolve(users[0]);
              }
            });
          }
        });
      }
    })

  });
}


module.exports = {
  initialize,
  checkUser,
  registerUser
};