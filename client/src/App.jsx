import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AccountMatchHistory from "./components/AccountMatchHistory";
import RiotAccount from "./components/RiotAccount";
import Banner from "./components/Banner";
import Home from './pages/Home';
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";

function App() {
  const [puuid, setPuuid] = useState(null);

  return (
    <Router>
      <div>
        <Banner />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboards" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={
            <div className="container text-center">
              <RiotAccount setPuuid={setPuuid} />
              <AccountMatchHistory puuid={puuid} />
            </div>
          } />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;