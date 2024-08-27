import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMnemonic } from 'bip39';
import './CreateAccountSolana.css';

const CreateAccountSolana = () => {
  const [mnemonic, setMnemonic] = useState('');
  const navigate = useNavigate();

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
  };

  const handleContinue = () => {
    navigate('/solana-wallet', { state: { mnemonic } });
  };

  const handleBack = () => {
    navigate('/choose-network');
  };

  return (
    <div className="create-account-page">
      <button className="btn-back" onClick={handleBack}>Back</button>
      <div className="container">
        <h1 className="title">Create Solana Account</h1>
        <button className="btn-generate" onClick={handleGenerateMnemonic}>
          Generate Mnemonic
        </button>
        {mnemonic && (
          <div className="mnemonic-section">
            <h2 className="subtitle">Mnemonic Phrase</h2>
            <p className="mnemonic">{mnemonic}</p>
            <button className="btn-continue" onClick={handleContinue}>
              Continue to Solana Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAccountSolana;
