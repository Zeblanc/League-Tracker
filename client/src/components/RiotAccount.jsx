import { useState } from 'react';
import axios from 'axios';

// Initial state: isLoading is false, error is null, accountData is null.
// User initiates a request: set isLoading to true, error to null, accountData to null.
// Request succeeds: set isLoading to false, keep error as null, set accountData to the fetched data.
// Request fails: set isLoading to false, set error to the error message, keep accountData as null.

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
    
    // displays loading when fetching data has started
    setIsLoading(true);
    // clears any previous errors 
    setError(null);
    // clears any previous account data
    setAccountData(null);

    try {
      const response = await axios.get(`http://localhost:8080/api/account/${gameName}/${tagLine}`);
      setAccountData(response.data);
      setPuuid(response.data.puuid);
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
      <button className='btn btn-primary' onClick={fetchAccountData} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Look up Account'}
      </button>
      {/* if error is true then render */}
      {error && <div style={{color: 'red'}}>{error}</div>}

      {/* if we have the account data then render  */}
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