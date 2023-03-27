const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = function(sequelize) {
    const User = sequelize.define('user', {
        login: {
            type: Sequelize.STRING,
            unique: true
        },
        password: Sequelize.STRING
    });

    User.beforeCreate(async (user, options) => {
        user.password = await bcrypt.hash(user.password, 10);
    });

    User.prototype.validatePassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    };

    return User;
};