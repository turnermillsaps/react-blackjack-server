'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_games = sequelize.define('user_games', {
    money_won_loss: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {});
  user_games.associate = function(models) {
    // associations can be defined here
    user_games.belongsTo(models.user, {
      foreignKey: 'user_id'
    });
  };
  return user_games;
};