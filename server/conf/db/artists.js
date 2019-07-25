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
  description : {
    type: Sequelize.TEXT,
    allowNull: true,
  }
};
