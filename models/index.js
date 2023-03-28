const Sequelize = require('sequelize');
const UserModel = require('./user');
const PollModel = require('./poll');

const sequelize = new Sequelize('opd_2_sem', 'postgres', 'N29EXFdw', {
    dialect: 'postgres',
    host: 'localhost',
});

const User = UserModel(sequelize);
const Poll = PollModel(sequelize);

module.exports = {
    sequelize,
    User,
    Poll
};
