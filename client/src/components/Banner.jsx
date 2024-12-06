import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function Banner({ theme, onToggleTheme }) {
  return (
    <div className="banner">
      <div className="list-group list-group-horizontal">
        <Link to="/" className="list-group-item list-group-item-action list-group-item-primary">Home</Link>
        <Link to="/leaderboard" className="list-group-item list-group-item-action list-group-item-primary">Leaderboard</Link>
      </div>
      <button 
        className="theme-toggle" 
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
}

Banner.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  onToggleTheme: PropTypes.func.isRequired
};

export default Banner;
