const Sequelize = require('sequelize');
module.exports.stages = {
  sid: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  adress: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  tessellate: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: -1
  },
  pictures: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  geometry: {
    type: Sequelize.GEOMETRY,
    allowNull: true
  }
};
