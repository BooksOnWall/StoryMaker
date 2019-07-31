const Sequelize = require('sequelize');
module.exports.userPref = {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  value: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  uid: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
};
