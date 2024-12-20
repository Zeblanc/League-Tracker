import { useState, useEffect } from 'react';
import SummonerSearch from '../components/SummonerSearch';

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        console.log('Fetching leaderboard data...');
        const response = await fetch('http://localhost:8080/api/leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data = await response.json();
        console.log('Received leaderboard data:', data);
        setLeaderboardData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleSummonerClick = (summonerId) => {
    if (window.searchSummoner) {
      window.searchSummoner(summonerId);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!leaderboardData || leaderboardData.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info" role="alert">
          No leaderboard data available
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Challenger Leaderboard</h2>
      
      <SummonerSearch />
      
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Summoner ID</th>
              <th scope="col">LP</th>
              <th scope="col">Wins</th>
              <th scope="col">Losses</th>
              <th scope="col">Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((player) => (
              <tr key={player.summonerId || player.rank}>
                <td>{player.rank}</td>
                <td 
                  style={{ cursor: 'pointer', color: '#0d6efd', textDecoration: 'underline' }} 
                  onClick={() => handleSummonerClick(player.summonerId)}
                >
                  {player.summonerId}
                </td>
                <td>{player.lp}</td>
                <td>{player.wins}</td>
                <td>{player.losses}</td>
                <td>{player.winrate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
