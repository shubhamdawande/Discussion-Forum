const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/database');

// create mongoose schema for user info
var Schema = mongoose.Schema;
var userSchema = new Schema({
  name:{
    type: String,
  },
  email:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
});

// export user model
var User = mongoose.model('User', userSchema);
module.exports = User;

// methods to get user from ID and username
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username};
  User.findOne(query, callback);
};

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePasswords = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err) throw (err);
    callback(null, isMatch);
  });
}

module.exports.getAllUsernames = function(callback){
  User.find({}, 'username', (err,allUsers)=>{
    if(err) throw err;
    else {
      callback(null, allUsers);
    }
  });
};
