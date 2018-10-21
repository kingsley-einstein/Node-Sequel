//Require the necessary modules

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const { User, Blog, sequelize } = require('./db');

const { passport, jwtOptions } = require('./auth');
const jwt = require('jsonwebtoken');

//Initialize passport for use by the app

app.use(passport.initialize());
app.use(bodyParser({extended: true}));
app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);

//Wire routes

app.get('/users', (req, res) => {
    User
    .findAll({include: [Blog]})
    .then(users => res.json(users));
});

app.post('/users', (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email
    });
    user.setPassword(req.body.password);
    user.save();
    res.json(user);
});

//This is an authenticated route

app.post('/users/:id/blog', passport.authenticate('jwt', {session: false}), (req, res) => {
    User
    .findById(req.params.id)
    .then(user => {
        Blog
        .create({
            title: req.body.title,
            content: req.body.content,
            UserId: user.id
        })
        .then(blog => res.json(blog));
    });
});

//The login is used to generate the token from the user's id. The user should necessarily exist in the database

app.post('/login', (req, res) => {
    if (req.body.email && req.body.password) {
        User
        .findOne({where: {email: req.body.email}})
        .then(user => {
            if (user) {
                if (user.checkPassword(req.body.password)) {
                    const payload = {id: user.id};
                    const token = jwt.sign(payload, jwtOptions.secretOrKey);
                    res.status(200).json({token: token});
                }
                else {
                    res.status(500).json({message: 'Incorrect password'});
                }
            }
            else {
                res.status(404).json({message: 'User not found'});
            }
        });
    }
});

app.get('/blogs', passport.authenticate('jwt', {session: false}), (req, res) => {
    Blog
    .findAll({include: [User]})
    .then(blogs => res.json(blogs));
});


sequelize
.sync({force: true})
.then(() => {
    app.listen(app.get('port'), () => {
        console.log(`Express server running on ${app.get('port')} and database is synched`);
    });
});