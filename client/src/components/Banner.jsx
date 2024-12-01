import { Link } from 'react-router-dom';

function Banner() {
  return (
    <div className="list-group list-group-horizontal">
      <Link to="/" className="list-group-item list-group-item-action list-group-item-primary">Home</Link>
      <Link to="/leaderboard" className="list-group-item list-group-item-action list-group-item-primary">Leaderboard</Link>
    </div>
  );
}

export default Banner;
