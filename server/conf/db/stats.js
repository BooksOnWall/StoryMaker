const Sequelize = require('sequelize');
module.exports.stats = {
  sid: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
        model: 'stories',
        key: 'id'
    },
  },
  ssid: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
        model: 'stages',
        key: 'id'
    },
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
  },
  uniqueId: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: false
  },
  values: {
    type: Sequelize.JSON,
    allowNull: true,
  },
  data : {
    type: Sequelize.JSON,
    allowNull: true,
  }
};
