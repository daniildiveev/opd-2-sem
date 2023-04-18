const Sequelize = require('sequelize')

module.exports = function (sequelize){
    const InviteLink = sequelize.define('invite_link', {
            userWhoCreated: Sequelize.INTEGER,
            testType: Sequelize.STRING,
            code: Sequelize.STRING,
            used: Sequelize.BOOLEAN
        },
        {
            timestamps: false
        })

    return InviteLink;
}