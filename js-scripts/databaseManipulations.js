const {Poll, ReactionTest, ComplexReactionTest, User, AccuracyTest} = require('../models')

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

module.exports = {filterTest, getUsers}