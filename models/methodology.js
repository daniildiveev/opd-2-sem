const Sequelize = require('sequelize')

module.exports = function (sequelize){
    const Methodology = sequelize.define('methodology', {
        profession: Sequelize.STRING,
        pvk: Sequelize.INTEGER,
        test: Sequelize.STRING,
        weight: Sequelize.FLOAT
    })

    return Methodology;
}