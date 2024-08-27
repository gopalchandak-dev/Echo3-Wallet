import React, { useState } from 'react';
import { Wallet, HDNodeWallet } from "ethers";
import { mnemonicToSeed } from "bip39";
import './RecoveryPage.css';

const RecoveryPage = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [recoveredWallet, setRecoveredWallet] = useState(null);
  const [error, setError] = useState('');

  const handleRecoverEthereumWallet = async () => {
    if (!seedPhrase.trim()) {
      setError('Please enter a valid seed phrase.');
      setRecoveredWallet(null);
      return;
    }

    setError('');
    try {
      const seed = await mnemonicToSeed(seedPhrase);
      const derivationPath = `m/44'/60'/0'/0/0`; // Use the exact path used when the account was created
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const wallet = new Wallet(child.privateKey);

      setRecoveredWallet({
        address: wallet.address,
        privateKey: wallet.privateKey,
      });
    } catch (err) {
      setError('Error recovering Ethereum wallet. Please check your seed phrase.');
      setRecoveredWallet(null);
      console.error(err);
    }
  };

  return (
    <div className="recovery-page-container">
      <h1>Recover Ethereum Account</h1>
      <input
        type="text"
        placeholder="Enter seed phrase"
        value={seedPhrase}
        onChange={(e) => setSeedPhrase(e.target.value)}
        className="form-control"
      />
      <button className="btn-primary" onClick={handleRecoverEthereumWallet}>
        Recover Wallet
      </button>
      {error && <p className="error-message">{error}</p>}
      {recoveredWallet && (
        <div className="wallet-details">
          <p>Address: {recoveredWallet.address}</p>
          <p>Private Key: {recoveredWallet.privateKey}</p>
        </div>
      )}
    </div>
  );
};

export default RecoveryPage;
