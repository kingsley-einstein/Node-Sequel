'use strict';

module.exports = (sequelize, DataType) => {
    const Blog = sequelize.define('Blog', {
        id: {
            type: DataType.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                len: [4, 400],
                notEmpty: true,
            }
        },
        content: {
            type: DataType.TEXT,
            allowNull: false,
            validate: {
                len: [8, 6000],
                notEmpty: true
            }
        },
        created: {
            type: DataType.DATE,
            defaultValue: DataType.NOW
        }
    });

    Blog.prototype.editTitle = function(title) {
        this.title = title;
    };

    Blog.prototype.editContent = function(content) {
        this.content = content;
    };

    return Blog;
};