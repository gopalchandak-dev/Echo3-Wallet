import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMnemonic } from 'bip39';
import { useWallet } from './WalletContext';
import './CreateAccountEthereum.css';

const CreateAccountEthereum = () => {
  const [mnemonic, setMnemonic] = useState('');
  const navigate = useNavigate();
  const { setEthereumMnemonic } = useWallet();

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
    setEthereumMnemonic(newMnemonic);
  };

  const handleContinue = () => {
    navigate('/ethereum-wallet');
  };

  const handleBack = () => {
    navigate('/choose-network');
  };

  return (
      <div className="container">
        <button className="btn-back" onClick={handleBack}>
          Back 
        </button>
        <h1 className="title">Create Ethereum Account</h1>
        <button className="btn-generate" onClick={handleGenerateMnemonic}>
          Generate Mnemonic
        </button>
        {mnemonic && (
          <div className="mnemonic-section">
            <h2 className="subtitle">Mnemonic Phrase</h2>
            <p className="mnemonic">{mnemonic}</p>
            <button className="btn-continue" onClick={handleContinue}>
              Continue to Ethereum Wallet
            </button>
          </div>
        )}
      </div>
  );
};

export default CreateAccountEthereum;
