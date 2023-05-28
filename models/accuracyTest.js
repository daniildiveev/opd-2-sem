const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    const accuracyTest = sequelize.define('accuracy_test', {
        user: Sequelize.INTEGER,
        type: Sequelize.STRING,
        accuracy: Sequelize.FLOAT
    })

    return accuracyTest;
}