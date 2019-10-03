
const Telegraf = require('telegraf');
const express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var multer = require('multer');
var rimraf = require("rimraf");
const Extra = require('telegraf/extra');
const session = require('telegraf/session');
const { reply } = Telegraf;
const Tail = require('nodejs-tail');


const bodyParser = require('body-parser');
//CORS
var cors = require('cors');
//fileupload

// ENV set url(localhost/other) port (1234) and protocol (http/https)
require('dotenv').config();

const host = process.env.SERVER_HOST;
const protocol = process.env.SERVER_PROTOCOL;
const port = process.env.SERVER_PORT;
const hasbot = JSON.parse(process.env.BOT_ACTIVE);

// get mysql connection & credentials parameters
let config = require('./conf/mysql');

//bcrypt
const bcrypt = require('bcryptjs');
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
const getAllStories = async () => {

//Stories.hasMany(Artists, {as: 'a', foreignKey: 'artist', targetKey: 'name'});

  return await Stories.findAll(
    // {attributes: ['id','title', 'active', 'artist', 'city', 'state' ]},
    // {include: [{
    //   model: Artists,
    //   attributes: ['id', 'name']
    // }]}
  );
}
const createStory = async ({ title, state, city, sinopsys, credits, artist, active }) => {
  try {
    let res = await Stories.create({ title, state, city, sinopsys, credits, artist, active });
    const sid = res.get('id');
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
const createStage = async ({ sid , name, photo, adress, description, images, pictures, videos, audios, onZoneEnter, onPictureMatch, onZoneLeave, type, stageOrder, tesselate, geometry }) => {
  try {
    let rank = await getNextOrderFromStory(sid);
    console.log(typeof(geometry));
    //geometry = (typeof(geometry) === 'object') ? JSON.stringify(geometry) : geometry;
    stageOrder = (!stageOrder) ? parseInt(rank) : stageOrder;
    let res = await Stages.create({ sid , name, photo, adress, description, images, pictures, videos, audios, onZoneEnter, onPictureMatch, onZoneLeave, type, stageOrder, tesselate, geometry });
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
  Stages.destroy({
    where: {sid: sid},
    truncate: true
  });
  //deleteAllStages(sid);
  // delete also folders
  //
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
      let tesselate = properties.tesselate;
      let geometry = feature.geometry;
      let onZoneEnter = (properties.onZoneEnter) ? properties.onZoneEnter : null;
      let onPictureMatch = (properties.onPictureMatch) ? properties.onPictureMatch : null;
      let onZoneLeave = (properties.onZoneLeave) ? properties.onZoneLeave : null;

      createStage({ sid , name, photo, adress, description, images, pictures, videos, audios, onZoneEnter, onPictureMatch, onZoneLeave, type, stageOrder, tesselate, geometry }).then(res =>
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
const deleteStage = async (id, sid) => {
  let res = await Stages.destroy({
    where: {id : id, sid: sid }
    });
  //delete stage directory
  rimraf.sync("./public/stories/" + sid + "/stages/" + id);
  return res;
};
const updateFieldFromStage = async ({ ssid, sid, field, fieldValue }) => {
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
  console.log('Telegram Bot activated', hasbot);
  // set telegram bot y tetunnel before starting express
  //

  const sayYoMiddleware = ({ reply }, next) => reply('yo').then(() => next());
  const chat_id = '-389718132';
  const bot = new Telegraf(process.env.BOT_TOKEN);
  // We can get bot nickname from bot informations. This is particularly useful for groups.
  bot.telegram.getMe().then((bot_informations) => {
      bot.options.username = bot_informations.username;
      console.log("Server has initialized bot nickname. Nick: "+bot_informations.username);
      bot.telegram.sendMessage(chat_id,"BooksOnWall Server Started and Telegram Bot initialized. Nick: "+bot_informations.username);
  }).catch(function(err){
      console.log(err);
  });
  // // Register session middleware
  bot.use(session());

  // Register logger middleware
  bot.use((ctx, next) => {
    const start = new Date()
    return next().then(() => {
      const ms = new Date() - start
      console.log('response time %sms', ms);
      //console.log(ctx.message);
    });
  });
  bot.start((ctx) => ctx.reply('Welcome'));

  const commands = `You can control me by sending these commands:
  /help - *list all commands*
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
        media: 'AgADBAADXME4GxQXZAc6zcjjVhXkE9FAuxkABAIQ3xv265UJKGYEAAEC',
        caption: 'From file_id',
        type: 'photo'
      },
      {
        media: 'https://picsum.photos/200/500/',
        caption: 'From URL',
        type: 'photo'
      },
      {
        media: { url: 'https://picsum.photos/200/300/?random' },
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
  // Command handling
  bot.command('answer', sayYoMiddleware, (ctx) => {
    console.log(ctx.message);
    return ctx.reply('*42*', Extra.markdown());
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
    .genSaltSync(saltRounds)
    .then(salt => {
      return bcrypt.hashSync(password, salt);
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
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(password, salt);
  createUser({ name, email, hash }).then(user =>
    res.json({ user, msg: 'account created successfully' })
  );
});
// register route create new user
app.post('/users/0', function(req, res, next) {
  const { name, email, password, active } = req.body;
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(password, salt);
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
  createStory({ title, state, city, sinopsys, credits, artist, active }).then((story) => {
    //if(hasbot) {bot.telegram.sendMessage(chat_id,"New Story created: " + title); }
    return res.json({ story, 'data': story, msg: 'story created successfully' })
  });
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
  getAllStages(sid).then(user => res.json(user));
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
app.post('/stories/:storyId/stages/0', function(req, res, next) {
  const { sid, name, photo, adress, description, images, pictures, videos, audios, onZoneEnter, onPictureMatch, onZoneLeave, type, tesselate,  geometry } = req.body;
  const stageOrder = null;
  console.log('name:', name);
  console.log('sid', sid);
  console.log('type', type);
  console.log('geometry', geometry);
  createStage({ sid , name, photo, adress, description, images, pictures, videos, audios, onZoneEnter, onPictureMatch, onZoneLeave, type, stageOrder, tesselate, geometry  }).then((stage) => {
    //if(hasbot) { bot.telegram.sendMessage(chat_id,"New stage created: " + name + ','+ adress);}
    return res.json({ stage, 'data': stage, msg: 'stage created successfully' })
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
             'image': {
               'name': file.originalname,
               'size': file.size,
               'mimetype': file.mimetype,
               'src': 'assets/stories/'+ sid + '/stages/' + ssid + '/images/' + file.originalname
             }
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
    upload(req,res,function(err) {
      if(err) {
        return res.end("Error uploading file." + err);
      } else {
        let images=[];
        console.log(req.files[0].path);
        //bot.telegram.sendPhoto(chat_id, "http://localhost:3010"+req.files[0].path).then(res => res);
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
  if(req.body.obj && req.body.obj.name) {
    let sid = parseInt(req.params.storyId);
    let ssid = parseInt(req.params.stageId);
    console.log(req.body.obj);
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

//bot.telegram.getUpdates();
//console.log(toto);
//bot.telegram.sendMessage('@Tom Bouillut', 'test');
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
