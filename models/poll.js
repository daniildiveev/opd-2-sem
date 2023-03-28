const Sequelize = require('sequelize')

module.exports = function (sequelize){
    const Poll = sequelize.define('poll',{
        user: Sequelize.INTEGER,
        profession: Sequelize.STRING,
        points: Sequelize.STRING
    })

    return Poll;
}