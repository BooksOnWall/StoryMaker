const express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
const bodyParser = require('body-parser');
//CORS
var cors = require('cors');
// ENV set url(localhost/other) port (1234) and protocol (http/https)
require('dotenv').config();
const host = process.env.SERVER_HOST;
const protocol = process.env.SERVER_PROTOCOL;
const port = process.env.SERVER_PORT;

// get mysql connection & credentials parameters
let config = require('./conf/mysql');

//bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

//jwt_payload & passport
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  let user = getUser({ id: jwt_payload.id });

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
// use the strategy
passport.use(strategy);

const app = express();

// initialize passport with express
app.use(passport.initialize());
// cors integration
var allowedOrigins = ['*',
      'https://localhost:3000',
      'https://bow.animaespacio.org',
      'http://localhost:3000',
      'http://yourapp.com'];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
// parse application/json
app.use(bodyParser.json());

//cors middleware causes express to reject connection
// adding headers Allow-Cross-Domain

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Method', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'content-type');
  next();
}
app.use(allowCrossDomain);

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Define db and create tables
const Sequelize = require('sequelize');

// initialze an instance of Sequelize with mysql conf parameters
const sequelize = new Sequelize(config.mysql);
const usersList = require('./conf/db/users');
const artistsList = require('./conf/db/artists');
// check the databse connection
sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// create user model
const Users = sequelize.define('users', usersList.users);
// create table with user model
Users.sync()
 .then(() => console.log('User table created successfully'))
 .catch(err => console.log('oooh, did you enter wrong database credentials?'));
// create Artists model
const Artists = sequelize.define('artists', artistsList.artists);
// create table with user model
Artists.sync()
 .then(() => console.log('Artists table created successfully'))
 .catch(err => console.log('oooh, did you enter wrong database credentials?'));


// create some helper functions to work on the database
const createUser = async ({ name, email, hash, active }) => {
  let password = hash;
  if(hash) return await Users.create({ name, email, password, active });
}

const patchUser = async ({ id, name, email, active }) => {
  return await Users.update({ id, name, email, active },
    { where: {id : id}}
  );
}
const getAllUsers = async () => {
  return await Users.findAll();
};

const getUser = async obj => {
  return await Users.findOne({
    where: obj,
  });
};
const deleteUser = async (uid) => {
  return await Users.destroy({
    where: {id : uid}
    });
};

// artist db requests
const getAllArtists = async () => {
  return await Artists.findAll();
}
const createArtist = async ({ name, email, description }) => {
  return await Artists.create({ name, email, description });
}
const getArtist = async obj => {
  return await Artists.findOne({
    where: obj,
  });
};
const patchArtist = async ({ id, name, email, description }) => {
  return await Artists.update({ id, name, email, description },
    { where: {id : id}}
  );
}
const deleteArtist = async (aid) => {
  return await Artists.destroy({
    where: {id : aid}
    });
};

// set some basic routes
app.get('/', function(req, res) {
  res.json({ message: 'Express is up!' });
});
// user URI requests
// get all users
app.get('/users', function(req, res) {
  getAllUsers().then(user => res.json(user));
});
//get user
app.get('/users/:userId', (req, res) => {
  let uid = req.params.userId;
  getUser({id: uid}).then(user => res.json(user));
});
//update user exept password
app.patch('/users/:userId', function(req, res, next) {
  const { name, email, active } = req.body;
  let id = req.params.userId;
  patchUser({ id, name, email, active }).then(user =>
      res.json({ user, msg: 'account updated successfully' })
    );
});
//delete user
app.delete('/users/:userId', function(req, res, next) {
  let uid = req.params.userId;
  console.log(uid);
  deleteUser(uid).then(user =>
    res.json({ user, msg: 'account destroyed successfully' })
  );
});
// register route register create the new user but set it as inactive
app.post('/register', function(req, res, next) {
  const { name, email, password } = req.body;
  bcrypt
  .genSalt(saltRounds)
  .then(salt => {
    return bcrypt.hash(password, salt);
  })
  .then(hash => {
    createUser({ name, email, hash }).then(user =>
      res.json({ user, msg: 'account created successfully' })
    );
    // Store hash in your password DB.
  })
  .catch(err => console.error(err.message));
});
// register route create new user
app.post('/users/0', function(req, res, next) {
  const { name, email, password, active } = req.body;
  bcrypt
  .genSalt(saltRounds)
  .then(salt => {
    return bcrypt.hash(password, salt);
  })
  .then(hash => {
    createUser({ name, email, hash, active }).then(user =>
      res.json({ user, msg: 'account created successfully' })
    );
    // Store hash in your password DB.
  })
  .catch(err => console.error(err.message));
});
//login route
app.post('/login', async function(req, res, next) {
  const { email, password } = req.body;
  if (email && password) {
    try {
      let user = await getUser({ email: email });
      if (!user) {
        res.status(401).json({ message: 'No such user found' });
      }
      let hash = user.password;
      if(hash) {
        bcrypt
          .compare(password, hash)
          .then(match => {
            if(match) {
             // Passwords match
             // from now on we'll identify the user by the id and the id is the
             // only personalized value that goes into our token
             let payload = { id: user.id };
             let token = jwt.sign(payload, jwtOptions.secretOrKey);
             res.json({ msg: 'ok', token: token });
            } else {
             // Passwords don't match
               res.status(401).json({ msg: 'Password is incorrect' });
            }
          })
          .catch(err => console.error(err.message));
      }
    }catch(e) {
      console.log(e);
    }
  }
});
// Artists URI requests
app.get('/artists', function(req, res) {
  getAllArtists().then(user => res.json(user));
});
app.post('/artists/0', function(req, res, next) {
  const { name, email, description } = req.body;
  createArtist({ name, email, description }).then(user =>
    res.json({ user, msg: 'artist created successfully' })
  );
});
app.get('/artists/:artistId', (req, res) => {
  let aid = req.params.artistId;
  getArtist({id: aid}).then(user => res.json(user));
});
app.patch('/artists/:artistId', function(req, res, next) {
  const { name, email, description } = req.body;
  let id = req.params.artistId;
  patchArtist({ id, name, email, description }).then(user =>
      res.json({ user, msg: 'artist updated successfully' })
    );
});
app.delete('/artists/:artistId', function(req, res, next) {
  let aid = req.params.artistId;
  deleteArtist(aid).then(user =>
    res.json({ user, msg: 'artist destroyed successfully' })
  );
});
// protected route
app.get('/protected', passport.authenticate('jwt', { session: false }), function(req, res) {
  res.json('Success! You can now see this without a token.');
});

// start app
if (protocol === 'https') {
  var key = fs.readFileSync('./server.key');
  var cert = fs.readFileSync('./server.crt');
  var options = {
      key: key,
      cert: cert
  };
  https.createServer(options, app)
  .listen(port, function () {
    console.log('BooksOnWall RESTFULL Server listening on port 3010! Go to https://localhost:3000/')
  });
} else {
  http.createServer(app)
  .listen(port, function () {
    console.log('BooksOnWall RESTFULL Server listening on port 3010! Go to https://localhost:3000/')
  });
}
