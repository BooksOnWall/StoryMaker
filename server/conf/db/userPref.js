const Sequelize = require('sequelize');
module.exports.userPref = {
  pname: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: 'compositeIndex'
  },
  pvalue: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  uid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: 'compositeIndex'
  }
};
