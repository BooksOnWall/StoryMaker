const express = require('express');
var fs = require('fs');
var https = require('https');
const bodyParser = require('body-parser');
//CORS
var cors = require('cors');
//bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// get mysql connection & credentials parameters
let config = require('./conf/mysql');

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
  res.header('Access-Control-Allow-Methos', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
app.use(allowCrossDomain);
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const Sequelize = require('sequelize');

// initialze an instance of Sequelize with mysql conf parameters
const sequelize = new Sequelize(config.mysql);
const usersList = require('./conf/db/users');
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


// create some helper functions to work on the database
const createUser = async ({ name, email, hash }) => {
  let password = hash;
  if(hash) return await Users.create({ name, email, password });
}

const getAllUsers = async () => {
  return await Users.findAll();
};

const getUser = async obj => {
  return await Users.findOne({
    where: obj,
  });
};

// set some basic routes
app.get('/', function(req, res) {
  res.json({ message: 'Express is up!' });
});

// get all users
app.get('/users', function(req, res) {
  getAllUsers().then(user => res.json(user));
});

// register route
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
    }catch(e) {
      console.log(e);
    }
  }
});

// protected route
app.get('/protected', passport.authenticate('jwt', { session: false }), function(req, res) {
  res.json('Success! You can now see this without a token.');
});

// start app
https.createServer({
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.cert')
}, app)
.listen(3010, function () {
  console.log('BooksOnWall RESTFULL Server listening on port 3010! Go to https://localhost:3000/')
});
