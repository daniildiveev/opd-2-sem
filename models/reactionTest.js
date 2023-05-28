const Sequelize = require('sequelize')

module.exports = function (sequelize){
    const ReactionTest = sequelize.define('reaction_test', {
        user: Sequelize.INTEGER,
        type: Sequelize.STRING,
        reactionTime: Sequelize.FLOAT
    })

    return ReactionTest
}