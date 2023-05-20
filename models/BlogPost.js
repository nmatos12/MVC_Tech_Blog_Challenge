const { Model, DataTypes } = require('sequelize');
const db = require('../config/connection');

class BlogPost extends Model { }

BlogPost.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'post'
})

module.exports = BlogPost;