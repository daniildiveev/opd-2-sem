const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash')
const path = require('path')
const LocalStrategy = require('passport-local').Strategy;
const { sequelize, User } = require('./models');

const server = express();

server.use(express.json());
server.use(express.static('front-end'));
server.use(express.urlencoded({ extended: true }));
server.use(session({ secret: 'my_secret', resave: false, saveUninitialized: false }));
server.use(flash())
server.set('views', path.join(__dirname, 'front-end'))
server.set('view engine', 'ejs')

passport.use('local', new LocalStrategy({ usernameField: 'login' }, async (login, password, done) => {
    try {
        const user = await User.findOne({ where: { login } });
        if (!user) {
            return done(null, false, { message: 'User does not exist' });
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
    let username;
    if(req.isAuthenticated()){
        username = req.user.login;
    }
    else{
        username = "";
    }

    res.render('MenuPageDraft', {username})
});

server.get('/login', (req, res) => {
    const errorMessage = req.flash('error')[0]
    res.render('RegistrationForm', {errorMessage});
});

server.get('/register', (req, res) => {
    const errorMessage = req.flash('error')[0]
    res.render('RegistrationForm', {errorMessage});
});

server.get('/characteristics', (req, res) => {
    res.render('SecondPage');
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
            return res.redirect('/login');
        });
    } catch (err) {
        req.flash('error', 'User already exists')
        res.redirect("/register")
    }
});

sequelize.sync().then(() => {
    server.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});
