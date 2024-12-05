require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const sequelize = require('./config/database');
const { Account, Match, MatchParticipant } = require('./models');
const auth = require('./middleware/auth');
const { Op } = require('sequelize');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.RIOT_API_KEY;
const baseUrl = "https://americas.api.riotgames.com";
const regionUrl = "https://na1.api.riotgames.com";

// Leaderboard endpoint
// app.get('/api/leaderboard', async (req, res) => {
//   try {
//     console.log('Fetching challenger league data...');
//     const response = await axios.get(
//       `${regionUrl}/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5`,
//       {
//         headers: {
//           "X-Riot-Token": API_KEY,
//           "Accept-Language": "en-US,en;q=0.9",
//           "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
//           "Origin": "https://developer.riotgames.com"
//         }
//       }
//     );

//     if (!response.data || !response.data.entries) {
//       console.error('Invalid response format:', response.data);
//       return res.status(500).json({ error: 'Invalid response from Riot API' });
//     }

//     console.log('Received challenger data with entries:', response.data.entries.length);

//     const topPlayers = response.data.entries
//       .sort((a, b) => b.leaguePoints - a.leaguePoints)
//       .slice(0, 100)
//       .map((entry, index) => {
//         console.log('Processing entry:', entry);
//         return {
//           rank: index + 1,
//           summonerName: entry.summonerName,
//           leaguePoints: entry.leaguePoints,
//           wins: entry.wins,
//           losses: entry.losses,
//           winRate: ((entry.wins / (entry.wins + entry.losses)) * 100).toFixed(1)
//         };
//       });

//     console.log('Sending processed data:', topPlayers.slice(0, 3)); // Log first 3 entries
//     res.json(topPlayers);
//   } catch (error) {
//     console.error("Error fetching leaderboard:", {
//       message: error.message,
//       response: error.response?.data,
//       status: error.response?.status
//     });
//     res.status(500).json({ 
//       error: 'Error fetching leaderboard data',
//       details: error.response?.data || error.message
//     });
//   }
// });


async function fetchPuuidWithSummonerId(summonerId) {
  try {
    const response = await axios.get(
      `${regionUrl}/lol/summoner/v4/summoners/${summonerId}?api_key=${API_KEY}`
    )

    return response.data.puuid
  } catch (err) {
    console.error("could not fetch PUUID", err)
    throw err
  }
}

async function fetchGameNameAndTaglineWithPuuid(puuid) {
  try {
    const accountPuuid = await axios.get(
      `${baseUrl}/riot/account/v1/accounts/by-puuid/${puuid}?api_key=${API_KEY}`
    )

    const result = {
      gameName: accountPuuid.data.gameName,
      tagLine: accountPuuid.data.tagLine
    }

    return result
  } catch (err) {
    console.error("Could not get Game Name and Tagline", err)
    throw err
  }
}

app.get('/api/getGameNameAndTagline/:summonerId', async (req, res) => {
  const summonerId = req.params.summonerId;
  try {
    const summonerData = await fetchPuuidWithSummonerId(summonerId);
    const accountName = await fetchGameNameAndTaglineWithPuuid(summonerData);
    return res.json(accountName);
  } catch (err) {
    console.error("Could not get PUUID", err);
    const statusCode = err.response?.status || 500;
    return res.status(statusCode).json({ error: err.message || "Internal Server Error" });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    console.log('Fetching Leaderboard Data...');

    const response = await axios.get(
      `${regionUrl}/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5`,
      {
        headers: {
          "X-Riot-Token": API_KEY,
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
          "Origin": "https://developer.riotgames.com"
        }
      }
    );

    const challengers = response.data.entries
    .sort((a, b) => b.leaguePoints - a.leaguePoints)
    .slice(0, 100);

    const enrichedChallengers = await Promise.all(
      challengers.map(async (entry, index) => {
        const summonerData = await fetchPuuidWithSummonerId(entry.summonerId)
        const accountData = await fetchGameNameAndTaglineWithPuuid(summonerData)

        return {
          rank: index + 1,
          summonerId: entry.summonerId,
          gameName: accountData.gameName,
          tagLine: accountData.tagLine,
          lp: entry.leaguePoints,
          wins: entry.wins,
          losses: entry.losses,
          winrate: (entry.wins / (entry.wins + entry.losses) * 100).toFixed(0)
        }
      })
    )
  //   .map((entry, index) => {
  //     console.log("Entry: ", entry);
  //     return {
  //       rank: index + 1,
  //       summonerId: entry.summonerId,
  //       lp: entry.leaguePoints,
  //       wins: entry.wins,
  //       losses: entry.losses,
  //       winrate: (entry.wins / (entry.wins + entry.losses) * 100).toFixed(0)
  //     }
  //   })

  //   res.json(challengers)
  } catch(err) {
    console.error('Error Fetching leaderboard data', err);
  }
})


app.post('/api/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    let user = await Account.findOne({ 
      where: {
        [Op.or]: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await Account.create({
      username,
      email,
      password: hashedPassword
    });

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/api/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await Account.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/user', auth, async (req, res) => {
  try {
    const user = await Account.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

async function fetchRiotAccount(gameName, tagLine) {
  try {
    const response = await axios.get(
      `${baseUrl}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
      {
        params: { api_key: API_KEY },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Riot account:", error.message);
    throw error;
  }
}

async function getMatchHistoryWithPuuid(puuid, start = 0, count = 5) {
  try {
    const response = await axios.get(
      `${baseUrl}/lol/match/v5/matches/by-puuid/${puuid}/ids`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9,ja;q=0.8",
          "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
          Origin: "https://developer.riotgames.com",
          "X-Riot-Token": API_KEY,
        },
        params: {
          start: start,
          count: count
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching the match history:", error.message);
    throw error;
  }
}

async function getMatchStats(matchId) {
  try {
    // Check if match exists in database
    const existingMatch = await Match.findByPk(matchId);
    if (existingMatch) {
      console.log("Returning cached match data for:", matchId);
      return existingMatch.matchData;
    }

    console.log("Fetching new match data for:", matchId);
    const response = await axios.get(
      `${baseUrl}/lol/match/v5/matches/${matchId}`,
      {
        headers: {
          "X-Riot-Token": API_KEY
        }
      }
    );

    const matchData = response.data;
    
    try {
      // Store match data in database
      await Match.create({
        matchId: matchId,
        gameMode: matchData.info.gameMode,
        gameDuration: matchData.info.gameDuration,
        gameCreation: new Date(matchData.info.gameCreation),
        matchData: matchData
      });

      // Store participant data
      for (const participant of matchData.info.participants) {
        await MatchParticipant.create({
          puuid: participant.puuid,
          matchId: matchId,
          championId: participant.championId,
          kills: participant.kills,
          deaths: participant.deaths,
          assists: participant.assists,
          win: participant.win
        });
      }
    } catch (dbError) {
      console.error("Error storing match data:", dbError);
      // Even if storage fails, return the match data
    }

    return matchData;
  } catch (error) {
    console.error("Error in getMatchStats:", error.response?.status, error.response?.data);
    if (error.response?.status === 404) {
      throw new Error("Match not found");
    }
    throw new Error(error.response?.data?.status?.message || error.message);
  }
}

app.post("/api/account/link", auth, async (req, res) => {
  try {
    const { gameName, tagLine } = req.body;
    
    const riotData = await fetchRiotAccount(gameName, tagLine);
    
    await Account.update({
      puuid: riotData.puuid,
      gameName: riotData.gameName,
      tagLine: riotData.tagLine,
      lastUpdated: new Date()
    }, {
      where: { id: req.user.id }
    });

    res.json(riotData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Sorry, an error occurred while linking the account");
  }
});

app.get("/api/account/:gameName/:tagLine", async (req, res) => {
  try {
    const { gameName, tagLine } = req.params;
    
    const existingAccount = await Account.findOne({
      where: {
        gameName: gameName,
        tagLine: tagLine
      }
    });

    if (existingAccount && 
        (new Date() - new Date(existingAccount.lastUpdated)) < 3600000) {
      return res.json({
        puuid: existingAccount.puuid,
        gameName: existingAccount.gameName,
        tagLine: existingAccount.tagLine
      });
    }

    const data = await fetchRiotAccount(gameName, tagLine);
    
    await Account.upsert({
      puuid: data.puuid,
      gameName: data.gameName,
      tagLine: data.tagLine,
      lastUpdated: new Date()
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Sorry, an error occurred while fetching the data");
  }
});

app.get("/api/matches/:puuid", async (req, res) => {
  try {
    const puuid = req.params.puuid;
    const start = parseInt(req.query.start) || 0;
    const count = parseInt(req.query.count) || 5;
    const matchHistory = await getMatchHistoryWithPuuid(puuid, start, count);
    res.json(matchHistory);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching match history");
  }
});

app.get(`/api/match/matchStats/:matchId`, async (req, res) => {
  try {
    const matchId = req.params.matchId;
    const matchStats = await getMatchStats(matchId);
    res.json(matchStats); 
  } catch (error) {
    console.error("Error in match stats endpoint:", error);
    res.status(500).json({ message: error.message });
  }
});

// Database initialization and server start
(async () => {
  try {
    await sequelize.sync({ force: false }); // Changed to false to preserve data
    console.log('Database synchronized successfully');
    
    app.listen(8080, () => {
      console.log("Server is running on localhost 8080");
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
