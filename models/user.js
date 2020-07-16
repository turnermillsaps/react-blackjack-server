'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    googleId: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.hasMany(models.user_games, {
      foreignKey: {
        name: 'user_id'
      }
    });
  };
  return user;
};