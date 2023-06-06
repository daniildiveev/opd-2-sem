const {Poll,
    ReactionTest,
    ComplexReactionTest,
    User,
    AccuracyTest,
    Methodology,
    PVK,
    Profession} = require('../models')

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
module.exports = {filterTest, getUsers, getProfessions, getPVKs, getProfessionMethodology, deleteMethodology, deleteMethod, deleteAllFromMethod}