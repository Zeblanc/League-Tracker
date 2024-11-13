import { useState, useEffect } from 'react';
import axios from 'axios';
import MatchStats from './MatchStats';

function AccountMatchHistory({ puuid }) {
  const [matchHistory, setMatchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [page, setPage] = useState(0);
  const matchesPerPage = 5;

  const fetchMatchHistory = async (start) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:8080/api/matches/${puuid}?start=${start}&count=${matchesPerPage}`
      );
      
      // Append new matches to existing ones
      if (start === 0) {
        setMatchHistory(response.data);
      } else {
        setMatchHistory(prevMatches => [...prevMatches, ...response.data]);
      }
    } catch (e) {
      setError("Could not fetch match history");
      console.error("There was a problem fetching the match history:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (puuid) {
      fetchMatchHistory(0);
    }
  }, [puuid]);

  const handleMatchClick = (matchId) => {
    setSelectedMatch(matchId);
  };

  const handleSeeMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMatchHistory(nextPage * matchesPerPage);
  };

  return (
    <div className='border p-3'>
      <p><strong>Match History for Puuid: </strong>{puuid}</p> 
      <div className="row">
        <div className="col-md-4">
          {matchHistory.length > 0 ? (
            <>
              <ul className='list-group list-group-numbered'>
                {matchHistory.map((matchId) => (
                  <li 
                    className={`list-group-item ${selectedMatch === matchId ? 'active' : ''} cursor-pointer`}
                    key={matchId}
                    onClick={() => handleMatchClick(matchId)}
                    style={{ cursor: 'pointer' }}
                  >
                    {matchId}
                  </li>
                ))}
              </ul>
              <div className="text-center mt-3 mb-3">
                <button 
                  className="btn btn-primary"
                  onClick={handleSeeMore}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'See More Matches'}
                </button>
              </div>
            </>
          ) : (
            !isLoading && <p>No match history available.</p>
          )}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
        <div className="col-md-8">
          {selectedMatch && (
            <div className="match-details">
              <MatchStats initialMatchId={selectedMatch} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountMatchHistory;
