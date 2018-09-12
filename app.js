const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/database');
const socket = require('socket.io');

// mongoose
mongoose.connect(config.database, { useNewUrlParser: true });

// on successful connection
mongoose.connection.on('connected', () => {
  console.log('Connected to mongodb database:' + config.database);
});
// on connection error
mongoose.connection.on('error', (err) => {
  console.log('Connection error:'+err);
});

const app = express();
const port = process.env.PORT || 8080;
const users = require('./routes/users');
const posts = require('./routes/posts');

// Cors & bodyparser middleware
app.use(cors());

// static public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// user route
app.use('/users', users);

// browse posts route
app.use('/', posts);

// root index route
app.get('/', (req,res) => {
  res.send('Invalid Endpoint');
});

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

var server = app.listen(port, () => {
  console.log('server started on port '+port);
});

var io = socket(server);
//var usernames = {};

io.on('connection',(socket)=>{

    //console.log('new connection made.');
    // join client
    socket.on('join', function(data){
      socket.join(data.room);
      console.log(data.user + ' joined the room : ' + data.user);
      socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:' is online now'});
    });

    // diconnect client
    socket.on('leave', function(data){
      console.log(data.user + 'left the room : ' + data.room);
      socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'is offline now.'});
      socket.leave(data.room);
    });

    socket.on('message',function(data){
        io.in(data.room).emit('new message', {user:data.user, message:data.message});
    })
});

/*
io.on('connection',(socket)=>{

    //console.log('new connection made.');
    // join client
    socket.on('join', function(data){
      //console.log('data', data);

      // is other user is offline
      if (usernames[data.room] == undefined || usernames[data.room] == null){
        // to indicate that user is online & other user if offline
        usernames[data.user] = data.user;
        socket.join(data.user);
        console.log(data.user + ' joined the room : ' + data.user);
        socket.broadcast.to(data.user).emit('new user joined', {user:data.user, message:' has joined this room'});
      } // only join if other user is online
      else if (usernames[data.room] != undefined && usernames[data.room] != null){
        usernames[data.user] = data.room;
        socket.join(data.room);
        console.log(data.user + ' joined the room : ' + data.room);
        socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:' has joined this room.'});
        //io.socket.emit('usernamesList', usernames);
      }
      //console.log('usernames', usernames);
    });

    // diconnect client
    socket.on('leave', function(data){
      // first to join
      if(usernames[data.user] == data.user){
        console.log(data.user + 'left the room : ' + data.user);
        socket.broadcast.to(data.user).emit('left room', {user:data.user, message:'has left this room.'});
        socket.leave(data.user);
      } // second to join
      else if (usernames[data.user] == data.room) {
        console.log(data.user + 'left the room : ' + data.room);
        socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this room.'});
        socket.leave(data.room);
      }
      // to indicate user is offline
      usernames[data.user] = null;
    });

    socket.on('message',function(data){
      if(usernames[data.user] == data.user){
        io.in(data.user).emit('new message', {user:data.user, message:data.message});
      }
      else if(usernames[data.user] == data.room){
        io.in(data.room).emit('new message', {user:data.user, message:data.message});
      }
    })
});
*/
