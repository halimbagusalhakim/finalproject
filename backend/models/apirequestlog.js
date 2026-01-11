'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Apirequestlog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Apirequestlog.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Apirequestlog.init({
    userId: DataTypes.INTEGER,
    endpoint: DataTypes.STRING,
    method: DataTypes.STRING,
    timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Apirequestlog',
  });
  return Apirequestlog;
};