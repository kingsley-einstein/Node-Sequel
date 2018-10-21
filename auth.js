const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const { User } = require('./db');
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret'
};

const strategy = new Strategy(jwtOptions, (jwt_payload, next) => {
    User
    .findById(jwt_payload.id)
    .then(user => {
        if (user) {
            next(null, user);
        }
        else {
            next(null, false);
        }
    });
});
passport.use(strategy);

module.exports = {
    passport,
    jwtOptions
};