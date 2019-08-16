const Sequelize = require('sequelize');
module.exports.mapPrefs = {
  pname: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: 'compositeIndex'
  },
  pvalue: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  mid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: 'compositeIndex'
  }
};
