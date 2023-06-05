const Sequelize = require('sequelize')

module.exports = function (sequelize){
    const PVK = sequelize.define('PVK',{
        name: Sequelize.STRING
    },
    {
        timestamps: false
    })

    return PVK;
}