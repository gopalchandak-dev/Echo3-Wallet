/**
 * Page for selecting between Ethereum and Solana network.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChooseNetwork.css';

const ChooseNetwork = () => {
  const navigate = useNavigate();

  const handleSelectNetwork = (network) => {
    if (network === 'ethereum') {
      navigate('/create-account-ethereum');
    } else if (network === 'solana') {
      navigate('/create-account-solana');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="choose-network-page">
      <div className="back-button-container">
        <button className="btn-back" onClick={handleBackToHome}>
          Back
        </button>
      </div>
      <div className="network-container">
        <h1>Choose Your Network</h1>
        <div className="network-options">
          <button className="btn-primary" onClick={() => handleSelectNetwork('ethereum')}>
            Ethereum(ETH)
          </button>
          <button className="btn-secondary" onClick={() => handleSelectNetwork('solana')}>
            Solana(SOL)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseNetwork;
