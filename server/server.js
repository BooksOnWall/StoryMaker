
const Telegraf = require('telegraf');
const express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var multer = require('multer');
var rimraf = require("rimraf");
var morgan = require('morgan');
const Extra = require('telegraf/extra');
const session = require('telegraf/session');
const { reply } = Telegraf;
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Tail = require('nodejs-tail');
var sizeOf = require('image-size');
var zip = require('express-easy-zip');
var tar = require('tar-fs');
const prettyBytes = require('pretty-bytes');
var getSize = require('get-folder-size');
const { exec } = require("child_process");
const bodyParser = require('body-parser');
//CORS
var cors = require('cors');
//fileupload

// ENV set url(localhost/other) port (1234) and protocol (http/https)
require('dotenv').config();

const host = process.env.SERVER_HOST;

const protocol = process.env.SERVER_PROTOCOL;
const port = process.env.SERVER_PORT;
//proxy port  usefull if you use an web proxy to run your server on one port and make it accessible on another , set correct src path url on upload/download files
const proxy = process.env.PROXY_PORT;
const hasbot = JSON.parse(process.env.BOT_ACTIVE);
const serverUrl = protocol + '://'+ host + ':' + proxy +'/';
// get mysql connection & credentials parameters
let config = require('./conf/mysql');

//crypto https://codeforgeek.com/encrypt-and-decrypt-data-in-node-js/
// Nodejs encryption with CTR
// check if server and nodejs support crypto https://nodejs.org/api/crypto.html

var crypto = require('crypto');
var privatekey = process.env.CRYPTO_KEY;
const salt = (privatekey) ? privatekey : crypto.randomBytes(16).toString('hex');
//adding salt to .env at first use
if(!privatekey) {
  const fs = require('fs');

  fs.writeFile(".env", "CRYPTO_KEY="+salt, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The key was saved!");
  });
}
function encrypt(text) {
  const hash = crypto.pbkdf2Sync(text, salt, 2048, 32, 'sha512').toString('hex');
  return [salt, hash].join('$');
}
function decrypt(hash) {
  hash = crypto.pbkdf2Sync(hash, salt, 2048, 32, 'sha512').toString('hex');
  return hash;
}
function compare(hash, password) {
  const originalHash = password.split('$')[1];
  hash = crypto.pbkdf2Sync(hash, salt, 2048, 32, 'sha512').toString('hex');
  return hash === originalHash;
}
// exec shell init (if arcoreimg is installed)

// let cmd2 ="ls public/stories/7/stages/17/pictures/photo_2020-03-19_09-22-54.jpg";
const  arcoreimgRank = async (path, file)  => {
    try {
      const arcoreimg_path ="./third_parties/google/arcoreimg/linux/";
      const command =arcoreimg_path + "arcoreimg eval-img --input_image_path=" + path;
      return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
         if (error) {
          console.warn(error);
         }
         resolve(stdout? stdout : stderr);
        });
       });
    } catch(e) {
      console.log(e.message);
    }
}

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
app.use(morgan('combined'));
// initialize passport with express
app.use(passport.initialize());
app.use(zip());
// cors integration
var allowedOrigins = ['*',
      'https://localhost:3000',
      'https://create.booksonwall.art',
      'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    console.log('origin',origin);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.[Server.js:133]';
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
// create Stories model
const Stories = sequelize.define('stories', storiesList.stories);
// create Stages model
const Stages = sequelize.define('stages', stagesList.stages);

Stories.belongsTo(Artists, { as:'aa', foreignKey: 'artist', targetKey: 'id' });
Artists.hasMany(Stories, { as: 'aa', foreignKey: 'artist', sourceKey: 'id'});

Stages.belongsTo(Stories, { foreignKey: 'sid', targetKey: 'id' });
Stories.hasMany(Stages, { foreignKey: 'sid', sourceKey: 'id'});

// create table with artist model
Artists.sync()
 .then(() => {
   console.log('Artists table created successfully');
   var dir = __dirname + '/public/artists';
   if (!fs.existsSync(dir)) {
       fs.mkdirSync(dir, 0o744);
       console.log('Artists directory created successfully')
   }
   // create table with stories model
   Stories.sync()
    .then(() => {
      console.log('Stories table created successfully');
      var dir = __dirname + '/public/stories';
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, 0o744);
          console.log('Stories directory created successfully')
      }
      // create table with artist model
      Stages.sync()
       .then(() => {
         console.log('Stages table created successfully');
       })
       .catch(err => console.log('oooh,error creating database Stages , did you enter wrong database credentials?', err));
    })
    .catch(err => console.log('oooh, error creating database Stories ,did you enter wrong database credentials?', err));
 })
 .catch(err => console.log('oooh,error creating database Artists , did you enter wrong database credentials?', err));



// create some helper functions to work on the database
const createUser = async ({ name, email, hash, active }) => {
  let password = hash;
  try{
    const res =  await Users.create({ name, email, password, active });
    const uid = await res.get('id');
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
const patchUserPasswd = async ({ id, hash }) => {
  return await Users.update({ password: hash },{ where: {id : id}});
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
  const aid = response.get('id');
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
//const getAllStories = async () => await Stories.findAll({ raw: true });
const getStories = async () => {
  try  {
    return await Stories.findAll({
      include: [
        {as: 'aa', model: Artists},
        {as: 'stages', model: Stages}
      ],
      // order: [
      //       ['id', 'DESC'],
      //       ['name', 'ASC'],
      // ],
      nested: true })
      .then(stories => {
        if(stories && stories.length > 0) {
          stories.map((story, index) => {
            let win = 0;
            let err = 0;
            let total = 0;
            let stages = (story.stages) ? story.stages : null;
            stages.sort((a, b) => (a.stageOrder > b.stageOrder) ? 1 : -1);
            //stages = stages.map(stage => stage.get({raw: true}));
            story = story.get({raw: true});
            story["stages"] = stages ;
            let preflight = storyCheckPreflight(story);
            preflight.map(log => (log.check === true) ? win++ : err++);
            total = win + err;
            story["percent"] = parseInt((win / total) * 100 );
            return story
          });
        return stories;
      }});
  } catch(e) {
    console.log(e.message);
  }
}
const getStoriesPublished = async () => {
  try  {
    return await Stories.findAll({
      include: [
        {as: 'aa', model: Artists},
        {as: 'stages', model: Stages}
      ],
      where: {
        active: 1
      },
      // order: [
      //       ['id', 'DESC'],
      //       ['name', 'ASC'],
      // ],
      nested: true })
      .then(stories => {
        if(stories && stories.length > 0) {
          stories.map((story, index) => {
            let stages = (story.stages) ? story.stages : null;
            stages.sort((a, b) => (a.stageOrder > b.stageOrder) ? 1 : -1);
            story = story.get({raw: true});
            story["stages"] = stages ;
            return story
          });
        return stories;
      }});
  } catch(e) {
    console.log(e.message);
  }
}

const createStory = async ({ title, state, city, sinopsys, credits, artist, geometry, viewport, active }) => {
  try {
    let res = await Stories.create({ title, state, city, sinopsys, credits, artist, geometry, viewport, active });
    const sid = res.get('id');
    // create directory structure
    // story files
    var dir = __dirname + '/public/stories/'+sid;
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, 0o744); }
    var sdir = __dirname + '/public/stories/' + sid + '/stages';
    if (!fs.existsSync(sdir)) { fs.mkdirSync(sdir, 0o744); }
    var ddir = __dirname + '/public/stories/' + sid + '/design';
    if (!fs.existsSync(ddir)) { fs.mkdirSync(ddir, 0o744); }
    var idir = __dirname + '/public/stories/' + sid + '/import';
    if (!fs.existsSync(idir)) { fs.mkdirSync(idir, 0o744); }

    // Export directory structure
    var exdir = __dirname + '/public/export/';
    if (!fs.existsSync(exdir)) { fs.mkdirSync(exdir, 0o744); }
    var sexdir = exdir + 'stories/';
    if (!fs.existsSync(sexdir)) { fs.mkdirSync(sexdir, 0o744); }
    var edir =  sexdir + sid + '/';
    if (!fs.existsSync(edir)) { fs.mkdirSync(edir, 0o744); }

    return res;
  } catch(e) {
    console.log(e.message);
  }
}
const getStoryTheme = async obj => {
  try {
    return await Stories.findOne(
      { attributes: ['design_options', 'id'],
        where: obj}
    );
  } catch(e) {
    console.log(e.message);
  }

};
const getStory = async obj => {
  try {
    return await Stories.findOne(
      { where: obj,
        include: [
        {as: 'aa', model: Artists},
        {as: 'stages', model: Stages}
      ],
      nested: true}
    );
  } catch(e) {
    console.log(e.message);
  }

};
const updateFieldFromStory = async ({ sid, field, fieldValue }) => {
  return await Stories.update(
    { [field]: fieldValue},
    { where: {id : sid }}
  );
};
const patchStory = async ({ sid, title, artist, state, city, sinopsys, credits, design_options, tesselate, geometry, viewport, active }) => {
  console.log('patchStory: geometry', geometry);
  console.log('patchStory: viewport', viewport);
  return await Stories.update({ title, artist, state, city, sinopsys, credits, design_options, tesselate, geometry, viewport, active },
    { where: {id : sid}}
  );
}
const patchStoryGallery = async ({ id, name, images }) => {
  getStoryTheme({id:id}).then((story) => {
    if (story && story.dataValues) {
      let design_options = story.dataValues.design_options;
      let gallery = design_options.gallery;
      console.log(gallery);
    }

  });
  // await Stories.update({ design_options },
  //   { where: {id : sid}}
  // );
}
const deleteStory = async (sid) => {
  try {
    await Stages.destroy({
      where: {sid : sid}
    });
    let res = await Stories.destroy({
      where: {id : sid}
      });
    //delete story directory
    rimraf.sync("./public/stories/"+sid);
    return res;
  } catch(e) {
    console.log(e.message);
  }
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
    raw: true,
    order: [['stageOrder', 'ASC']],
    where: {sid : sid },
  });
}
const reindexStages = async ({sid, stages}) => {
  stages.map((stage, index) => {
    return reindexStage({sid,stage})
  });
}
const reindexStage = async ({sid, stage}) => {
  return Stages.update(
    { stageOrder: stage.stageOrder},
    { where: {sid : sid , id: stage.id}
  });
}
const updateStage = async ({ id, sid , name, photo, adress, description, dimension, radius, images, pictures, videos, audios, onZoneEnter, onPictureMatch, onZoneLeave, type, scene_type, scene_options, stageOrder, tesselate, geometry }) => {
  try {
    return   await Stages.update(
      { sid , name, photo, adress, description, dimension, radius, images, pictures, videos, audios, onZoneEnter, onPictureMatch, onZoneLeave, type, scene_type, scene_options, stageOrder, tesselate, geometry },
      { where: { id: id } }
    );

  } catch(e) {
    console.log(e.message);
  }
};
const createStage = async ({ sid , name, photo, adress, description, dimension, radius, images, pictures, videos, audios, onZoneEnter, onPictureMatch, onZoneLeave, type, scene_type, scene_options, stageOrder, tesselate, geometry }) => {

  try {
    let rank = await getNextOrderFromStory(sid);
    rank = (rank) ? rank : 1;
    //console.log(rank);
    stageOrder = (!stageOrder) ? parseInt(rank) : stageOrder;
    let res = await Stages.create({ sid , name, photo, adress, description, dimension, radius, images, pictures, videos, audios, onZoneEnter, onPictureMatch, onZoneLeave, type, scene_type, scene_options, stageOrder, tesselate, geometry });
    const ssid = res.get('id');
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
const getNextOrderFromStory = async (sid) => {
  let rank;
  await Stages.max('stageOrder', {
    where: {sid : sid },
  }).then(r => {
    rank =  parseInt(r) + 1;
  });
  return rank;
}
const importStages = async (sid, geojson) => {
  console.log("ImportGeoJson in stage:", sid);
  //console.log("geojson", geojson);
  //deleteAllStages(sid);
  // delete also folders
  //
  if (geojson && sid) {
    // delete stages with sid === sid
    sid = parseInt(sid);
    Stages.destroy({
      where: {sid: sid}
    }).then(result => { console.log("Stages destroyed for stage id:", sid) });
    geojson.map((feature, index ) => {

      if(feature.type === "Feature") {
        console.log("Geojson feature:"+index ,feature);
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
        let scene_type=0;
        let scene_options=null;
        let tesselate = properties.tesselate;
        let geometry = feature.geometry;
        let onZoneEnter = (properties.onZoneEnter) ? properties.onZoneEnter : null;
        let onPictureMatch = (properties.onPictureMatch) ? properties.onPictureMatch : null;
        let onZoneLeave = (properties.onZoneLeave) ? properties.onZoneLeave : null;
        createStage({ sid , name, photo, adress, description, images, pictures, videos, audios, onZoneEnter, onPictureMatch, onZoneLeave, type, scene_type, scene_options, stageOrder, tesselate, geometry }).then(res =>
          console.log('batch import create stage sucessfull', res.get())
          //res.json({ stage, 'data': stage, msg: 'stage created successfully' })
        );
      }
      return ('toto')
    });
  }

}

const getStage = async obj => {
  return await Stages.findOne({
    where: obj,
  });
};
const storyCheckPreflight =  (obj) => {

    let log = [];
    let check = {};
    check = (obj.title ) ? {sid: obj.id, category: 'title', condition: 'Title must be filled' , check: true} : {sid: obj.id, category: 'title', error: obj.title, condition: 'Title cannot be empty' , check: false};
    log.push(check);

    //console.log('stages', obj.stages);
    let stages = (obj.stages) ? obj.stages : null;
    if(stages) {
      //preflight stages
      stages.map(stage => {
        if(stage.dataValues) {
          stage = stage.get({ raw: true });
        }
        let logs = checkPreFlight(stage);
        // console.log('stage',stage);
        // console.log('logs', logs);
        if(logs) log = [...log, ...logs];
        return stage;
      });
    }
    // export story json
    let sid = obj.id;
    let filePath = __dirname +'/public/stories/' + sid + '/';
    let fileName = 'story.json';
    if (fs.existsSync(filePath+fileName)) {
      //file already exist rmove it :
      rimraf.sync(filePath+fileName);
    }
    fs.writeFile(filePath+fileName, JSON.stringify(obj), 'utf8', function(err) {
      if (err) log.push({sid: sid,  category: 'json', condition: 'JSON export' , check: false, error: err });
      log.push({sid: sid,  category: 'json', condition: 'JSON export complete' , check: true });
    });

    return log;
};
const checkPreFlight =  (obj) => {
  // Photo / square format-max resolution 640px /max size 100kb / One and only one => done
  // Description text min 140 characteres/ only text (no url) ??
  // Location / is in "Zona location" / ??
  // OnZoneEnter / One and only one Mp3 /
  // OnZoneEnter / Photo One and only one ??
  // OnPictureMatch / Picture - minimun 5~10 images / max resolution 2000px / maxi size 200kb per image
  // OnPictureMatch / Video 1 Minimun / Codec h264 MP4-M4V / max size 20mb (if video has audio ? audio could not exist )
  // OnPictureMatch / Audio 1 Minimun / Codec Mp3 / Max size 5mb
  // OnZoneLeave / Audio 1 Minimun / Codec Mp3 / Max size 5mb / Loop

  let log = [];
  //console.log(obj);
  let check = {};
  try {
    // check photo
    if(obj.photo && obj.photo.length > 0 && obj.photo[0].src) {
      let src = obj.photo[0].src;
      let objectpath =(obj.photo[0]) ? obj.photo[0].path.substring(7) : null;
      check = (obj.photo && obj.photo.length === 1) ? {ssid: obj.id, category: 'photo', condition: 'There can be only one photo' , check: true} : {ssid: obj.id, category: 'photo', src: src, condition: 'There can be only one photo' , check: false};
      log.push(check);
      let path = (obj.photo[0] && objectpath ) ? __dirname +'/public/' + objectpath : null;

      if(path) {
        // check photo dimension
        let photoDimensions = (path) ?  sizeOf(path) : null;
        check = (photoDimensions && photoDimensions.width === photoDimensions.height) ? {ssid: obj.id, category: 'photo', condition: 'Photo must be square' , check: true} : {ssid: obj.id, category: 'photo', condition: 'Photo must be square' , check: false, src: src, path: path, error:  obj.name + ' Photo is:' + photoDimensions.width + ' x ' + photoDimensions.height};
        log.push(check);
        check = (photoDimensions && photoDimensions.width <= 640 && photoDimensions.height <= 640) ? {ssid: obj.id, category: 'photo', condition: 'Photo dimension cannot be more than 640x640' , check: true} : {ssid: obj.id, category: 'photo', condition: 'Photo dimension cannot be more than 640x640  ' , check: false,  src: src, path: path, error:  obj.name + ' Photo is:' + photoDimensions.width + ' x ' + photoDimensions.height};
        log.push(check);
        check = (obj.photo && obj.photo[0].size < 100000  ) ? {ssid: obj.id, category: 'photo', condition: 'Photo cannot be more than 100kb' , check: true} : {ssid: obj.id, category: 'photo', condition: 'Photo cannot be more than 100kb' , check: false,  src: src, path: path,error:  obj.name + ' file weight don\'t match  ' + obj.photo[0].size};
        log.push(check);
      }

    } else {
      // error
      check = {ssid: obj.id, category: 'photo', condition: 'Photo must exist' , check: false,   error:  'Empty: No Photo'};
      log.push(check);
    }
    // check stage dimension
    check = (obj.dimension && obj.dimension.length !== 0) ? {ssid: obj.id, category: 'dimension', condition: 'Dimension must be filled' , check: true} : {ssid: obj.id, category: 'dimension', condition: 'Dimension must be filled' , check: false,   error:  'Empty: No Dimension'};
    log.push(check);
    // check stage radius
    check =  (obj.radius && obj.radius.length !== 0) ? {ssid: obj.id, category: 'radius', condition: 'Radius must be filled' , check: true} : {ssid: obj.id, category: 'radius', condition: 'Radius must be filled' , check: false,   error:  'Empty: No Radius'};
    log.push(check);
    // check picture dimensions
    let pictures = (obj.pictures && obj.pictures.length > 0) ? obj.pictures : null ;
      if(pictures) {
        pictures = (typeof(pictures) === 'string') ? JSON.parse(pictures) : pictures;
        let picsDim=[];
         pictures.map(pic => {

          let path = './public/'+pic.path.substring(7);
          let src = pic.src;
          let picDimensions = sizeOf(path);
          picDimensions.name = pic.name;
          picDimensions.path = path;
          picDimensions.src = src;
          picDimensions.Oversize =  (picDimensions.width <= 2000 && picDimensions.height <= 2000) ? false :true;
          picsDim.push(picDimensions);
          return pic;
        });
        let maxWidth = Math.max.apply(Math, picsDim.map(function(o) { return o.width; }));
        let maxHeight = Math.max.apply(Math, picsDim.map(function(o) { return o.height; }));
        const err = picsDim.map((pic) => {
          return (pic.width >= 2000 || pic.height >=2000) ? pic : ''
        });
        check = (maxWidth <= 2000 && maxHeight <= 2000) ? {ssid: obj.id, category: 'pictures', condition: 'Picture dimension cannot be more than 2000x2000' , check: true} : {ssid: obj.id, category: 'pictures', condition: 'Picture dimension cannot be more than 2000x2000  ' , check: false,  error: err };
        log.push(check);
        // pictures match min/max pictures count
        check = (obj.pictures && obj.pictures.length >= 5 && obj.pictures.length <= 10) ? {ssid: obj.id, category: 'pictures', condition: 'Pictures number must be between 5 and 10 ' , check: true} : {ssid: obj.id, category: 'pictures', condition: 'Pictures number must be between 5 and 10 ' , check: false,  error:  'Pictures count: ' + (obj.pictures) ? obj.pictures.length : 'null'};
        log.push(check);
      } else {
        //error
        check = {ssid: obj.id, category: 'pictures', condition: 'Picture must exist' , check: false,   error:  'Empty: No Pictures'};
        log.push(check);
      }
    // Description
    if(obj.description) {
      check = (obj.description.length <= 140 ) ?  {ssid: obj.id, category: 'description', condition: 'Description cannot be more than 140 characteres. [' + (obj.description) ? obj.description.length : null + ']' , check: true} : {ssid: obj.id, category: 'pictures', condition: 'Description cannot be more than 140 characteres. [' + obj.description.length + ']  ' , check: false,  error: 'Description too large'};
      log.push(check);
    } else {
      check = {category: 'description', condition: 'Description must exist' , check: false,   error:  'Empty: No Description'};
      log.push(check);
    }
    // onZoneEnter
    if(obj.onZoneEnter && obj.onZoneEnter.length > 0 ) {

      obj.onZoneEnter = (typeof(obj.onZoneEnter) === 'string') ? JSON.parse(obj.onZoneEnter) : obj.onZoneEnter;
      check = (obj.onZoneEnter.length > 0) ? {ssid: obj.id, category: 'onZoneEnter', condition: 'OnZoneEnter cannot be empty.' , check: true} : {ssid: obj.id, category: 'onZoneEnter', condition: 'OnZoneEnter cannot be empty' , check: false,  error: 'zone is empty' };
      // audios
      let audios = (obj.onZoneEnter && obj.onZoneEnter.length > 0) ? obj.onZoneEnter.filter((el, index) => {
        return el.type === 'audio';
      }) : null;

      check = (audios) ? {ssid: obj.id, category: 'onZoneEnter', condition: 'There must be one audio' , check: true} : {ssid: obj.id, category: 'onZoneEnter', error: 'File is missing', condition: 'There must be one audio' , check: false};
      log.push(check);
      check = (audios  && audios.length < 2 ) ? {ssid: obj.id, category: 'onZoneEnter', condition: 'There can be only one audio' , check: true} : {ssid: obj.id, category: 'onZoneEnter',  error: 'More than one audio file: ['+ audios.length + ']', condition: 'There can be only one audio' , check: false};
      log.push(check);

    } else {
      check = {ssid: obj.id, category: 'onZoneEnter', condition: 'There should be an audio file' , check: false,   error:  'Empty: No Audio file'};
      log.push(check);
    }

    //console.log('pictures', pics);
    // onPictureMatch
    if(obj.onPictureMatch) {
      obj.onPictureMatch = (typeof(obj.onPictureMatch) === 'string') ? JSON.parse(obj.onPictureMatch) : obj.onPictureMatch;
      check = (obj.onPictureMatch[0] && obj.onPictureMatch[0].type === 'video') ? {ssid: obj.id, category: 'onPictureMatch', condition: 'File must be a video' , check: true} : {ssid: obj.id, category: 'onPictureMatch', condition: 'There must be one video' , check: false, error: 'No video'};
      log.push(check);
    } else {
      check = {ssid: obj.id, category: 'onPictureMatch', condition: 'There should be a video file' , check: false,   error:  'Empty: No Video file'};
      log.push(check);
    }
    // Video
    // Audio
    //onZoneLeave
    let laudios = (obj.onZoneLeave && obj.onZoneLeave.length > 0) ? obj.onZoneLeave.filter((el, index) => {
      return el.type === 'audio';
    }) : null;
    check = (laudios) ? {ssid: obj.id, category: 'onZoneLeave', condition: 'There must be at least one audio' , check: true} : {ssid: obj.id, category: 'onZoneLeave', error: 'File is missing', condition: 'There must be at least one audio' , check: false};
    log.push(check);
    check = (laudios  && laudios.length <= 2 ) ? {ssid: obj.id, category: 'onZoneLeave', condition: 'There cannot be more than 2 audio files' , check: true} : {ssid: obj.id, category: 'onZoneLeave',  error: 'The cannot be More than 2 audio file: ['+ laudios.length + ']', condition: 'There cannot be more than 2 audios files' , check: false};
    log.push(check);

    // export JSON file :

    let ssid = obj.id;
    let sid = obj.sid;
    let filePath = __dirname + '/public/stories/' + sid + '/stages/' + ssid + '/json/';
    let fileName = 'stage.json';

    if (fs.existsSync(filePath+fileName)) {
      //file already exist rmove it :
       rimraf.sync(filePath+fileName);
    }
     fs.writeFile(filePath+fileName, JSON.stringify(obj), 'utf8', function(err) {
      if (err) log.push({sid: sid, ssid: ssid, category: 'json', condition: 'JSON export' , check: false, error: err });
      log.push({sid: sid, ssid: ssid, category: 'json', condition: 'JSON export complete' , check: true });
    });

    return log

  } catch(e) {
    console.log(e.message);
  }

};

const exportStageTar = async (obj) => {
  try {
    //console.log(obj);
    let path = __dirname +'/public/stories/'+ obj.sid + '/stages/' + obj.id;
    let archive = __dirname +'/public/export/';
    if (!fs.existsSync(archive))  await fs.mkdirSync(archive, 0o744) ;
    if (!fs.existsSync(archive+'stories/'))  await fs.mkdirSync(archive+'stories/', 0o744) ;
    let ex = archive + 'stories/'+ obj.sid + '/';
    let dest = ex + 'stages/';
    if (!fs.existsSync(ex))  await fs.mkdirSync(ex, 0o744) ;
    if (!fs.existsSync(dest))  await fs.mkdirSync(dest, 0o744) ;
    // packing a directory
    // __dirname +
    await tar.pack(path).pipe(fs.createWriteStream(dest+'stage_'+obj.id +'.tar'));
    let stats = fs.statSync(dest+'stage_'+obj.id +'.tar');
    let size = stats.size / 1000000.0;
    //let size  = (await sizeOf(dest+'stage_'+obj.id +'.tar');
    return { name: 'stage_'+obj.id +'.tar', size: size,  path: dest, src: 'assets/export/stories/'+ obj.sid + '/stages/stage_'+obj.id +'.tar'  }
  } catch(e) {
    console.log(e.message);
  }
};
const exportStoryTar = async (sid) => {
  try {
    //console.log(obj);
    // create export for story
    // __dirname +'/public/export/stories/'
    let archive = __dirname +'/public/export/';
    if (!fs.existsSync(archive))  await fs.mkdirSync(archive, 0o744) ;
    if (!fs.existsSync(archive+'stories'))  await fs.mkdirSync(archive+'stories', 0o744) ;
    let path = __dirname +'/public/stories/'+ sid +'/'  ;
    let ex = __dirname +'/public/export/stories/'+ sid +'/' ;;
    if (!fs.existsSync(path))  await fs.mkdirSync(path, 0o744) ;
    if (!fs.existsSync(ex))  await fs.mkdirSync(ex, 0o744) ;
    // packing a directory
    // __dirname +
    await tar.pack(path).pipe(fs.createWriteStream(ex+'story_'+ sid +'.tar'));
    let stats = fs.statSync(ex +'story_'+ sid +'.tar');
    let size = stats.size / 1000000.0;
    //let size  = (await sizeOf(dest+'stage_'+obj.id +'.tar');
    return { name: 'story_'+ sid +'.tar', size: size,  path: ex, src: 'assets/export/stories/'+ sid + '/story_'+ sid +'.tar'  }
  } catch(e) {
    console.log(e.message);
  }
};
const deleteStage = async (id, sid) => {
  let res = await Stages.destroy({
    where: {id : id, sid: sid }
    });
  //delete stage directory
  rimraf.sync("./public/stories/" + sid + "/stages/" + id);
  return res;
};
const updateSceneOptionsFromStage = async ({ssid,sid , field, fieldValue}) => {
    let list = await Stages.findAll({ where: {id : ssid, sid: sid }}).then(function(result){
      result = result[0].get('scene_options');
      result[field]= fieldValue;
    });
    return await Stages.update(
      { 'scene_options': list},
      { where: {id : ssid, sid: sid }}
    );
};
const updateFieldFromStage = async ({ ssid, sid, field, fieldValue }) => {
  return await Stages.update(
    { [field]: fieldValue},
    { where: {id : ssid, sid: sid }}
  );
};
const removeObjectFromField = async ({ssid, sid, category, obj}) => {

  try {

    let objName = obj.name;
    let list = await Stages.findAll({ where: {id : ssid, sid: sid }}).then(function(result){
      //extract objects array list for this category
      result = result[0].get(category).filter(function( lobj ) {
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
    // clean videoPosition and picturePosition
    if(category === 'pictures') {
      let pictures = await Stages.findAll({ where: {id : ssid, sid: sid }}).then(function(result){
        //extract objects array list for this category

        result = result[0].get('scene_options')[category].filter(function( pobj ) {
          // remove object by name from array
          pobj = (pobj.name) ? pobj : pobj[obj.type];
          return pobj.name !== objName;
        });
        return result;
      });
      await updateSceneOptionsFromStage({ssid, sid, category, pictures });
    }
    if(category === 'onPictureMatch') {
      let videos = await Stages.findAll({ where: {id : ssid, sid: sid }}).then(function(result){
        //extract objects array list for this category
        let category = 'videos';
        result = result[0].get('scene_options')[category].filter(function( pobj ) {
          // remove object by name from array
          pobj = (pobj.name) ? pobj : pobj[obj.type];
          return pobj.name !== objName;
        });
        return result;
      });

      await updateSceneOptionsFromStage({ssid, sid,category , videos });
    }

  } catch(e) {
    console.log(e.message);
  }
};
// move file from category (zones)
const moveObjectFromField = async ({ssid, sid, oldDir, newDir, newObj}) => {
  try {
    let objName = newObj.name;
    // be sure ça object is not dimmed and won't be saved as dimmed
    newObj.loading = false;
    let newList = [];
    let list = [];
    list = await Stages.findOne({
      attributes: [oldDir, newDir],
      where: {id : ssid, sid: sid }
    }).then(stage => {
      newList = (stage.get(newDir)) ? stage.get(newDir) : [] ;
      list = (stage.get(oldDir)) ? stage.get(oldDir) : null ;
      // remove object by name from current array
      list = (list) ? list.filter(function (lobj) {
         return lobj.name !== objName;
      }) : null ;
      newList.push(newObj);
      return list;
    });
    // update removed array with database
    // doublecheck that list has been cleaned after the drag

    list = (list && list.length > 0 ) ? list : null;
    let field = oldDir;
    let fieldValue = list;
    //update db with the object removed from category
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
const changePropFromObject = async ( sid, ssid, name, field, prop, propValue) => {

  try {
    let list = await Stages.findOne({
      where: {id: ssid, sid: sid},
      attributes: ['id', field],
    }).then(function (result) {
      // extract category field and parse objects to find the one
      return result.get(field);
    });
    list.map(function(item) {
      item[prop] = (item.name === name) ? propValue : item[prop];
      return item;
    });
      // save field to db
    Stages.update({[field]: list}, {where: {id: ssid, sid: sid}})
      .then(function(err, res) {
          return res;
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
if(hasbot) {
  console.log('Books On Wall server stareted and Telegram Bot activated', hasbot);
  // set telegram bot y tetunnel before starting express
  //
  const { enter, leave } = Stage

  // Greeter scene
  const greeterScene = new Scene('greeter')
  greeterScene.enter((ctx) => ctx.reply('Hi'))
  greeterScene.leave((ctx) => ctx.reply('Bye'))
  greeterScene.hears('hi', enter('greeter'))
  greeterScene.on('message', (ctx) => ctx.replyWithMarkdown('Send `hi`'))

  // Echo scene
  const echoScene = new Scene('echo')
  echoScene.enter((ctx) => ctx.reply('echo scene'))
  echoScene.leave((ctx) => ctx.reply('exiting echo scene'))
  echoScene.command('back', leave())
  echoScene.on('text', (ctx) => ctx.reply(ctx.message.text))
  echoScene.on('message', (ctx) => ctx.reply('Only text messages please'))

  const sayYoMiddleware = ({ reply }, next) => reply('holla').then(() => next());
  const chat_id = '-389718132';
  const bot = new Telegraf(process.env.BOT_TOKEN);
  const stage = new Stage([greeterScene, echoScene], { ttl: 10 });


  // // Register session middleware
  bot.use(session());
  bot.use(stage.middleware());
  bot.telegram.getMe().then((bot_informations) => {
     bot.options.username = bot_informations.username;
     console.log("Server has initialized bot nickname. Nick: "+bot_informations.username);
     bot.telegram.sendMessage(chat_id,"BooksOnWall Server Started and Telegram Bot initialized. Nick: "+bot_informations.username+"![patricie](https://api.booksonwall.art/assets/bot/patricie.jpg)", Extra.markdown());
     bot.telegram.sendPhoto(chat_id, { url: 'https://api.booksonwall.art/assets/patricie.jpg' });
     bot.command('local', (ctx) => ctx.replyWithPhoto({ source: '/assets/patricie.jpg' }))
bot.command('stream', (ctx) => ctx.replyWithPhoto({ source: fs.createReadStream('/assets/patricie.jpg') }))
bot.command('buffer', (ctx) => ctx.replyWithPhoto({ source: fs.readFileSync('/assets/patricie.jpg') }))
 }).catch(function(err){
     console.log(err);
 });
  // Register logger middleware
  bot.use((ctx, next) => {
    const start = new Date()
    return next().then(() => {
      const ms = new Date() - start
      console.log('telegram bot response time %sms', ms);
      //console.log(ctx.message);
    });
  });
  bot.start((ctx) => ctx.reply('Welcome'));
  bot.command('greeter', (ctx) => ctx.scene.enter('greeter'));
  bot.command('echo', (ctx) => ctx.scene.enter('echo'));

  const commands = `You can control me by sending these commands:

  *From the channel*

  /help @booksOnWallBot - *list all commands*
  /server - [start|stop|restart] @booksOnWallBot  - *start or stop or restart server*
  /build @booksOnWallBot - *update application with last git version and build for production*
  /answer @booksOnWallBot - *the answer for everything*
  /album @booksOnWallBot - *list of medias*
  /logs [start|stop] @booksOnWallBot - *start or stop reading server logs*
  /errors [start|stop] @booksOnWallBot - *idem but just with errors*


  *In Private chat*

  /help - *list all commands*
  /server - [start|stop|restart] - *start or stop or restart server*
  /build - *update application with last git version and build for production*
  /answer - *the answer for everything*
  /album - *list of medias*
  /logs [start|stop] - *start or stop reading server logs*
  /errors [start|stop] - *idem but just with errors* `;

  bot.help((ctx) => ctx.replyWithMarkdown(commands));
  bot.on('update', function(message) {
      // Generic update object
      // Subscribe on it in case if you want to handle all possible
      // event types in one callback
      console.log(message);
  });
  bot.on('sticker', (ctx) => ctx.reply('👍'));

  bot.hears('hi', (ctx) => ctx.reply('Hey there'));

  bot.command('album', (ctx) => {
    ctx.replyWithMediaGroup([
      {
        media: { source: '/patricie.jpg' },
        caption: 'From file_id',
        type: 'photo'
      },
      {
        media:  { source: fs.createReadStream('/patricie.jpg')},
        caption: 'From URL',
        type: 'photo'
      },
      {
        media: { source: fs.readFileSync('/patricie.jpg') },
        caption: 'From URL',
        type: 'photo'
      }
    ]);
  });
  // Text messages handling
  bot.hears('Hey', sayYoMiddleware, (ctx) => {
    ctx.session.heyCounter = ctx.session.heyCounter || 0;
    ctx.session.heyCounter++;
    return ctx.replyWithMarkdown(`_Hey counter:_ ${ctx.session.heyCounter}`);
  });
  bot.hears('hi', (ctx) => ctx.reply('Hey there'));
  bot.hears('hola', (ctx) => ctx.reply('Hola !'));
  bot.hears('Hola', (ctx) => ctx.reply('Hola !'));
  bot.hears('Aloja!', (ctx) => ctx.reply('Aloja !'));
  bot.hears('Ola', (ctx) => ctx.reply('Ola !'));
  // Command handling
  bot.command('answer', sayYoMiddleware, (ctx) => {
    return ctx.reply('*42*', Extra.markdown());
  });
  bot.command('build',(ctx) => {
    const exec = require('child_process').exec;
    // exec.env["craco"] = "./node_modules/@craco/craco/index";
    const myShellScript = exec('sh build.sh');
    myShellScript.stdout.on('data', (data)=>{
      ctx.reply(data, Extra.markdown());
    });
    myShellScript.stderr.on('data', (data)=>{
      ctx.reply(data, Extra.markdown());
    });
  });
  bot.command('server',(ctx) => {
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    let str =  ctx.message.text;
    if(!str.split(' ')[1]) return ctx.reply('/server required an argument to complete , use /server start or /server stop or /server restart instead', Extra.markdown());
    str = str.substring(8);
    async function serv() {
      const { stdout, stderr } = await exec('sh /etc/init.d/bow '+ str);
      ctx.reply(stdout, Extra.markdown());
      ctx.reply(stderr, Extra.markdown());
    }
    serv();
  });
  let startLog = false;

  bot.command('logs',(ctx) => {
    let str =  ctx.message.text;
    if(!str.split(' ')[1]) return ctx.reply('/logs required an argument to complete , use /logs start or /logs stop instead', Extra.markdown());
    // toggle logs
    startLog = (str.split(' ')[1] === 'start') ? true : false;
    (startLog) ? ctx.reply('Start logs ... ', Extra.markdown()) : ctx.reply('Stop logs ... ', Extra.markdown()) ;
    const logfile = './logs/server.log';
    const options = { alwaysStat: true, ignoreInitial: false, persistent: true }
    const tail = new Tail(logfile, options);
    if (startLog) {
      tail.watch();
      tail.on('line', (line) => {
        // if bot logs start === true
        //bot.telegram.sendMessage(chat_id,"Server log: "+line);
        ctx.reply(line, Extra.markdown());
        //process.stdout.write(line);
      });
      tail.on('close', () => {
        console.log('watching stopped');
      });

    } else {
      tail.close();
    }

  });

  // Launch bot
  bot.launch();
  //
  // End telegram conf
}
app.use('/assets', express.static(__dirname + 'public', staticoptions));
app.get('/zip/:sid', function(req, res){
  const sid = req.params.sid;
  const path = __dirname + '/public/stories/';
  getSize(path+sid, function(err, size) {
    if (err) { throw err; }
    console.log('Story id: '+sid+' Folder size to compress: ',prettyBytes(size));
  });
  //if(hasbot) { bot.telegram.sendMessage(chat_id,"New Story id: "+ sid +" downloaded: Zip size:")}

  res.zip({
    files: [{ path: path + sid, name: sid }],
      filename: 'BooksOnWall_Story_'+ sid +'.zip'
    }).then(function(obj, bot, chat_id){
      console.log('Story id: '+ sid +' Zip size', prettyBytes(obj.size));
      if (obj.ignored && obj.ignored.length !== 0) console.log('Ignored Files', obj.ignored);
    })
    .catch(function(err){
      console.log(err);	//if zip failed
    });

});
app.get('/assets/bot/:filename', function(req, res, next){

  var fileName = req.params.name;
  var path = 'public/bot/';
  var options = {
    root: path ,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  console.log(options);
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName)
    }
  })
});
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
app.get('/assets/stories/:storyId/design/banner/:name', function (req, res, next) {
  var sid = req.params.storyId;
  var fileName = req.params.name;

  var path = './public/stories/' + sid + '/design/banner/';

  var options = {
    root: path ,
    path: path ,
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
app.get('/assets/stories/:storyId/design/gallery/:name', function (req, res, next) {
  var sid = req.params.storyId;
  var fileName = req.params.name;

  var path = './public/stories/' + sid + '/design/gallery/';

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
app.get('/assets/export/stories/:storyId/:name', function (req, res, next) {
  var sid = req.params.storyId;
  var fileName = req.params.name;

  var path = './public/export/stories/' + sid + '/';

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

app.get('/assets/export/stories/:storyId/stages/:name', function (req, res, next) {
  var sid = req.params.storyId;
  var fileName = req.params.name;

  var path = './public/export/stories/' + sid + '/stages/';

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

  var path = './public/stories/' + sid + '/stages/' + ssid +'/images/';

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
        console.log(err);
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
    let hash = encrypt(password);
    console.log('new_hash:'+hash);
    patchUserPasswd({ id, hash }).then(user => {
      console.log("user passwd patched");
      return res.json({ user, msg: 'password updated successfully' });
    });
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
  let hash = encrypt(password);
   createUser({ name, email, hash }).then(user =>
      res.json({ user, msg: 'account created successfully' })
 );
});
// register route create new user
app.post('/users/0', function(req, res, next) {
  const { name, email, password, active } = req.body;
  let hash = encrypt(password);
  createUser({ name, email, hash, active }).then(user =>
    res.json({ user, msg: 'account created successfully' })
  );
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
      //let's hash the password
      const hashPassword = encrypt(password);
      if(hash) {
        if (hash === hashPassword) {
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
      }
    } catch(e) {
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
});
app.patch('/artists/:artistId/image', function (req, res, next) {
  let id = req.params.artistId;
  let name = req.body.name;
  let images = req.body.images;
  //delete file
  rimraf.sync("./public/artists/" + id + "/" + name);
  // update artists.Images
  patchArtist({ id, images }).then(user =>
      res.json({ user, msg: 'artist image removed successfully' })
  );
});

app.delete('/artists/:artistId', function(req, res, next) {
  let aid = req.params.artistId;
  deleteArtist(aid).then(user =>
    res.json({ user, msg: 'artist destroyed successfully' })
  );
});
// Stories URI requests
app.get('/stories', async (req, res, next) => {
  // getStories
  // func linked with artist and stages
  //
  try {
    let stories = await getStories();
    return res.json({ stories: stories, msg: 'Stories listed'});
  } catch(e) {
    console.log(e.message);
  }
});
app.get('/storiesPublished', async (req, res, next) => {
  // getStories
  // func linked with artist and stages
  //
  try {
    let stories = await getStoriesPublished();
    return res.json({ stories: stories, msg: 'Stories listed'});
  } catch(e) {
    console.log(e.message);
  }
});
app.post('/stories/0', function(req, res, next) {
  const { title, state, city, sinopsys, credits,tesselate, geometry, viewport, artist, active } = req.body;
  createStory({ title, state, city, sinopsys, credits, tesselate, geometry, viewport, artist, active }).then((story) => {
    //if(hasbot) {bot.telegram.sendMessage(chat_id,"New Story created: " + title); }
    return res.json({ 'data': story, msg: 'story created successfully' })
  });
});
app.get('/stories/:storyId', (req, res) => {
  let sid = req.params.storyId;
  getStory({id: sid}).then(story => res.json({story: story, msg: 'get story success'}));
});
app.patch('/stories/:storyId', function(req, res, next) {
  const { title, artist, state, city, sinopsys, tesselate, geometry, viewport, credits, active } = req.body;
  let sid = parseInt(req.params.storyId);
  patchStory({ sid, title, artist, state, city, sinopsys, tesselate, geometry, viewport,  credits, active }).then(user =>
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
            // inspect geojson to verify format is
            console.log("Record Stages Import for stage", sid);
            if(sid && geojson) {
              let stages = importStages(sid,geojson);
              return res.json({ stages: stages, msg: 'geojson imported  successfully' });
            } else {
              console.log("oups something went wrong in geojson", sid+":"+geojson);
              return res.json({ msg: 'geojson story '+sid+' imported failed' });

            }

        }
    });
});
app.get('/stories/:storyId/stages', function(req, res) {
  let sid = req.params.storyId;
  getAllStages(sid).then(stages => {
    stages = stages.map((stage) => {

      //stage = stage.get({plain: true});
      let preflight = checkPreFlight(stage);
      if(preflight) {
        let win = 0;
        let err = 0;
        preflight.map((log) => (log.check === false) ? err++ : win++ );
        stage["percent"] = (win / (win + err) * 100).toFixed(0);
      }
      return stage;
    });
    res.json(stages);
  });
});
app.patch('/stories/:storyId/stages', function(req, res) {
  //reindex stages list when dragged in storyStages
  let sid = req.params.storyId;
  let stages = req.body.stages;
  reindexStages({sid, stages}).then((stages) => {
    //if(hasbot) { bot.telegram.sendMessage(chat_id,"New stage created: " + name + ','+ adress);}
    return res.json({ stages, 'data': stages, msg: 'stages reindexed successfully' })
  });
});
app.patch('/stories/:storyId/drop', function (req, res, next) {
  let id = req.params.storyId;
  let name = req.body.name;
  let images = req.body.images;
  //delete file
  rimraf.sync("./public/stories/" + id + "/design/gallery/" + name);
  // update artists.Images
  patchStoryGallery({ id, name, images }).then(story =>
      res.json({ story, msg: 'theme gallery image removed successfully' })
  );
});
app.post('/stories/:storyId/map', function(req, res, next) {
  const { prefs } = req.body;
  const sid = req.params.storyId;
  const mapPath = __dirname + '/public/stories/'+sid+'/';
  const fileName = 'map.json';
  if (fs.existsSync(mapPath+fileName)) {
    //file already exist remove it :
    rimraf.sync(mapPath+fileName);
  }
  fs.writeFile(mapPath+fileName, JSON.stringify(prefs), 'utf8', function(err) {
    if (err) return res.json({msg: 'error map  not saved' , error: err});
    return res.json({msg: 'map saved'});
  });
});
app.post('/stories/:storyId/theme', function(req, res, next) {
  const { design_options } = req.body;
  const sid = req.params.storyId;
  const themePath = __dirname + '/public/stories/'+sid+'/';
  const fileName = 'theme.json';
  if (fs.existsSync(themePath+fileName)) {
    //file already exist remove it :
   rimraf.sync(themePath+fileName);
  }
  fs.writeFile(themePath+fileName, JSON.stringify(design_options), 'utf8', function(err) {
    if (err) return res.json({msg: 'error theme  not saved' , error: err});
    // store theme in db
    updateFieldFromStory({sid: sid, field: 'design_options', fieldValue: design_options}).then((story) => {
      return res.json({  msg: 'Theme Story updated and saved successfully' })
    });
  });
});
app.get('/stories/:storyId/theme', function(req, res, next) {
  const sid = req.params.storyId;
  getStoryTheme({id:sid}).then((story) => {
    return res.json({theme:story.dataValues.design_options})
  });
});
//Uploading single file banner
app.post('/stories/:storyId/banner', function (req, res, next) {
  const sid = req.params.storyId;
  const path = './public/stories/'+sid+'/design/banner';
  // check if directory banner exist delete it and if not create it
  if (!fs.existsSync(path)) {
    // create directory banner
    fs.mkdirSync(path, 0o744);
    console.log('Stories design banner directory created successfully')
  } else {
    //remove and recreate directory banner
    rimraf(path,function (e) {
      fs.mkdirSync(path, 0o744);
    });
  }
  var storage = multer.diskStorage({
      destination: function(req, file, cb){
        cb(null, path);
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
          // update db
          return res.json({ story: sid, msg: 'banner uploaded  successfully' })
        }
    });
});
//Uploading multiple files
app.post('/stories/:storyId/gallery', function (req, res, next) {
  let sid = req.params.storyId;
  const path = './public/stories/'+sid+'/design/gallery';
  // delete folder recursively
  if (fs.existsSync(path)) {
    rimraf(path, function (e) {
      fs.mkdirSync(path, 0o744);
    });
  } else {
    fs.mkdirSync(path, 0o744);
    console.log('Stories design gallery directory created successfully')
  }
  // check if file exist

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
           console.log('file', file);
           images.push({
               'name': file.originalname,
               'size': file.size,
               'type': file.mimetype,
               'path': 'assets/stories/'+ sid + '/design/gallery/' + file.originalname,
               'src': serverUrl + 'assets/stories/'+ sid + '/design/gallery/' + file.originalname
           });
          });
          console.log('gallery',images);
        // updateGalleryThemeFromStory({sid: sid, field: 'design_options', fieldParam: 'gallery', fieldValue: images}).then((story) => {
        //   //bot.telegram.sendMessage(chat_id,sid + " " + ssid + "Stage updated successfully");

          return res.json({  msg: 'Story gallery theme updated successfully' })
        // });
      }
    });
});
app.get('/stories/:storyId/map', function(req, res, next) {
  const sid = req.params.storyId;
  const mapPath = __dirname + '/public/stories/'+sid+'/';
  const fileName = 'map.json';
  if (fs.existsSync(mapPath+fileName)) {
    //file already exist read and return  it :
   fs.readFile(mapPath+fileName,'utf8', (err, data) => {
      if (err) return res.json({error:err, msg:'Error reading '+mapPath+fileName})
      return res.json({map: data, msg: 'map received'});
    });
  } else {
    // map preference json file does not exist
    return res.json({ error: 'Map json preferences does not exist' , msg: 'Map json preferences does not exist'});
  }
});
app.post('/stories/:storyId/stages/0', function(req, res, next) {
  const { sid, name, photo, adress, description, images, pictures, videos, audios, onZoneEnter, onPictureMatch, onZoneLeave, type, scene_type,scene_options, tesselate,  geometry } = req.body;
  const stageOrder = null;
  createStage({ sid , name, photo, adress, description, images, pictures, videos, audios, onZoneEnter, onPictureMatch, onZoneLeave, type, scene_type, scene_options, stageOrder, tesselate, geometry  }).then((stage) => {
    //if(hasbot) { bot.telegram.sendMessage(chat_id,"New stage created: " + name + ','+ adress);}
    return res.json({ stage, 'data': stage, msg: 'stage created successfully' })
  });
});
app.post('/stories/:storyId/stages/:stageId', function(req, res, next) {
  let sid = parseInt(req.params.storyId);
  let id = parseInt(req.params.stageId);
  const { name, photo, adress, description, dimension, radius, images, pictures, videos, audios, onZoneEnter, onPictureMatch, onZoneLeave, type, scene_type, scene_options, tesselate,  geometry } = req.body;
  updateStage({id, sid, name, photo, adress, description, dimension, radius, images, pictures, videos, audios, onZoneEnter, onPictureMatch, onZoneLeave, type, scene_type, scene_options, tesselate,  geometry }).then(stage => {
      res.json({ stage, msg: 'Stage updated successfully' })
  });
});
app.delete('/stories/:storyId/stages/:stageId', function(req, res, next) {
  let sid = parseInt(req.params.storyId);
  let id = parseInt(req.params.stageId);
  deleteStage(id, sid).then(user => {
      res.json({ user, msg: 'Stage destroyed successfully' })
  });
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
               'category': 'images',
               'name': file.originalname,
               'size': file.size,
               'type': 'image',
               'mimetype': file.mimetype,
               'path': 'assets/stories/'+ sid + '/stages/' + ssid + '/images/' + file.originalname,
               'src': serverUrl + 'assets/stories/'+ sid + '/stages/' + ssid + '/images/' + file.originalname
           });
          });
        updateFieldFromStage({ssid: ssid, sid: sid, field: 'images', fieldValue: images}).then((stage) => {
          //bot.telegram.sendMessage(chat_id,sid + " " + ssid + "Stage updated successfully");

          return res.json({ stage, images: images, msg: 'Stage updated successfully' })
        });
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
    upload(req,res, async function(err) {
      if(err) {
        return res.end("Error uploading file." + err);
      } else {
        //bot.telegram.sendPhoto(chat_id, "http://localhost:3010"+req.files[0].path).then(res => res);

        try {
          Promise.all(req.files.map(async file => {
            let image =  {
              'category': 'pictures',
              'name': file.originalname,
              'size': file.size,
              'type': 'picture',
              'mimetype': file.mimetype,
              'path': 'assets/stories/'+ sid + '/stages/' + ssid + '/pictures/' + file.originalname,
              'src': serverUrl + 'assets/stories/'+ sid + '/stages/' + ssid + '/pictures/' + file.originalname
            };
            image.rating = await arcoreimgRank(path + '/' + file.originalname).then((resolve, reject) =>
            {
              resolve = resolve.replace("\n", "");
              return  (parseInt(resolve) > 0) ? parseInt(resolve) : null;
            });
              return image;
          })).then(images => {
              if(images && images.length > 0 ) {

                updateFieldFromStage({ssid: ssid, sid: sid, field: 'pictures', fieldValue: images}).then(stage =>
                   res.json({ stage, pictures: images, msg: 'Stage updated successfully' })
                );

              } else {
                res.json({msg: 'Error image(s) are rejected'});
              }
              // all found riders here
          }).catch(err => {
              console.log(err);
          });

        } catch(e) {
          console.log(e.message);
        }

        // console.log('toto');
        // console.log('IMAGES', images);

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
               'name': file.originalname,
               'category': 'videos',
               'size': file.size,
               'type': 'video',
               'path': 'assets/stories/'+ sid + '/stages/' + ssid + '/videos/' + file.originalname,
               'src': serverUrl + 'assets/stories/'+ sid + '/stages/' + ssid + '/videos/' + file.originalname
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
               'name': file.originalname,
               'category': 'audios',
               'size': file.size,
               'type': 'audio',
               'path': 'assets/stories/'+ sid + '/stages/' + ssid + '/audios/' + file.originalname,
               'src': serverUrl + 'assets/stories/'+ sid + '/stages/' + ssid + '/audios/' + file.originalname
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
      newObj.path = newObj.path.replace(oldDir, newDir);
      //console.log('newObj', newObj);
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
  if(req.body.obj && req.body.obj.name) {
    let sid = parseInt(req.params.storyId);
    let ssid = parseInt(req.params.stageId);
    let name = req.body.obj.name;
    let field = req.body.obj.category;
    let prop = req.body.prop;
    let propValue = req.body.propValue;
    changePropFromObject(sid, ssid, name, field, prop, propValue).then(function(result){
      res.json({obj: req.body.obj, msg: name + ': '+ prop + ' changed successfully to' + propValue})
    });
  } else {
    res.json({message: 'error no obj sent', error: req.body });
    console.log('error no obj sent ', req.body);
  }

});
app.post('/stories/:storyId/stages/:stageId/preflight', function(req, res, next) {
  let ssid = parseInt(req.params.stageId);
  // get stage
  getStage({id: ssid}).then(stage => {
    // perform preflight check
    let log = checkPreFlight(stage.get({ raw: true }));
    if(log) res.json({preflight: log , msg: 'preflight done'})

  });
});
app.post('/stories/:storyId/preflight', function(req, res, next) {
  let sid = parseInt(req.params.storyId);
  // get stage
  //console.log('stages:', stages);
  getStory({id: sid}).then(story => {
    //story[dataValues].stages ='toto' ;

    let st = story.get({
      plain: true
    });

    getAllStages(sid).then(stages => {
      st['stages'] = stages;
      // write json file
      let filePath = './public/export/stories/' + sid + '/export/';
      let fileName = 'story.json';

      if (fs.existsSync(filePath+fileName)) {
        //file already exist remove it :
         rimraf.sync(filePath+fileName);
         fs.writeFile(filePath+fileName, JSON.stringify(st), 'utf8', function(err) {
          if (err) res = {category: 'json', condition: 'JSON export complete' , check: false, error: err };
          res = {category: 'json', condition: 'JSON export complete' , check: true };
        });
      } else {
         fs.writeFile(filePath+fileName, JSON.stringify(st), 'utf8', function(err) {
          if (err) res =  {category: 'json', condition: 'JSON export' , check: false, error: err };
          res = {category: 'json', condition: 'JSON export complete' , check: true };
        });
      }
      // story preflight
      let preflight= storyCheckPreflight(st);

      res.json({story: st , preflight: preflight, msg: 'Story preflight ok'});
    });
  });
});
app.post('/stories/:storyId/stages/:stageId/download', function(req, res, next) {
  let ssid = parseInt(req.params.stageId);
  // get stage
  getStage({id: ssid}).then(stage => {
    // perform export
    exportStageTar(stage.get({
      plain: true
    })).then(log => {
      res.json({ export: log , msg: 'export done'})
    });
  });
});
app.post('/stories/:storyId/download', function(req, res, next) {
  let sid = parseInt(req.params.storyId);
  // get stage
  getStory({id: sid}).then(story => {
    // perform export
    exportStoryTar(sid).then(log => {
      res.json({export: log , msg: 'export done'})
    });
  });
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
    console.log('BooksOnWall RESTFULL Server listening on port 3010! Go to http://localhost:3000/')
  });
}
