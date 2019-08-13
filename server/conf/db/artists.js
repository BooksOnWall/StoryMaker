const Sequelize = require('sequelize');
module.exports.artists = {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  images: {
    type: Sequelize.JSON,
    allowNull: true,
  },
  bio : {
    type: Sequelize.JSON,
    allowNull: true,
  }
};
