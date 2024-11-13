import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RiotAccount from './components/RiotAccount';
import AccountMatchHistory from './components/AccountMatchHistory';
import Banner from './components/Banner';
import { LoginForm, RegisterForm } from './components/AuthForms';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/api/user', {
            headers: {
              'x-auth-token': token
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token invalid
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      }
    };

    fetchUser();
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const handleRiotAccountLink = async (gameName, tagLine) => {
    try {
      const response = await fetch('http://localhost:8080/api/account/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ gameName, tagLine })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(prevUser => ({
          ...prevUser,
          puuid: updatedUser.puuid,
          gameName: updatedUser.gameName,
          tagLine: updatedUser.tagLine
        }));
      }
    } catch (err) {
      console.error('Error linking Riot account:', err);
    }
  };

  return (
    <Router>
      <div>
        <Banner />
        {!token ? (
          <div className="auth-container">
            <div className="auth-forms">
              <LoginForm onLogin={handleLogin} />
              <RegisterForm onRegister={handleLogin} />
            </div>
          </div>
        ) : (
          <>
            <div className="user-info">
              {user && (
                <>
                  <p>Welcome, {user.username}!</p>
                  <button onClick={handleLogout}>Logout</button>
                </>
              )}
            </div>
            <Routes>
              <Route 
                path="/" 
                element={
                  user?.puuid ? (
                    <AccountMatchHistory puuid={user.puuid} />
                  ) : (
                    <RiotAccount onAccountLink={handleRiotAccountLink} />
                  )
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
