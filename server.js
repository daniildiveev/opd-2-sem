const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash')
const path = require('path')
const crypto = require('crypto')
const LocalStrategy = require('passport-local').Strategy;
const {sequelize, User, Poll, ReactionTest} = require('./models/index');
const {ComplexReactionTest, InviteLink, AccuracyTest} = require("./models");
const {filterTest, getUsers} = require('./js-scripts/databaseManipulations')
const {login} = require("passport/lib/http/request");
<<<<<<< HEAD
=======

>>>>>>> daniildiveev/js
const server = express();

server.use(express.json());
server.use(express.static('front-end'));
server.use(express.static('resources'));
server.use('js-script', express.static('js-scripts'));
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
        const data = JSON.parse(decodeURIComponent(req.query.data)).pollData;

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
        res.render('2nd-lab-tests/LightReactionTest')
    }
})
{}
server.get('/multiple_colours_test', (req, res) => {
    if(!req.isAuthenticated()){
        res.redirect('/login')
    } else {
        res.render('2nd-lab-tests/ColorReactionTest')
    }
})

server.get('/sound_test', (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login')
    } else {
        res.render('2nd-lab-tests/SoundReactionTest')
    }
})

server.get('/visual_math_test', (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login')
    } else {
        res.render('2nd-lab-tests/VisualMathTest')
    }
})

server.get('/math_sound', (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login')
    } else {
        res.render('2nd-lab-tests/SoundMathTest')
    }
})

server.get('/create_invite', (req, res) => {
    if(!req.isAuthenticated()){
        res.redirect('/login')
    } else {
        res.render('CreateInviteLinkPage')
    }
})

<<<<<<< HEAD


=======
>>>>>>> daniildiveev/js
server.get('/tests_list', (req, res) => {
    res.render('TestListPage')
})

server.post('/get_tests_from_db', async (req, res) => {
    const type = req.body.type
    const testId = req.body.testId
    const username = req.body.username
    const testType = req.body.testType

    const tests = await filterTest(type, username, testId, testType)

    if (tests !== {}){
        res.send(tests)
    }
})

server.post('/get_users_from_db', async (req, res) => {
    const users = await getUsers()

    if (users !== []){
        res.send({logins: users})
    }
})

server.get('/easy_action', async (req, res) => {
    if(!req.isAuthenticated()){
        res.redirect('/login')
    }

    res.render('3rd-lab-tests/EasyActionTest')
})

server.get('/hard_action', async (req, res) => {
    if(!req.isAuthenticated()){
        res.redirect('/login')
    }

    res.render('3rd-lab-tests/HardActionTest')
})

server.get('/invite/:code', async (req, res) => {
    const link = await InviteLink.findOne({
        where: {
            code: req.params.code
        }
    })

    const tests = link.tests
    const data = {
        tests: tests,
        i: 1
    }

    console.log(tests)

    if (link) {
        const url = '/' + tests[0] + '?data=' + encodeURIComponent(JSON.stringify(data))
        res.redirect(url)
    }
})

server.get('/analog_tracking_test', (req, res) => {
    if(!req.isAuthenticated()){
        res.redirect('/login')
    } else {
        res.render('4th-lab-tests/AnalogTrackingTest')
    }
})

server.get('/stalking_test', (req, res) => {
    if(!req.isAuthenticated()){
        res.redirect('/login')
    } else {
        res.render('4th-lab-tests/StalkingTest')
    }
})

<<<<<<< HEAD
//  ######### 5 ЛАБА   #############




server.get('/attention_test', (req, res) => {
    // if(!req.isAuthenticated()){
    //     res.redirect('/login')
    // } else {
        const utils = require("./front-end/5th-lab-tests/attention-test/AttentionTestLogic")
        res.render('5th-lab-tests/attention-test/AttentionTest', {utils:utils})
    // }
})

server.get('/schulte_table', (req, res) => {
    // if(!req.isAuthenticated()){
    //     res.redirect('/login')
    // } else {
        
        res.render('5th-lab-tests/table-schulte/SchulteTable')
    // }
})

server.get('/thinking-test', (req, res) => {
    // if(!req.isAuthenticated()){
    //     res.redirect('/login')
    // } else {
        
        res.render('5th-lab-tests/thinking-test/ThinkingTest')
    // }
})

// #################################


=======
>>>>>>> daniildiveev/js
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
    const sex = req.body.sex
    const age = req.body.age

    try {
        const user = await User.create({ login, password, isAdmin, sex, age });
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
    const sex = req.body.sex;
    const age = req.body.age;

    try {
        const user = await User.create({ login, password, isAdmin, age, sex});
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
        let data = null

        if (req.query.data){
            data = JSON.parse(decodeURIComponent(req.query.data))
        }

        const pollData = req.body

        req.flash("passed_1_part", true)

        if(data){
            data = {
                pollData: pollData,
                data: data
            }
            res.redirect(`/poll_1_part_2?data=${encodeURIComponent(JSON.stringify(data))}`)
        } else {
            res.redirect(`/poll_1_part_2?data=${encodeURIComponent(JSON.stringify(data))}`)
        }
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
    const allData = JSON.parse(decodeURIComponent(req.query.data))
    let data = null

    if (allData.data){
        data = allData.data
        data.i++;
    }

    try {
        const poll = await Poll.create({user, profession,  points})

        if(data){
            if (data.i - 1 !== data.tests.length) {
                res.redirect('/' + data.tests[data.i - 1] + '?data=' + encodeURIComponent(JSON.stringify(data)))
            }  else {
                res.redirect('/polls_results')
            }
        } else {
            return res.redirect('/polls_results')
        }
    }
    catch (err){
        console.log(err)
    }
})

server.post('/reaction_test', async (req, res) => {
    const user = req.user.id
    const type = req.body.testType
    const reactionTime = req.body.reactionTime

    let data = null

    if (req.query.data){
        data = JSON.parse(decodeURIComponent(req.query.data))
        data.i++;
    }

    try {
        const reactionTest = await ReactionTest.create({user, type, reactionTime})

        if(data){
            if (data.i - 1 !== data.tests.length) {
                res.redirect('/' + data.tests[data.i - 1] + '?data=' + encodeURIComponent(JSON.stringify(data)))
            }  else {
                res.redirect('/polls_results')
            }
        } else {
            return res.redirect('/polls_results')
        }
    } catch (e) {
        console.log(e)
    }
})

server.post('/complex_reaction_test', async (req, res) => {
    const user = req.user.id
    const type = req.body.testType
    const reactionTime1 = req.body.reactionTimings[0]
    const reactionTime2 = req.body.reactionTimings[1]
    const reactionTime3 = req.body.reactionTimings[2]

    let data = null

    if (req.query.data){
        data = JSON.parse(decodeURIComponent(req.query.data))
        data.i++;
    }

    try{
        const complexReactionTest = await ComplexReactionTest.create({user, type, reactionTime1, reactionTime2, reactionTime3})

        if(data){
            if (data.i - 1 !== data.tests.length) {
                res.redirect('/' + data.tests[data.i - 1] + '?data=' + encodeURIComponent(JSON.stringify(data)))
            }  else {
                res.redirect('/polls_results')
            }
        } else {
            return res.redirect('/polls_results')
        }
    } catch (e){
        console.log(e)
    }

})

server.post('/accuracy_test', async (req, res) => {
    const user = req.user.id
    const type = req.body.testType
    const accuracy = req.body.accuracy

    let data = null

    if(req.query.data){
        data = JSON.parse(decodeURIComponent(req.query.data))
    }

    try{
        const accuracyTest = await AccuracyTest.create({user, type, accuracy})

        if(data){
            if (data.i - 1 !== data.tests.length) {
                res.redirect('/' + data.tests[data.i - 1] + '?data=' + encodeURIComponent(JSON.stringify(data)))
            }  else {
                res.redirect('/polls_results')
            }
        } else {
            return res.redirect('/polls_results')
        }
    } catch (e) {
        console.log(e)
    }
})


server.post('/create_invite', async (req, res) => {
    const userWhoCreated = req.user.id;
    const used = false;
    const tests = req.body.tests;
    const code = crypto.randomBytes(10).toString('hex');

    try {
        const inviteLink = await InviteLink.create({userWhoCreated, tests, code, used})
        res.send({link: '/invite/' + code})
    } catch (e) {
        console.log(e)
    }
})

sequelize.sync().then(() => {
    server.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});