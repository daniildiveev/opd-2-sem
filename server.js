const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash')
const path = require('path')
const LocalStrategy = require('passport-local').Strategy;
const {sequelize, User, Poll, ReactionTest} = require('./models/index');

const server = express();

server.use(express.json());
server.use(express.static('front-end'));
server.use(express.static('js-scripts'))
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
    let username, adminUser, loggedIn;
    if(req.isAuthenticated()){
        username = req.user.login;
        adminUser = req.user.isAdmin;
        loggedIn = true;
    }
    else{
        username = "";
        adminUser = false;
        loggedIn = false;
    }

    res.render('MenuPageDraft', {username, adminUser, loggedIn})
});

server.get('/login', (req, res) => {
    const errorMessage = req.flash('error')[0]
    res.render('LoginForm', {errorMessage});
});

server.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});


server.get('/register', (req, res) => {
    const errorMessage = req.flash('error')[0]
    res.render('RegistrationForm', {errorMessage});
});

server.get('/admin/register', (req, res) => {
    if(!req.isAuthenticated()){
        res.redirect('/login')
        return
    }

    const checkAdmin = req.user.isAdmin;

    if(!checkAdmin){
        res.redirect('/')
    }

    else{
        const errorMessage = req.flash('error')[0]
        res.render('AdminRegistrationForm', {errorMessage});
    }
})

server.get('/characteristics', (req, res) => {
    res.render('SecondPage');
})

server.get('/polls_results', async (req, res) => {
        try {
            const polls = await Poll.findAll();

            res.render('ResultsPage', { polls });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
})

server.get('/poll_1_part_1', (req, res) => {
    if(!req.isAuthenticated()){
        res.redirect('/login')
        return
    }

    const checkAdmin = req.user.isAdmin;

    if(!checkAdmin){
        res.redirect('/')
    }

    else{
        res.render('1stTest1stPart');
    }
})

server.get('/poll_1_part_2', (req, res) => {
    if (!req.flash("passed_1_part")[0]){
        res.redirect('/')
    }
    else {
        const data = JSON.parse(decodeURIComponent(req.query.data));

        const profession = data.profession
        let characteristics = []

        for (let i = 0; i<169; i++){
            if(data["question" + i]){
                characteristics.push({id: i, name:data["question" + i]})
            }
        }

        res.render('1stTest2ndPart', {profession, characteristics})
    }
})


server.get('/light_test', (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login')
    } else {
        res.render('LightReactionTest')
    }
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
    const isAdmin = false;

    try {
        const user = await User.create({ login, password, isAdmin });
        req.login(user, (err) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            return res.redirect('/');
        });
    } catch (err) {
        req.flash('error', 'User already exists')
        res.redirect("/register")
    }
});

server.post('/admin/register', async (req, res, next) => {
    const { login, password } = req.body;
    const isAdmin = true;

    try {
        const user = await User.create({ login, password, isAdmin });
        req.login(user, (err) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            return res.redirect("/admin/register");
        });
    } catch (err) {
        req.flash('error', 'User already exists')
        res.redirect("/admin/register")
    }
});

server.post("/poll_1_part_2", async (req, res) => {
    if(!req.isAuthenticated()){
        res.redirect("/login")
        return;
    }

    else{
        const data = req.body
        req.flash("passed_1_part", true)
        res.redirect(`/poll_1_part_2?data=${encodeURIComponent(JSON.stringify(data))}`)
    }
})

server.post("/1st_test", async (req, res) => {
    let results = ""

    for (let i = 0; i < 169; i++) {
        if (req.body["value" + i]){
            results += req.body["value" + i]
        }
        else{
            results += "0"
        }
    }

    const profession = decodeURIComponent(req.query.profession)
    const points = results
    const user = req.user.id

    try {
        const poll = await Poll.create({user, profession,  points})
        return res.redirect('/polls_results')
    }
    catch (err){
        console.log(err)
    }

    res.redirect("/")
})

server.post('/reaction_test', async (req, res) => {
    const user = req.user.id
    const type = req.body.testType
    const reactionTime = req.body.reactionTime

    try {
        const reactionTest = await ReactionTest.create({user, type, reactionTime})
        return res.redirect('/polls_results')
    } catch (e) {
        console.log(e)
    }
})

sequelize.sync().then(() => {
    server.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});