const Sequelize = require('sequelize');
module.exports.userPref = {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: 'compositeIndex'
  },
  value: {
    type: Sequelize.JSON,
    allowNull: false,
    unique: 'compositeIndex'
  },
  uid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: 'compositeIndex'
  }
};
