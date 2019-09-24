const express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var multer = require('multer');
var rimraf = require("rimraf");
var timeout = require('connect-timeout');
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
// fix sequelize GeoFromText mac os x bug => https://github.com/sequelize/sequelize/issues/9786
const wkx = require('wkx')
Sequelize.GEOMETRY.prototype._stringify = function _stringify(value, options) {
  return `ST_GeomFromText(${options.escape(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
};
Sequelize.GEOMETRY.prototype._bindParam = function _bindParam(value, options) {
  return `ST_GeomFromText(${options.bindParam(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
};
Sequelize.GEOGRAPHY.prototype._stringify = function _stringify(value, options) {
  return `ST_GeomFromText(${options.escape(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
};
Sequelize.GEOGRAPHY.prototype._bindParam = function _bindParam(value, options) {
  return `ST_GeomFromText(${options.bindParam(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
};

// initialze an instance of Sequelize with mysql conf parameters
const sequelize = new Sequelize(config.mysql);
const usersList = require('./conf/db/users');
const userPref = require('./conf/db/userPref');
const artistsList = require('./conf/db/artists');
const storiesList = require('./conf/db/stories');
const stagesList = require('./conf/db/stages');
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
   console.log('User table created successfully');
   var dir_root = __dirname + '/public';
   if (!fs.existsSync(dir_root)) {
       fs.mkdirSync(dir_root, 0o744);
       console.log('Public directory created successfully')
   }

   var dir = __dirname + '/public/users';
   if (!fs.existsSync(dir)) {
       fs.mkdirSync(dir, 0o744);
       console.log('User directory created successfully')
   }
 })
 .catch(err => console.log('oooh, error creating database User or directory , did you enter wrong database credentials? is your user folder created server side ?'));
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
 // create Stories model
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

// create Stages model
const Stages = sequelize.define('stages', stagesList.stages);
// create table with artist model
Stages.sync()
 .then(() => {
   console.log('Stages table created successfully');

 })
 .catch(err => console.log('oooh,error creating database Stages , did you enter wrong database credentials?'));
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
  let res = await Artists.findOne({
    where: obj,
  });
  // prepare JSON.parse for JSON fields

  res.dataValues.images = (res.dataValues.images) ? JSON.stringify(res.dataValues.images) : null;
  res.dataValues.bio = (res.dataValues.bio) ? JSON.stringify(res.dataValues.bio) : null ;

  return res;
};
const patchArtist = async ({ id, name, email, images, bio }) => {
  return await Artists.update({ id, name, email, images, bio },
    { where: {id : id}}
  );
};
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
const createStory = async ({ title, state, city, sinopsys, credits, artist, active }) => {
  try {
    let res = await Stories.create({ title, state, city, sinopsys, credits, artist, active });
    const sid = res.dataValues.id;
    var dir = __dirname + '/public/stories/'+sid;
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, 0o744); }
    var sdir = __dirname + '/public/stories/' + sid + '/stages';
    if (!fs.existsSync(sdir)) { fs.mkdirSync(sdir, 0o744); }
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
    { uid: uid, pname: pref, pvalue: pvalue},
    { where: {uid : uid, name: pref }}
  );
};

const getUserPreferences = async ({id}) => {
  return await UserPref.findAll({
    where: {uid : id },
  });
};
//set Stages functions
// stories db requests
const getAllStages = async (sid) => {
  return await Stages.findAll({
    where: {sid : sid },
  });
}

const createStage = async ({ sid, name, photo, adress, description, images, picture, videos, audios, type, stageOrder, tessellate, geometry }) => {
  try {
    let res = await Stages.create({ sid, name, photo, adress, description, images, picture, videos, audios, type, stageOrder, tessellate, geometry });
    const ssid = res.dataValues.id;
    // create story stages directory
    var dir = __dirname + '/public/stories/'+ sid + '/stages/'+ssid;
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, 0o744); }
    // create images, pictures, audios, and videos directories
    var idir = dir + '/images';
    if (!fs.existsSync(idir)) { fs.mkdirSync(idir, 0o744); }
    var pdir = dir + '/pictures';
    if (!fs.existsSync(pdir)) { fs.mkdirSync(pdir, 0o744); }
    var adir = dir + '/audios';
    if (!fs.existsSync(adir)) { fs.mkdirSync(adir, 0o744); }
    var vdir = dir + '/videos';
    if (!fs.existsSync(vdir)) { fs.mkdirSync(vdir, 0o744); }
    // create directory photo, onZoneEnter, onPictureMatch , onZoneLeave
    var photodir = dir + '/photo';
    if (!fs.existsSync(photodir)) { fs.mkdirSync(photodir, 0o744); }
    var ozedir = dir + '/onZoneEnter';
    if (!fs.existsSync(ozedir)) { fs.mkdirSync(ozedir, 0o744); }
    var opmdir = dir + '/onPictureMatch';
    if (!fs.existsSync(opmdir)) { fs.mkdirSync(opmdir, 0o744); }
    var ozldir = dir + '/onZoneLeave';
    if (!fs.existsSync(ozldir)) { fs.mkdirSync(ozldir, 0o744); }
    // create json directory to set elements from stage board
    var jdir = dir + '/json';
    if (!fs.existsSync(jdir)) { fs.mkdirSync(jdir, 0o744); }
    return res;
  } catch(e) {
    console.log(e.message);
  }
}
const importStages = async (sid, geojson) => {
  console.log(typeof(geojson));
  Stages.destroy({
    where: {sid: sid},
    truncate: true
  });
  //deleteAllStages(sid);
  if (geojson) {
    geojson.map((feature, index ) => {
      let properties = feature.properties;
      let name = properties.Name;
      let photo= ''; // need to be added once the geojson export is done
      let adress=''; // need to be added once the geojson export is done
      let description = properties.description;
      let images = null; // need to be added once the geojson export is done
      let pictures = null; // need to be added once the geojson export is done
      let videos = null; // need to be added once the geojson export is done
      let audios = null; // need to be added once the geojson export is done
      let stageOrder = index;
      let type=feature.geometry.type;
      let tessellate = properties.tessellate;
      let geometry = feature.geometry;



      createStage({ sid, name, photo, adress, description, images, pictures, videos, audios, type, stageOrder, tessellate, geometry }).then(res =>
        console.log('toto')
        //res.json({ stage, 'data': stage, msg: 'stage created successfully' })
      );
      return ('toto')
    });
  }

}

const getStage = async obj => {
  return await Stages.findOne({
    where: obj,
  });
};
const updateFieldFromStage = async ({ ssid, sid, field, fieldValue }) => {
  console.log(ssid);
  console.log(sid);
  console.log(field);
  console.log(fieldValue);
  return await Stages.update(
    { [field]: fieldValue},
    { where: {id : ssid, sid: sid }}
  );
};
const removeObjectFromField = async ({ssid, sid, category, obj}) => {
  console.log('remove obj');
  try {

    let objName = obj.name;
    let list = await Stages.findAll({ where: {id : ssid, sid: sid }}).then(function(result){
      //extract objects array list for this category
      result = result[0].dataValues[category].filter(function( lobj ) {
        // remove object by name from array
        lobj = (lobj.name) ? lobj : lobj[obj.type];

        return lobj.name !== objName;
      });
      return result;
    });
    let field = category;
    let fieldValue = list;
    //update category in db
    await updateFieldFromStage({ssid, sid, field, fieldValue });
  } catch(e) {
    console.log(e.message);
  }
};
// move file from category (zones)
const moveObjectFromField = async ({ssid, sid, oldDir, newDir, newObj}) => {
  try {
    let objName = newObj.name;
    let objType = newObj.type;
    let newList = [];
    let list = [];
    list = await Stages.findOne({
      attributes: [oldDir, newDir],
      where: {id : ssid, sid: sid }
    }).then(stage => {
      console.log(stage.get({ plain: true }));
      //extract objects array list for this category
      //console.log('From ' + oldDir + ' : ', stage.get(oldDir));
      //console.log('To ' + newDir + ' : ', stage.get(newDir));

      newList = (stage.get(newDir)) ? stage.get(newDir) : [] ;
      list = (stage.get(oldDir)) ? stage.get(oldDir) : null ;
      // // remove object by name from current array
      list = (list) ? list.filter(function (lobj) {
      //   console.log(lobj);
      //   lobj =  (lobj.name) ? lobj : lobj[objType];
         return lobj.name !== objName;
      }) : null ;
      newList.push(newObj);
      return list;
    });
    console.log(oldDir + ': old list :', list);
    console.log(newDir + 'new list: ', newList);
    // update removed array with database
    list = (list && list.length > 0 ) ? list : null;
    let field = oldDir;
    let fieldValue = list;
    //update category in db
    await updateFieldFromStage({ssid, sid, field, fieldValue }).then(function(result){
      if(result) {
        field = newDir;
        fieldValue = newList;
        //update destination folder in db
        updateFieldFromStage({ssid, sid, field, fieldValue }).then(function(res){
         return newObj;
        });
      }
    });
  } catch(e) {
    console.log(e.message);
  }
};
const changePropFromObject = async ( sid, ssid, obj, field, prop, propValue) => {

  try {
    Stages.findOne({
      where: {id: ssid, sid: sid},
      attributes: ['id', obj.category],
    }).then(function (result) {
      // extract category field and parse objects to find the one

      let list;
      list = Object.values(result).filter(function(item) {
        if (item[field]) {

          let objs = item[field].map(obj => {
              console.log(obj.name);

              return obj
          });
          console.log(objs);
          // parse array of objects
          item[field][prop] = (item[field].name === obj.name) ? propValue : item[field][prop];
          return item[field] ? item : null;
        }
      });

      //console.log('list: ', list);

      // save field to db
      // Stages.update({[field]: list}, {where: {id: ssid, sid: sid}})
      //  .then(function(err, res) {
      //    return res;
      //  });
     });
  } catch(e) {
    console.log(e.message);
  }
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
app.use('/assets', express.static(__dirname + 'public', staticoptions));
app.get('/assets/users/:userId/:name', function (req, res, next) {
  var uid = req.params.userId;
  var fileName = req.params.name;
  var path = 'public/users/'+uid+'/';
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
app.get('/assets/artists/:artistId/:name', function (req, res, next) {
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
app.get('/assets/stories/:storyId/stages/:stageId/images/:name', function (req, res, next) {
  var sid = req.params.storyId;
  var ssid= req.params.stageId;
  var fileName = req.params.name;
  console.log(fileName);
  var path = './public/stories/' + sid + '/stages/' + ssid +'/images/';
  console.log(path);
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

// app.get('/assets/stories/:storyId/stages/:stageId/videos/:name', timeout('10m'), function (req, res, next) {
//   var sid = req.params.storyId;
//   var ssid= req.params.stageId;
//   var fileName = req.params.name;
//   var path = './public/stories/' + sid + '/stages/' + ssid +'/videos/';
//   //set a video stream server to serve the file
//   res.setHeader("content-type", "video/*");
//   console.log('Starting streaming: file ' + fileName );
//   fs.createReadStream(path+fileName).pipe(res);
// });

app.get('/assets/stories/:storyId/stages/:stageId/:category/:name', function (req, res, next) {
  var sid = req.params.storyId;
  var ssid= req.params.stageId;
  var cat = req.params.category;
  var fileName = req.params.name;
  var path = './public/stories/' + sid + '/stages/' + ssid +'/'+cat+'/';
  var options = {
    root: path ,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  // check if file exist
  if (fs.existsSync(path+fileName)) {
    res.sendFile(fileName, options, function (err) {
      if (err) {
        next(err)
      } else {
        console.log('Sent:', fileName)
      }
    });
  } else {
    console.log('File not found :', fileName)
  }
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
  patchUserPrefs({ uid, pref, pvalue }).then(user => {
      res.json({ msg: 'user preference updated successfully' });
    }
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
  const { name, email, images, bio } = req.body;
  createArtist({ name, email, images, bio }).then(user =>
    res.json({ user, msg: 'artist created successfully' })
  );
});
app.get('/artists/:artistId', (req, res) => {
  let aid = req.params.artistId;
  getArtist({id: aid}).then(user => res.json(user));
});
app.patch('/artists/:artistId', function(req, res, next) {
  const { name, email, images, bio } = req.body;
  let id = req.params.artistId;
  patchArtist({ id, name, email, images, bio }).then(user =>
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
//Uploading single file avatar
app.post('/users/:userId/upload', function (req, res, next) {
  let uid = req.params.userId;
  var storage = multer.diskStorage({
      destination: function(req, file, cb){
        cb(null, './public/users/'+uid);
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
          return res.json({ user: uid, msg: 'user avatar uploaded  successfully' })
        }
    });
  // req.files is array of `images` files
  //console.log('FILES:');
  //console.log(req.files);
  //console.log('BODY:');
  //console.log(req.body);
  // req.body will contain the text fields, if there were any
});
app.patch('/artists/:artistId/image', function (req, res, next) {
  let id = req.params.artistId;
  let name = req.body.name;
  let images = req.body.images;
  //delete file
  rimraf.sync("./public/artists/" + id + "/" + name);
  // update artists.Images
  console.log(images);
  patchArtist({ id, images }).then(user =>
      res.json({ user, msg: 'artist image removed successfully' })
  );
  // req.images is array of `image` files
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
  const { title, state, city, sinopsys, credits, artist, active } = req.body;
  console.log(req.body);
  createStory({ title, state, city, sinopsys, credits, artist, active }).then(story =>
    res.json({ story, 'data': story, msg: 'story created successfully' })
  );
});
app.get('/stories/:storyId', (req, res) => {
  let sid = req.params.storyId;
  getStory({id: sid}).then(user => res.json(user));
});
app.patch('/stories/:storyId', function(req, res, next) {
  const { title, artist, state, city, sinopsys, credits, active } = req.body;
  let sid = parseInt(req.params.storyId);
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
// Stages URI requests
// geoJSON import stages
app.post('/stories/:storyId/import', function(req, res) {
  let sid = req.params.storyId;
  //check if import directory exist otherwise create it
  var dir = __dirname + '/public/stories/'+sid+'/import';
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir, 0o744); }

  var storage = multer.diskStorage({
      destination: function(req, file, cb){
        cb(null, './public/stories/'+sid+'/import');
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
          let geojson = fs.readFileSync(
            dir+'/' + req.files[0].originalname,
            'utf8');
            geojson = JSON.parse(geojson);
            geojson = geojson.features;
            let stages = importStages(sid,geojson);
          return res.json({ user: sid, stages: stages, msg: 'geojson imported  successfully' })
        }
    });
  //console.log(req.file);

  //getAllStages(sid).then(user => res.json(user));
});
app.get('/stories/:storyId/stages', function(req, res) {
  let sid = req.params.storyId;
  console.log(sid);
  getAllStages(sid).then(user => res.json(user));
});
app.post('/stories/:storyId/0', function(req, res, next) {
  const { name, adress, picture, type, geometry } = req.body;
  console.log(req.body);
  createStage({ name, adress, picture, type, geometry  }).then(story =>
    res.json({ story, 'data': story, msg: 'story created successfully' })
  );
});
app.get('/stories/:storyId/stages/:stageId', (req, res) => {
  let ssid = req.params.stageId;
  getStage({id: ssid}).then(stage => res.json(stage));
});
//Uploading multiple files
app.post('/stories/:storyId/stages/:stageId/uploadImages', function (req, res, next) {
  let sid = req.params.storyId;
  let ssid = req.params.stageId;
  let path ='./public/stories/'+ sid + '/stages/' + ssid +'/images';
  var storage = multer.diskStorage({
      destination: function(req, file, cb){
        cb(null, path );
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
        let images=[];
         req.files.forEach( function(file) {
           images.push({
             'image': {
               'name': file.originalname,
               'size': file.size,
               'mimetype': file.mimetype,
               'src': 'assets/stories/'+ sid + '/stages/' + ssid + '/images/' + file.originalname
             }
           });
          });
        updateFieldFromStage({ssid: ssid, sid: sid, field: 'images', fieldValue: images}).then(stage =>
            res.json({ stage, images: images, msg: 'Stage updated successfully' })
          );
      }
    });
});
app.post('/stories/:storyId/stages/:stageId/uploadPictures', function (req, res, next) {
  let sid = req.params.storyId;
  let ssid = req.params.stageId;
  let path ='./public/stories/'+ sid + '/stages/' + ssid +'/pictures';
  var storage = multer.diskStorage({
      destination: function(req, file, cb){
        cb(null, path );
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
        let images=[];
         req.files.forEach( function(file) {
           images.push({
             'image': {
               'name': file.originalname,
               'size': file.size,
               'mimetype': file.mimetype,
               'src': 'assets/stories/'+ sid + '/stages/' + ssid + '/pictures/' + file.originalname
             }
           });
          });
        updateFieldFromStage({ssid: ssid, sid: sid, field: 'pictures', fieldValue: images}).then(stage =>
            res.json({ stage, pictures: images, msg: 'Stage updated successfully' })
          );
      }
    });
});
app.post('/stories/:storyId/stages/:stageId/uploadVideos', function (req, res, next) {
  let sid = req.params.storyId;
  let ssid = req.params.stageId;
  let path ='./public/stories/'+ sid + '/stages/' + ssid +'/videos';
  var storage = multer.diskStorage({
      destination: function(req, file, cb){
        cb(null, path );
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
        let videos=[];
         req.files.forEach( function(file) {
           videos.push({
             'video': {
               'name': file.originalname,
               'size': file.size,
               'type': file.type,
               'src': 'assets/stories/'+ sid + '/stages/' + ssid + '/videos/' + file.originalname
             }
           });
          });
        updateFieldFromStage({ssid: ssid, sid: sid, field: 'videos', fieldValue: videos}).then(stage =>
            res.json({ stage, videos: videos, msg: 'Stage updated successfully' })
        );
      }
    });
});
app.post('/stories/:storyId/stages/:stageId/uploadAudios', function (req, res, next) {
  let sid = req.params.storyId;
  let ssid = req.params.stageId;
  let path ='./public/stories/'+ sid + '/stages/' + ssid +'/audios';
  var storage = multer.diskStorage({
      destination: function(req, file, cb){
        cb(null, path );
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
        let audios=[];
         req.files.forEach( function(file) {
           audios.push({
             'audio': {
               'name': file.originalname,
               'size': file.size,
               'type': file.type,
               'src': 'assets/stories/'+ sid + '/stages/' + ssid + '/audios/' + file.originalname
             }
           });
          });
        updateFieldFromStage({ssid: ssid, sid: sid, field: 'audios', fieldValue: audios}).then(stage =>
            res.json({ stage, audios: audios, msg: 'Stage updated successfully' })
        );
      }
    });
});
app.delete('/stories/:storyId/stages/:stageId/objDelete', function(req, res, next) {
  let sid = parseInt(req.params.storyId);
  let ssid = parseInt(req.params.stageId);
  let obj = req.body.obj;
  let objName = obj.name;
  let category = obj.category;
  let path = './public/stories/'+ sid + '/stages/' + ssid +'/'+ obj.category + '/';

  // remove file from db
  // console.log('Delete: ', objName);
  // console.log('From category: ', category);
  // console.log(obj);
   removeObjectFromField({ssid, sid, category, obj}).then(user => {
    //delete file if exist
    if (fs.existsSync(path + objName)) {
    //file exists
      rimraf.sync( path + objName);
    } else {
      console.log('File no exist :', path + objName);
    }

    res.json({ user, msg: obj.name +' destroyed successfully' })
   });
});
app.patch('/stories/:storyId/stages/:stageId/objMv', function(req, res, next) {
  let sid = parseInt(req.params.storyId);
  let ssid = parseInt(req.params.stageId);
  let obj = req.body.obj;
  let newObj = req.body.newObj;
  let oldDir = req.body.old;
  let newDir = newObj.category;
  let objName = obj.name;
  let path = './public/stories/'+ sid + '/stages/' + ssid +'/'+ oldDir + '/';
  let newPath = './public/stories/'+ sid + '/stages/' + ssid +'/'+ newDir + '/';
  if (oldDir !== newDir) {
    // move file from directory
    // check if file exist
    if (fs.existsSync(path+objName)) {
      newObj.src = newObj.src.replace(oldDir, newDir);
      moveObjectFromField({ssid, sid, oldDir, newDir, newObj}).then(user => {
           //res.json({ res, msg: newObj.name +' moved successfully' })
      });
    //file exists
      fs.rename(path+objName, newPath+objName, (err)=>{
        if(err) console.log({err});
        else {
          res.json({obj: newObj, msg: newObj.name + 'moved successfully'})
        }
      });
    }
  }
});
app.patch('/stories/:storyId/stages/:stageId/objChangeProp', function(req, res, next) {
  let sid = parseInt(req.params.storyId);
  let ssid = parseInt(req.params.stageId);
  let obj = req.body.obj;
  let field = obj.category;
  let prop = req.body.prop;
  let propValue = req.body.value;
  console.log(prop);
  changePropFromObject(sid, ssid, obj, field, prop, propValue).then(function(result){
    res.json({obj: obj, msg: obj.name + ': '+ prop + ' changed successfully'})
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
