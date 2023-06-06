const Sequelize = require('sequelize');
const UserModel = require('./user');
const PollModel = require('./poll');
const ReactionTestModel = require('./reactionTest')
const ComplexReactionTestModel = require('./complexReactionTest')
const InviteLinkModel = require('./inviteLink')
const AccuracyTestModel = require('./accuracyTest')
const MethodologyModel = require('./methodology')
const PVKModel = require('./PVK')
const ProfessionModel = require('./profession')

const sequelize = new Sequelize('opd_2_sem', 'postgres', 'N29EXFdw', {
    dialect: 'postgres',
    host: 'localhost',
});
// const sequelize = new Sequelize('opd_2_sem', 'postgres', 'N29EXFdw', {
//     dialect: 'postgres',
//     host: 'localhost',
// });

const User = UserModel(sequelize);
const Poll = PollModel(sequelize);
const ReactionTest = ReactionTestModel(sequelize);
const ComplexReactionTest = ComplexReactionTestModel(sequelize);
const InviteLink = InviteLinkModel(sequelize);
const AccuracyTest = AccuracyTestModel(sequelize);
const Methodology = MethodologyModel(sequelize);
const PVK = PVKModel(sequelize);
const Profession = ProfessionModel(sequelize);

module.exports = {
    sequelize,
    User,
    Poll,
    ReactionTest,
    ComplexReactionTest,
    InviteLink,
    AccuracyTest,
    Methodology,
    PVK,
    Profession
};
