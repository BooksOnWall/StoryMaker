const Sequelize = require('sequelize');
module.exports.stages = {
  sid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
        model: 'stories',
        key: 'id'
    },
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  photo: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: null
  },
  adress: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  dimension: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  radius: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  images: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: null
  },
  pictures: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: null
  },
  videos: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: null
  },
  audios: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: null
  },
  onZoneEnter: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: null
  },
  onPictureMatch: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: null
  },
  onZoneLeave: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: null
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  scene_type: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  scene_options:  {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: null
  },
  stageOrder: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  tessellate: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: -1
  },
  geometry: {
    type: Sequelize.GEOMETRY,
    allowNull: true
  }
};
