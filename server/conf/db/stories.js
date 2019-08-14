const Sequelize = require('sequelize');
module.exports.stories = {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  state: {
    type: Sequelize.STRING(256),
    defaultValue: ''
  },
  city :{
    type: Sequelize.STRING(256),
    defaultValue: ''
  },
  sinopsys: {
    type: Sequelize.TEXT('long'),
    allowNull: true,
    defaultValue: ''
  },
  credits: {
    type: Sequelize.TEXT('long'),
    allowNull: true,
    defaultValue: ''
  },
  artist: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
};
