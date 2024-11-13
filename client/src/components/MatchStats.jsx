import axios from "axios";
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

function MatchStats({ initialMatchId }) {
  const [matchData, setMatchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      if (!initialMatchId) return;
      
      setIsLoading(true);
      setError(null);
      setMatchData(null);

      try {
        const response = await axios.get(
          `http://localhost:8080/api/match/matchStats/${initialMatchId}`
        );
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

    fetchMatchData();
  }, [initialMatchId]);

  const renderMatchData = () => {
    if (!matchData) return null;
    try {
      // Calculate total damage for each team
      const team1Damage = matchData.info.participants
        .filter(p => p.teamId === 100)
        .reduce((sum, p) => sum + p.totalDamageDealtToChampions, 0);
      
      const team2Damage = matchData.info.participants
        .filter(p => p.teamId === 200)
        .reduce((sum, p) => sum + p.totalDamageDealtToChampions, 0);

      return (
        <div className="border p-3">
          <h3>Match Details</h3>
          <div className="mb-3">
            <p><strong>Match ID:</strong> {matchData.metadata.matchId}</p>
            <p><strong>Game Mode:</strong> {matchData.info.gameMode}</p>
            <p><strong>Game Duration:</strong> {Math.floor(matchData.info.gameDuration / 60)}m {matchData.info.gameDuration % 60}s</p>
          </div>
          
          <h4>Players:</h4>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>Champion</th>
                  <th>Result</th>
                  <th>KDA</th>
                  <th>Damage Dealt</th>
                  <th>Damage Share</th>
                  <th>Damage Taken</th>
                  <th>CS</th>
                  <th>Gold</th>
                </tr>
              </thead>
              <tbody>
                {matchData.info.participants.map((participant, index) => {
                  const teamTotalDamage = participant.teamId === 100 ? team1Damage : team2Damage;
                  const damagePercentage = (participant.totalDamageDealtToChampions / teamTotalDamage) * 100;
                  
                  return (
                    <tr key={index} className={participant.win ? 'table-success' : 'table-danger'}>
                      <td>{participant.riotIdGameName || participant.summonerName}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img 
                            src={`http://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${participant.championName}.png`}
                            alt={participant.championName}
                            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                          />
                          {participant.championName}
                        </div>
                      </td>
                      <td>{participant.win ? 'Victory' : 'Defeat'}</td>
                      <td>{participant.kills}/{participant.deaths}/{participant.assists}</td>
                      <td>{participant.totalDamageDealtToChampions.toLocaleString()}</td>
                      <td style={{ minWidth: '150px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ 
                            width: '100px', 
                            height: '20px', 
                            backgroundColor: '#e9ecef',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${damagePercentage}%`,
                              height: '100%',
                              backgroundColor: participant.win ? '#28a745' : '#dc3545',
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                          <span style={{ fontSize: '0.875rem' }}>
                            {damagePercentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td>{participant.totalDamageTaken.toLocaleString()}</td>
                      <td>{participant.totalMinionsKilled + participant.neutralMinionsKilled}</td>
                      <td>{participant.goldEarned.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    } catch (e) {
      console.error("Error rendering match data:", e);
      return <p>Error rendering match data. Please check console for details.</p>;
    }
  };

  return (
    <div>
      {isLoading && <p>Loading match details...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {renderMatchData()}
    </div>
  );
}

MatchStats.propTypes = {
  initialMatchId: PropTypes.string
};

export default MatchStats;
