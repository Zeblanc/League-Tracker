import axios from "axios";
import { useState, useEffect } from "react";

function MatchStats() {
  const [matchId, setMatchId] = useState("");
  const [matchData, setMatchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Current state:", { matchId, matchData, isLoading, error });
  }, [matchId, matchData, isLoading, error]);

  const displayMatchStats = async () => {
    if (!matchId.trim()) {
      setError("Please enter a valid Match ID");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMatchData(null);

    try {
      console.log("Fetching data for matchId:", matchId);
      const response = await axios.get(
        `http://localhost:8080/api/match/matchStats/${matchId}`
      );
      console.log("API response:", response.data);
      setMatchData(response.data);
    } catch (e) {
      console.error("Error fetching match data:", e);
      setError(
        "Could not get Match Information: " +
          (e.response?.data?.message || e.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderMatchData = () => {
    if (!matchData) return null;
    try {
      return (
        <div className="border">
          <p>
            <strong>Match ID:</strong> {matchData.metadata.matchId}
          </p>
          <p>
            <strong>Game Mode:</strong> {matchData.info.gameMode}
          </p>
          <p>
            <strong>Game Duration:</strong>{" "}
            {Math.floor(matchData.info.gameDuration / 60)}m{" "}
            {matchData.info.gameDuration % 60}s
          </p>
          <h2>Players:</h2>
          <ul className="list-group ">
            {matchData.info.participants.map((participant, index) => (
              <li className="list-group-item list-group-item-light" key={index}>
                {participant.riotIdGameName}
              </li>
            ))}
          </ul>
        </div>
      );
    } catch (e) {
      console.error("Error rendering match data:", e);
      return (
        <p>Error rendering match data. Please check console for details.</p>
      );
    }
  };

  return (
    <div>
      <h1>MatchStats</h1>
      <div>
        <input
          type="text"
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
          placeholder="Enter Match ID"
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={displayMatchStats}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Get Match Stats"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {renderMatchData()}
    </div>
  );
}

export default MatchStats;
