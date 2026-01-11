'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rider.belongsTo(models.Team, { foreignKey: 'teamId' });
    }
  }
  Rider.init({
    name: DataTypes.STRING,
    teamId: DataTypes.INTEGER,
    nationality: DataTypes.STRING,
    birthdate: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Rider',
  });
  return Rider;
};