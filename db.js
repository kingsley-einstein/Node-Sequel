const Sequelize = require('sequelize');
const sequelize = new Sequelize('sequeldb.sqlite', '', '', {
    storage: require('path').join(__dirname, '/sequeldb.sqlite'),
    dialect: 'sqlite',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const UserModel = require('./models/user');
const BlogModel = require('./models/blog');
const AssociationModel = require('./models/associator');

const User = UserModel(sequelize, Sequelize);
const Blog = BlogModel(sequelize, Sequelize);
const Association = AssociationModel(sequelize);

//Associate different models. Alternatively, you could use the hasMany() method instead of the belongsToMany() method to create a one-to-many relationship but in this case would result to an infinite recursion

Blog.belongsTo(User);
User.belongsToMany(Blog, {through: Association, unique: false});

module.exports = {
    User,
    Blog,
    sequelize
};