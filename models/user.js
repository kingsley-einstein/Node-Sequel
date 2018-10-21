'use strict';

//Require crypto for password hashing and then create model from sequelize.
//Sequelize is an ORM for mapping objects to SQL databases

const crypto = require('crypto');

module.exports = (sequelize, DataType) => {
    const User = sequelize.define('User', {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                is: /[a-z]+/i,
                notEmpty: {
                    msg: 'Blank string not allowed'
                }
            }
        },
        email: {
            type: DataType.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
                notEmpty: {
                    msg: 'Blank string not allowed in email'
                }
            }
        },
        salt: DataType.STRING,
        password: {
            type: DataType.STRING,
            validate: {
                notEmpty: true
            }
        }
    });

    //Use 'prototype' to define instance methods
    
    User.prototype.setPassword = function(password) {
        this.setDataValue('salt', crypto.randomBytes(16).toString('base64'));
        this.setDataValue('password', crypto.pbkdf2Sync(password, new Buffer(this.salt, 'utf8'), 1000, 63, 'sha512').toString('hex'));
    };

    User.prototype.checkPassword = function(password) {
        const hash = crypto.pbkdf2Sync(password, new Buffer(this.salt, 'utf8'), 1000, 63, 'sha512').toString('hex');
        return hash === this.password;
    };

    return User;
};