const Sequelize = require('sequelize')

module.exports = function (sequelize){
    const Profession = sequelize.define('profession', {
        name: Sequelize.STRING,
        description: Sequelize.STRING
    },
    {
        timestamps: false
    })

    return Profession;
}