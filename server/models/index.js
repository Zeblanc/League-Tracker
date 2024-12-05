const Account = require('./Account');
const LeaderboardEntry = require('./LeaderboardEntry');
const { Match, MatchParticipant } = require('./Match');

// Define relationships
Account.hasMany(MatchParticipant, { foreignKey: 'puuid' });
MatchParticipant.belongsTo(Account, { foreignKey: 'puuid' });

module.exports = {
  Account,
  Match,
  MatchParticipant,
  LeaderboardEntry
};
