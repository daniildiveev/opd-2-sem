const Sequelize = require('sequelize');
const UserModel = require('./user');
const PollModel = require('./poll');
const ReactionTestModel = require('./reactionTest')
const ComplexReactionTestModel = require('./complexReactionTest')
const InviteLinkModel = require('./inviteLink')

const sequelize = new Sequelize('opd_2_sem', 'postgres', 'N29EXFdw', {
    dialect: 'postgres',
    host: 'localhost',
});

const User = UserModel(sequelize);
const Poll = PollModel(sequelize);
const ReactionTest = ReactionTestModel(sequelize);
const ComplexReactionTest = ComplexReactionTestModel(sequelize);
const InviteLink = InviteLinkModel(sequelize);

module.exports = {
    sequelize,
    User,
    Poll,
    ReactionTest,
    ComplexReactionTest,
    InviteLink
};
