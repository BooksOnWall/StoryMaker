const Sequelize = require('sequelize');
module.exports.stages = {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  adress: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  picture: {
    type: Sequelize.STRING,
    allowNull: true
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  geometry: {
    type: Sequelize.GEOMETRY('POINT'),
    allowNull: true
  }
};
