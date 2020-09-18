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
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  credits: {
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  artist: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
        model: 'artists',
        key: 'id',
    }
  },
  design_options:  {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: null
  },
  tessellate: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: -1
  },
  geometry: {
    type: Sequelize.GEOMETRY,
    allowNull: true
  },
  viewport:  {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: null
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  zipsize :{
    type: Sequelize.STRING(256),
    defaultValue: ''
  },
  version :{
    type: Sequelize.STRING(256),
    defaultValue: ''
  },
};
