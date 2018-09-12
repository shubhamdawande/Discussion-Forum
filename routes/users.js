const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// User Registration
router.post('/register', (req, res, next)=>{
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user)=>{
    if(err){
      res.json({success: false, msg: 'failed to register user'});
    }else{
      res.json({success: true, msg: 'user registered'});
    }
  });
});

// User Login
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  //console.log('req: ', req.body);

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg:'User not found'});
    }

    User.comparePasswords(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign({data:user}, config.secret, {
          expiresIn: 604800 // 1 week time in seconds
        });
        //console.log(token);
        res.json({
          success: true,
          token: `Bearer ${token}`,
          user:{
            id: user._id,
            name:user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong Password'});
      }
    });
  });
});

// User Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req,res,next)=>{
  res.json({user: req.user});
})

// getting all users for chat
router.get('/all', (req,res,next)=>{
  User.getAllUsernames((err, allUsernames)=>{
    if(err) throw err;
    //console.log('allUsernames', allUsernames);
    res.send({success:true, data: allUsernames});
  });
});


module.exports = router;
