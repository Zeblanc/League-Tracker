const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Match = sequelize.define('Match', {
  matchId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  gameMode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gameDuration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gameCreation: {
    type: DataTypes.DATE,
    allowNull: false
  },
  matchData: {
    type: DataTypes.JSON,
    allowNull: false
  }
});

const MatchParticipant = sequelize.define('MatchParticipant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  puuid: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Accounts',
      key: 'puuid'
    }
  },
  matchId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Matches',
      key: 'matchId'
    }
  },
  championId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  kills: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  deaths: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  assists: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  win: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
});

Match.hasMany(MatchParticipant, { foreignKey: 'matchId' });
MatchParticipant.belongsTo(Match, { foreignKey: 'matchId' });

module.exports = { Match, MatchParticipant };
