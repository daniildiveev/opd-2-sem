const Sequelize = require('sequelize');
const UserModel = require('./user');

const sequelize = new Sequelize('opd_2_sem', 'postgres', 'N29EXFdw', {
    dialect: 'postgres',
    host: 'localhost',
});

const User = UserModel(sequelize);

module.exports = {
    sequelize,
    User,
};
