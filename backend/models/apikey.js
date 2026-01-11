'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Apikey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Apikey.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Apikey.init({
    key: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
    expiresAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Apikey',
  });
  return Apikey;
};