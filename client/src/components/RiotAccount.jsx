import { useState } from 'react';

function RiotAccount({ setPuuid }) {
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [accountData, setAccountData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccountData = async () => {
    if (!gameName || !tagLine) {
      setError("Please enter both Game Name and Tag Line");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAccountData(null);

    try {
      const response = await fetch(`http://localhost:8080/api/account/${gameName}/${tagLine}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAccountData(data);
      setPuuid(data.puuid)
    } catch (e) {
      setError("Could not fetch account data");
      console.error("There was a problem fetching the account data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Riot Account Lookup</h1>
      <div>
        <input 
          type="text" 
          value={gameName} 
          onChange={(e) => setGameName(e.target.value)}
          placeholder="Enter Game Name"
        />
      </div>
      <div>
        <input 
          type="text" 
          value={tagLine} 
          onChange={(e) => setTagLine(e.target.value)}
          placeholder="Enter Tag Line"
        />
      </div>
      <button onClick={fetchAccountData} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Look up Account'}
      </button>

      {error && <div style={{color: 'red'}}>{error}</div>}

      {accountData && (
        <div>
          <h2>Account Data:</h2>
          <p>Puuid: {accountData.puuid}</p>
          <p>Game Name: {accountData.gameName}</p>
          <p>Tag Line: {accountData.tagLine}</p>
        </div>
      )}
    </div>
  );
}

export default RiotAccount;