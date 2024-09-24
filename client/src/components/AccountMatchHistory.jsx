// AccountMatchHistory.js
import { useState, useEffect } from 'react';
import axios from 'axios';

function AccountMatchHistory({ puuid }) {
  const [matchHistory, setMatchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:8080/api/matches/${puuid}`);
        setMatchHistory(response.data);
      } catch (e) {
        setError("Could not fetch match history");
        console.error("There was a problem fetching the match history:", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (puuid) {
      fetchMatchHistory();
    }
  }, [puuid]);

  return (
    <div>
      <h2>Match History for Puuid: {puuid}</h2>
      {isLoading && <p>Loading match history...</p>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {matchHistory.length > 0 ? (
        <ul>
          {matchHistory.map((matchId) => (
            <li key={matchId}>{matchId}</li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>No match history available.</p>
      )}
    </div>
  );
}

export default AccountMatchHistory;
