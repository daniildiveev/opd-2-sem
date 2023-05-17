const Sequelize = require('sequelize')

module.exports = function (sequelize){
    const ComplexReactionTest = sequelize.define('complex_reaction_test', {
        user: Sequelize.INTEGER,
        type: Sequelize.STRING,
        reactionTime1: Sequelize.FLOAT,
        reactionTime2: Sequelize.FLOAT,
        reactionTime3: Sequelize.FLOAT
    })

    return ComplexReactionTest;
}