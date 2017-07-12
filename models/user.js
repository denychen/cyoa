'use strict';
let bcrypt = require('bcrypt');
let jwt = require('jwt-simple');
let moment = require('moment');
let config = require('../config/config.json');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    token: {
      type: DataTypes.STRING,
      unique: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
      validate: {
        notEmpty: true
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  User.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, 10).then(hashedPassword => {
      user.password = hashedPassword;
    });
  });

  User.prototype.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
  };

  User.prototype.generateToken = function() {
    let expiration = moment().add(7, 'days').valueOf();

    return jwt.encode({
      iss: this.id,
      exp: expiration
    }, config.jwtTokenSecret);
  };

  return User;
};