const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());

// Move the API key to an environment variable or config file in a real application
const API_KEY = "RGAPI-523c9793-a7cb-4965-aa2e-3e3b830119e7";
const baseUrl = "https://americas.api.riotgames.com";

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
      `${baseUrl}/lol/match/v5/matches/by-puuid/${puuid}/ids?${start}&${count}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9,ja;q=0.8",
          "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
          "Origin": "https://developer.riotgames.com",
          "X-Riot-Token": API_KEY
        },
        params: {
          puuid: puuid,
          start: start,
          count: count
        }
      }
    )
    return response.data;
  } catch(error) {
    console.error("Error fetching the match history:", error.message)
    throw error;
  }
}


app.get("/api/account/:gameName/:tagLine", async (req, res) => {
  try {
    const { gameName, tagLine } = req.params;
    const data = await fetchRiotAccount(gameName, tagLine);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Sorry, an error occurred while fetching the data");
  }
});

app.get("/api/matches/:puuid", async (req, res) => {
  try {
    const puuid = req.params.puuid;
    const matchHistory = await getMatchHistoryWithPuuid(puuid);
    res.json(matchHistory);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching match history");
  }
});

app.get("/test-match-history", async (req, res) => {
  try {
    const testPuuid =
      "Onpn7wFKYeXQYBW8SXsW_I8-0o6nYG9Jdk_BfC2cvuEA8yrYl6nDmzqILfyaWeHrIH9ZkXgbTSg9Nw";
    const matchHistory = await getMatchHistoryWithPuuid(testPuuid);
    res.json(matchHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
      details: err.response ? err.response.data : null,
    });
  }
});

app.listen(8080, () => {
  console.log("Server is running on localhost 8080");
});
