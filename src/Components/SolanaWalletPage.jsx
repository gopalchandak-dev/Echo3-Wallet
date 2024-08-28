/**
 * Main page for generating Solana wallets and managing private keys.
 */

import React,{ useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Keypair } from '@solana/web3.js';
import { mnemonicToSeed } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import SolanaWalletBalance from './SOL/SolanaWalletBalance';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SolanaWalletPage.css';

const SolanaWalletPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [wallets, setWallets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(wallets.length);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [network, setNetwork] = useState('mainnet-beta');
  const [mnemonic, setMnemonic] = useState('');

  useEffect(() => {
    if (location.state && location.state.mnemonic) {
      setMnemonic(location.state.mnemonic);
    } else {
      console.error('Mnemonic is not provided.');
      navigate('/create-account'); 
    }
  }, [location.state, navigate]);

  const handleAddWallet = async () => {
    if (!mnemonic) {
      console.error('Mnemonic is not provided');
      alert('Mnemonic is not provided. Please ensure you have generated a seed phrase.');
      return;
    }

    try {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString('hex')).key;
      const keypair = Keypair.fromSecretKey(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey);

      const newWallet = {
        publicKey: keypair.publicKey.toBase58(),
        mnemonic: mnemonic,
        secretKey: Array.from(keypair.secretKey)
      };

      const updatedWallets = [...wallets, newWallet];
      setWallets(updatedWallets);
      setSelectedAccountIndex(updatedWallets.length - 1);
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Error generating Solana wallet:', error);
    }
  };

  const handleSelectAccount = (index) => {
    if (index >= 0 && index < wallets.length) {
      setSelectedAccountIndex(index);
      setShowModal(false);
    } else {
      console.error('Invalid account index');
    }
  };

  const handleNetworkChange = (event) => {
    setNetwork(event.target.value);
  };

  const selectedWallet = wallets[selectedAccountIndex] || {};

  const formatSecretKey = (secretKey) => {
    if (Array.isArray(secretKey)) {
      return secretKey.map(byte => byte.toString(16).padStart(2, '0')).join('');
    }
    return 'Invalid secret key';
  };

  const handleBackToHome = () => {
    navigate('/choose-network');
  };

  return (
    <div className="Eth-Wallet">
    <div className="back-button-container">
      <button className="btn-back" onClick={handleBackToHome}>
        Back
      </button>
    </div>
    <div className='solana-wallet-page'>
      

      <h1>Echo3 Solana Wallet</h1>
      
      <button className="btn-primary" onClick={handleAddWallet}>
        Create Solana Wallet
      </button>

      <div className="account-network-container">
        <div className="select-account-container">
          <h2>Select Account</h2>
          <select
            id="account-select"
            value={selectedAccountIndex !== null ? selectedAccountIndex : ""}
            onChange={(e) => handleSelectAccount(parseInt(e.target.value, 10))}
            className="form-control"
          >
            <option value="" disabled>Select an account</option>
            {wallets.map((wallet, index) => (
              <option key={index} value={index}>
                Account {index + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="select-network-container">
          <h2>Select Network</h2>
          <select
            id="network-select"
            value={network}
            onChange={handleNetworkChange}
            className="form-control"
          >
            <option value="mainnet-beta">Solana Mainnet</option>
            <option value="devnet">Solana Devnet</option>
          </select>
        </div>
      </div>

      {selectedAccountIndex !== null && (
        <div className="wallet-details-container">
          <h2>Account Details</h2>
          <div className="wallet-public-key">
            Public Key: {selectedWallet.publicKey}
          </div>
          <Button variant="info" onClick={() => setShowModal(true)}>
            Show Private Key
          </Button>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Private Key</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <pre>{formatSecretKey(selectedWallet.secretKey)}</pre>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          <h2>Wallet Balance</h2>
        {selectedAccountIndex !== null && (
          <SolanaWalletBalance
            publicKey={selectedWallet.publicKey}
            secretKey={selectedWallet.secretKey}
            network={network}
          />
        )}
        </div>
      )}
        
      </div>
    </div>
    
  );
};

export default SolanaWalletPage;
