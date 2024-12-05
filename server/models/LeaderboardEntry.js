const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaderboardEntry = sequelize.define('LeaderboardEntry', {
  summonerId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  rank: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  leaguePoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  wins: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  losses: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = LeaderboardEntry;
