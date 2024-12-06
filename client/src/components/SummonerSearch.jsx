import { useState } from 'react';

function SummonerSearch() {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = async (id) => {
    if (!id.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      const response = await fetch(`http://localhost:8080/api/getGameNameAndTagline/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch summoner data');
      }
      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      setError('Failed to find summoner. Please check the ID and try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await performSearch(searchId);
  };

  // Export the search function for external use
  window.searchSummoner = performSearch;

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch} className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Summoner ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            'Search'
          )}
        </button>
      </form>

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}

      {searchResult && (
        <div className="alert alert-success mt-3" role="alert">
          Found: {searchResult.gameName}#{searchResult.tagLine}
        </div>
      )}
    </div>
  );
}

export default SummonerSearch;
