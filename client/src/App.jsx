import { useState } from "react";
import AccountMatchHistory from "./components/AccountMatchHistory";
import RiotAccount from "./components/RiotAccount";


function App() {
  const [puuid, setPuuid] = useState(null);



  return (
    <>
      <div className="container text-center">
        <RiotAccount setPuuid={setPuuid}/>
        <AccountMatchHistory puuid={puuid}/>
      </div>
    </>
  );
}

export default App;
