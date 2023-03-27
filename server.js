const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash')
const LocalStrategy = require('passport-local').Strategy;
const { sequelize, User } = require('./models');

const server = express();

server.use(express.json());
server.use(express.static('front-end'));
server.use(express.urlencoded({ extended: true }));
server.use(session({ secret: 'my_secret', resave: false, saveUninitialized: false }));
server.use(flash())

passport.use('local', new LocalStrategy({ usernameField: 'login' }, async (login, password, done) => {
    try {
        const user = await User.findOne({ where: { login } });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        const isValid = await user.validatePassword(password);

        if (!isValid) {
            console.log("Invalid user")
            return done(null, false, { message: 'Incorrect password.' });
        }

        console.log("User found")

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
});

server.use(passport.initialize());
server.use(passport.session());

server.get('/', (req, res) => {
    res.sendFile(__dirname + '/front-end/MenuPageDraft.html');
});

server.get('/login', (req, res) => {
    res.sendFile(__dirname + '/front-end/RegistrationPage.html');
});

server.get('/register', (req, res) => {
    res.sendFile(__dirname + '/front-end/RegistrationPage.html');
});

server.get('/characteristics', (req, res) => {
    res.sendFile(__dirname + '/front-end/SecondPage.html');
})


server.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true // enable flash messages
}), function(req, res) {
    res.redirect('/');
}, function(req, res, next) {
    req.flash('error', 'Invalid username or password');
    res.redirect('/login');
});


server.post('/register', async (req, res, next) => {
    const { login, password } = req.body;
    try {
        const user = await User.create({ login, password });
        req.login(user, (err) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            return res.redirect('/');
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

sequelize.sync().then(() => {
    server.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});
