const {Poll,
    ReactionTest,
    ComplexReactionTest,
    User,
    AccuracyTest,
    Methodology,
    PVK,
    Profession} = require('../models')

const {calculateMean, calculateStandardDeviation, calculateZScore} = require('./utils')

async function filterTest(type, username, testId, testType){
    let userId = null

    if (username){
        const user = await User.findOne({
            where: {
                login: username
            }
        })

        userId = user.id
    }

    if (type === "characteristicsTest"){
        if (testId){
            return await Poll.findByPk(testId)
        }

        if (userId){
            return await Poll.findAll(
                {
                    where: {
                        user: userId
                    }
                }
            )
        } else {
            return await Poll.findAll()
        }

    } else if (type === "reactionTest"){
        if (testId){
            return await ReactionTest.findByPk(testId)
        }

        let filters = {}

        if(testType){
            filters["type"] = testType
        }

        if (userId){
            filters["user"] = userId
        }

        if (filters){
            return await ReactionTest.findAll({
                where : filters
            })
        } else {
            return await ReactionTest.findAll()
        }
    } else if(type === "complexReactionTest") {
        if (testId){
            return await ComplexReactionTest.findByPk(testId)
        }

        let filters = {}

        if (userId){
            filters["user"] = userId
        }

        if(testType){
            filters["type"] = testType
        }

        if (filters){
            return await ComplexReactionTest.findAll({
                where : filters
            })
        } else {
            return await ComplexReactionTest.findAll()
        }
    } else if(type === "accuracyTest") {
        if (testId){
            return await AccuracyTest.findByPk(testId)
        }

        let filters = {}

        if (userId){
            filters["user"] = userId
        }

        if(testType){
            filters["type"] = testType
        }

        if (filters){
            return await AccuracyTest.findAll({
                where : filters
            })
        } else {
            return await AccuracyTest.findAll()
        }
    }
}

async function getUsers(){
    const users = await User.findAll()
    let logins = []

    if(users) {
        users.forEach(user => {
            logins.push(user.login)
        })
    }

    return logins
}

async function getProfessions(){
    return await Profession.findAll()
}

async function getPVKs(){
    return await PVK.findAll()
}

async function getProfessionMethodology(profession){
    return await Methodology.findAll({
        where: {
            profession: profession
        }
    })
}

async function deleteMethodology(profession) {
    let methodologies = await Methodology.findAll({
        where: {
            profession: profession,
        }
    })

    methodologies.forEach(methodology => methodology.destroy())
}

async function deleteMethod(profession, pvk, test){
    let method = await Methodology.findOne({
        where: {
            profession: profession,
            pvk: pvk,
            test: test
        }
    })

    method.destroy()
}


async function deleteAllFromMethod(){
    let method = await Methodology.findAll();
    method.destroy();
}

async function getTestDistribution(test){
    let testsSamples = await filterTest(test)
    let scores = []

    for (let i = 0; i < testsSamples; i++) {
        if (test === "accuracy_test") {
            scores.push(testsSamples[i].accuracy)
        } else if(test === "reaction_test"){
            scores.push(testsSamples[i].reactionTime)
        } else if (test === "complex_reaction_tests"){
            scores.push(testsSamples[i].reactionTime1)
            scores.push(testsSamples[i].reactionTime2)
            scores.push(testsSamples[i].reactionTime3)
        }
    }

    let mean = calculateMean(scores)
    let std = calculateStandardDeviation(scores)

    return {
        mean: mean,
        std: std
    }
}

async function getScore(user, profession){
    let methods = await Methodology.findAll({
        where: {
            profession: profession
        }
    })

    let score = 0

    let test_to_weights = {}
    let pvkTests = []

    methods.forEach(method => {
        test_to_weights[method.test] = method.weight
    })
    methods.forEach(method => pvkTests.push(method.test))

    let testToParams = {}
    let usersTestsScores = {}

    pvkTests.forEach(pvkTest => {
        testToParams[pvkTest] = getTestDistribution(pvkTest)

        let usersTests = filterTest(pvkTest, user)
        usersTestsScores[pvkTest] = []

        if(pvkTest === "accuracy_test"){
            usersTests.forEach(userTest => usersTestsScores[pvkTest].push(userTest.accuracy))
        } else if (pvkTest === "reaction_test"){
            usersTests.forEach(userTest => usersTestsScores[pvkTest].push(userTest.reactionTime))
        } else if (pvkTest === "complex_reaction_test"){
            usersTests.forEach(userTest => usersTestsScores[pvkTest].push(userTest.reactionTime1))
            usersTests.forEach(userTest => usersTestsScores[pvkTest].push(userTest.reactionTime2))
            usersTests.forEach(userTest => usersTestsScores[pvkTest].push(userTest.reactionTime3))
        }

        usersTestsScores[pvkTest] = usersTestsScores[pvkTest].forEach(score => calculateZScore(score, testToParams[pvkTest].mean, testToParams[pvkTest].std))
        score +=  calculateMean(usersTestsScores[pvkTest]) * test_to_weights[pvkTest]
    })

    return score
}

module.exports = {filterTest, getUsers, getProfessions, getPVKs, getProfessionMethodology, deleteMethodology, deleteMethod, deleteAllFromMethod, getScore}