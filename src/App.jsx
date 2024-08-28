import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const App = () => {
  const navigate = useNavigate();

  const handleChooseNetwork = () => {
    navigate('/choose-network');
  };

  const handleRecoverAccount = () => {
    navigate('/recover-account');
  };

  return (
      <div className="welcome-section">
        <h1 className="title">ECHO3 Wallet</h1>

        <h1 className="tagline">The Future of Crypto, Today</h1>
        <div className="option-buttons">
          <button className="btn-primary" onClick={handleChooseNetwork}>
            Welcome
          </button>
          {/* <button className="btn btn-secondary" onClick={handleRecoverAccount}>
            Recover Account
          </button> */}
        </div>
      </div>
    
  );
};

export default App;