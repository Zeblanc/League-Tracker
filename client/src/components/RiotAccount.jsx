import { useState } from 'react';
import PropTypes from 'prop-types';

function RiotAccount({ onAccountLink }) {
  const [formData, setFormData] = useState({
    gameName: '',
    tagLine: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    onAccountLink(formData.gameName, formData.tagLine);
  };

  return (
    <div className="riot-account-container">
      <h2>Link your Riot Account</h2>
      <p>Link your Riot account to track your match history</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Game Name"
            value={formData.gameName}
            onChange={(e) => setFormData({...formData, gameName: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Tag Line (e.g., NA1)"
            value={formData.tagLine}
            onChange={(e) => setFormData({...formData, tagLine: e.target.value})}
            required
          />
        </div>
        <button type="submit">Link Account</button>
      </form>
    </div>
  );
}

RiotAccount.propTypes = {
  onAccountLink: PropTypes.func.isRequired
};

export default RiotAccount;
