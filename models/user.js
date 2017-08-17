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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'email must be present'
        },
        isEmail: {
          msg: 'email must be valid'
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'username must be present'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'password must be present'
        }
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
    resetToken: {
      type: DataTypes.STRING,
      unique: true,
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
        User.belongsToMany(models.Story, { 
          through: 'StoryUser',
          foreignKey: 'userId',
          otherKey: 'storyId'
        });
      }
    }
  });

  User.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, 10).then(hashedPassword => {
      user.password = hashedPassword;
    });
  });

  User.beforeUpdate((user, options) => {
    if (options.fields.includes('password')) {
      return bcrypt.hash(user.password, 10).then(hashedPassword => {
        user.password = hashedPassword;
      });
    }
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