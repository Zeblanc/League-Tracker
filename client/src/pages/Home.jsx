import { useState } from 'react';
import { LoginForm, RegisterForm } from '../components/AuthForms';

function Home() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleRegister = (newToken) => {
    setToken(newToken);
  };

  if (token) {
    return (
      <div className="container text-center">
        <h1>Welcome!</h1>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            setToken(null);
          }}
          className="btn btn-danger"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-5 m-3">
          <LoginForm onLogin={handleLogin} />
        </div>
        <div className="col-md-5 m-3">
          <RegisterForm onRegister={handleRegister} />
        </div>
      </div>
    </div>
  );
}

export default Home;
