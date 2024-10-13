import { Link } from 'react-router-dom';


function Banner() {
  return (
    <div className="list-group list-group-horizontal">
      <Link to="/" className="list-group-item list-group-item-action list-group-item-primary">Home</Link>
      <Link to="/leaderboards" className="list-group-item list-group-item-action list-group-item-primary">Leaderboards</Link>
      <Link to="/login" className="list-group-item list-group-item-action list-group-item-primary">Login</Link>
      <Link to="/account" className="list-group-item list-group-item-action list-group-item-primary">Search</Link>
    </div>
  )
}


export default Banner;