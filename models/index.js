const Sequelize = require('sequelize');
const UserModel = require('./user');
const PollModel = require('./poll');
const ReactionTestModel = require('./reactionTest')
const ComplexReactionTestModel = require('./complexReactionTest')
const InviteLinkModel = require('./inviteLink')
const AccuracyTestModel = require('./accuracyTest')

const sequelize = new Sequelize('studs', 's367403', 'xaoVq03dAHI9DUXL', {
    dialect: 'postgres',
    host: 'localhost',
});

const User = UserModel(sequelize);
const Poll = PollModel(sequelize);
const ReactionTest = ReactionTestModel(sequelize);
const ComplexReactionTest = ComplexReactionTestModel(sequelize);
const InviteLink = InviteLinkModel(sequelize);
const AccuracyTest = AccuracyTestModel(sequelize);

module.exports = {
    sequelize,
    User,
    Poll,
    ReactionTest,
    ComplexReactionTest,
    InviteLink,
    AccuracyTest
};
