const express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var multer = require('multer');
var rimraf = require("rimraf");
const bodyParser = require('body-parser');
//CORS
var cors = require('cors');
//fileupload

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
      'http://localhost:3000'];

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
// Tell the bodyparser middleware to accept more data
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


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

// Define db andD create tables
const Sequelize = require('sequelize');

// initialze an instance of Sequelize with mysql conf parameters
const sequelize = new Sequelize(config.mysql);
const usersList = require('./conf/db/users');
const userPref = require('./conf/db/userPref');
const artistsList = require('./conf/db/artists');
const storiesList = require('./conf/db/stories');
// check the databse connection
sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// create user model
const Users = sequelize.define('users', usersList.users);
// create table with user model
Users.sync()
 .then(() => {
   console.log('User table created successfully')
   var dir = __dirname + '/public/users';
   if (!fs.existsSync(dir)) {
       fs.mkdirSync(dir, 0o744);
       console.log('User directory created successfully')
   }
 })
 .catch(err => console.log('oooh, error creating database User , did you enter wrong database credentials?'));
// create user assets directory

 // create user preferences model
 const UserPref = sequelize.define('userPref',
    userPref.userPref,
    { indexes: [{ unique: true, fields: ['uid', 'pname']}]}
  );
 // create table with user model
 UserPref.sync()
  .then(() => console.log('User preference table created successfully'))
  .catch(err => console.log('oooh, error creating database UserPrefs ,did you enter wrong database credentials?'+err));

// create Artists model
const Artists = sequelize.define('artists', artistsList.artists);
// create table with artist model
Artists.sync()
 .then(() => {
   console.log('Artists table created successfully');
   var dir = __dirname + '/public/artists';
   if (!fs.existsSync(dir)) {
       fs.mkdirSync(dir, 0o744);
       console.log('Artists directory created successfully')
   }
 })
 .catch(err => console.log('oooh,error creating database Artists , did you enter wrong database credentials?'));
 // create Artists model
 const Stories = sequelize.define('stories', storiesList.stories);
 // create table with stories model
 Stories.sync()
  .then(() => {
    console.log('Stories table created successfully');
    var dir = __dirname + '/public/stories';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 0o744);
        console.log('Stories directory created successfully')
    }
  })
  .catch(err => console.log('oooh, error creating database Stories ,did you enter wrong database credentials?'));

// create some helper functions to work on the database
const createUser = async ({ name, email, hash, active }) => {
  let password = hash;
  try{
    const res =  await Users.create({ name, email, password, active });
    const uid = await res.dataValues.id;
    var dir = __dirname + '/public/users/'+uid;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 0o744);
    }
    return res;
  } catch(e) {
    console.log(e.message);
  }
}
const patchUser = async ({ id, name, email, active }) => {
  return await Users.update({ id, name, email, active },
    { where: {id : id}}
  );
}
const patchUserPasswd = async ({ id, password }) => {
  return await Users.update({ id, password },
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
  let res= await Users.destroy({
    where: {id : uid}
  });
  //remove user directory
  rimraf.sync("./public/users/"+uid);
  return res;
};

// artist db requests
const getAllArtists = async () => {
  return await Artists.findAll();
}
const createArtist = async ({ name, email, images, description }) => {
  let response =  await Artists.create({ name, email, images,  description });
  const aid = response.dataValues.id;
  var dir = __dirname + '/public/artists/'+aid;
  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, 0o744);
  }
  return response;
}
const getArtist = async obj => {
  return await Artists.findOne({
    where: obj,
  });
};
const patchArtist = async ({ id, name, email, images, description }) => {
  return await Artists.update({ id, name, email, images, description },
    { where: {id : id}}
  );
}
const deleteArtist = async (aid) => {
  let response =  await Artists.destroy({
    where: {id : aid}
  });
  // delete artist files
  rimraf.sync("./public/artists/"+aid);
  return response;
};
// stories db requests
const getAllStories = async () => {
  return await Stories.findAll();
}
const createStory = async ({ title, artist, state, city, sinopsys, credits, active }) => {
  try {
    let res = await Stories.create({ title, artist, state, city, sinopsys, credits, active });
    const sid = res.dataValues.id;
    var dir = __dirname + '/public/stories/'+sid;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 0o744);
    }
    return res;
  } catch(e) {
    console.log(e.message);
  }
}
const getStory = async obj => {
  return await Stories.findOne({
    where: obj,
  });
};
const patchStory = async ({ sid, title, artist, state, city, sinopsys, credits, active }) => {
  return await Stories.update({ title, artist, state, city, sinopsys, credits, active },
    { where: {id : sid}}
  );
}
const deleteStory = async (sid) => {
  let res = await Stories.destroy({
    where: {id : sid}
    });
  //delete story directory
  rimraf.sync("./public/stories/"+sid);
  return res;
};
const patchUserPrefs = async ({ uid, pref, pvalue }) => {
  return await UserPref.upsert(
    { uid: uid, pname: pref, pvalue: {value: pvalue}},
    { where: {uid : uid, name: pref }}
  );
};

const getUserPreferences = async ({id}) => {
  return await UserPref.findAll({
    where: {uid : id },
  });
};
// get static route to serve images
var staticoptions = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['png', 'jpg'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
}
app.use('/images', express.static(__dirname + 'public', staticoptions));
app.get('/images/artists/:artistId/:name', function (req, res, next) {
  var aid = req.params.artistId;
  var fileName = req.params.name;
  var path = 'public/artists/'+aid+'/';
  var options = {
    root: path ,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
});
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
app.get('/users/:userId/prefs', (req, res) => {
  let uid = req.params.userId;
  getUserPreferences({id: uid}).then(user => res.json(user));
});
app.patch('/users/:userId/prefs', function(req, res, next) {
  let uid = req.params.userId;
  const { pvalue , pref  } = req.body;
  patchUserPrefs({ uid, pref, pvalue }).then(user =>
      res.json({ user, msg: 'user preference updated successfully' })
  );
});

app.patch('/users/:userId', function(req, res, next) {
  let id = req.params.userId;
  const {uid, password } = req.body;
  if (!uid) {
    //update user exept password
    const { name, email, active } = req.body;
    patchUser({ id, name, email, active }).then(user =>
        res.json({ user, msg: 'account updated successfully' })
    );
  } else {
    //update user password
    bcrypt
    .genSalt(saltRounds)
    .then(salt => {
      return bcrypt.hash(password, salt);
    })
    .then(hash => {
      // Store hash in your password DB.
      patchUserPasswd({ id, hash }).then(user =>
          res.json({ user, msg: 'password updated successfully' })
        );

    })
    .catch(err => console.error(err.message));

  }
});
//delete user
app.delete('/users/:userId', function(req, res, next) {
  let uid = req.params.userId;
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
             let name = user.name;
             let uid = user.id;
             getUserPreferences({id: user.id}).then(users => res.json({
               msg: 'ok',
               token: token,
               id: uid,
               name: name,
               prefs: users
             }));
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
  const { name, email, images, description } = req.body;
  createArtist({ name, email, images, description }).then(user =>
    res.json({ user, msg: 'artist created successfully' })
  );
});
app.get('/artists/:artistId', (req, res) => {
  let aid = req.params.artistId;
  getArtist({id: aid}).then(user => res.json(user));
});
app.patch('/artists/:artistId', function(req, res, next) {
  const { name, email, images, description } = req.body;
  let id = req.params.artistId;
  patchArtist({ id, name, email, images, description }).then(user =>
      res.json({ user, msg: 'artist updated successfully' })
    );
});


//Uploading multiple files
app.post('/artists/:artistId/upload', function (req, res, next) {
  let aid = req.params.artistId;
  var storage = multer.diskStorage({
      destination: function(req, file, cb){
        cb(null, './public/artists/'+aid);
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      }
    });
    var upload = multer({ storage : storage}).any();
    upload(req,res,function(err) {
      if(err) {
        return res.end("Error uploading file." + err);
      } else {
        req.files.forEach( function(f) {
          // and move file to final destination...
        });
        return res.json({ user: aid, msg: 'artist images uploaded  successfully', files: req.files })
      }
    });
  // req.files is array of `images` files
  //console.log('FILES:');
  //console.log(req.files);
  //console.log('BODY:');
  //console.log(req.body);
  // req.body will contain the text fields, if there were any
});
app.post('/users/:userId/upload', function (req, res, next) {
  let uid = req.params.userId;
  var storage = multer.diskStorage({
      destination: function(req, file, cb){
        cb(null, './public/user/'+uid);
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      }
    });
    var upload = multer({ storage : storage}).single();
    upload(req,res,function(err) {
      if(err) {
        return res.end("Error uploading file." + err);
      } else {
        //req.files.forEach( function(f) {
          // and move file to final destination...
        //});
        return res.json({ user: uid, msg: 'user avatar uploaded  successfully', files: req.files })
      }
    });
  // req.files is array of `images` files
  //console.log('FILES:');
  //console.log(req.files);
  //console.log('BODY:');
  //console.log(req.body);
  // req.body will contain the text fields, if there were any
});

app.delete('/artists/:artistId', function(req, res, next) {
  let aid = req.params.artistId;
  deleteArtist(aid).then(user =>
    res.json({ user, msg: 'artist destroyed successfully' })
  );
});
// Stories URI requests
app.get('/stories', function(req, res) {
  getAllStories().then(user => res.json(user));
});
app.post('/stories/0', function(req, res, next) {
  const { title, artist, state, city, sinopsys, credits, active } = req.body;
  createStory({ title, artist, state, city, sinopsys, credits, active }).then(user =>
    res.json({ user, msg: 'story created successfully' })
  );
});
app.get('/stories/:storyId', (req, res) => {
  let sid = req.params.storyId;
  getStory({id: sid}).then(user => res.json(user));
});
app.patch('/stories/:storyId', function(req, res, next) {
  const { title, artist, state, city, sinopsys, credits, active } = req.body;
  let sid = parseInt(req.params.storyId);
  console.log(sid);
  patchStory({ sid, title, artist, state, city, sinopsys, credits, active }).then(user =>
      res.json({ user, msg: 'Story updated successfully' })
    );
});
app.delete('/stories/:storyId', function(req, res, next) {
  let sid = parseInt(req.params.storyId);
  deleteStory(sid).then(user => {
      res.json({ user, msg: 'Story destroyed successfully' })
  });
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
    console.log('BooksOnWall RESTFULL Server listening on port 3010! Go to https://localhost:3010/')
  });
} else {
  http.createServer(app)
  .listen(port, function () {
    console.log('BooksOnWall RESTFULL Server listening on port 3010! Go to https://localhost:3000/')
  });
}
