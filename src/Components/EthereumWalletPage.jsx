/**
 * Main page for generating Ethereum wallets and managing private keys.
 * 
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, HDNodeWallet } from 'ethers';
import { mnemonicToSeed } from 'bip39';
import { useWallet } from './ETH/WalletContext';
import EthereumWalletBalance from './ETH/EthereumWalletBalance';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EthereumWalletPage.css';

const EthereumWalletPage = () => {
  const navigate = useNavigate();
  const { ethereumMnemonic } = useWallet();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState('sepolia');
  const [wallets, setWallets] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!ethereumMnemonic) {
      navigate('/create-account-ethereum');
    } else if (wallets.length === 0) {
      handleAddWallet();
    }
  }, [ethereumMnemonic, navigate, wallets]);

  const handleAddWallet = async () => {
    if (!ethereumMnemonic) {
      console.error('Mnemonic is not available.');
      return;
    }

    try {
      const seed = await mnemonicToSeed(ethereumMnemonic);
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);

      setWallets([...wallets, { address: wallet.address, privateKey }]);
      setCurrentIndex(currentIndex + 1);
      setSelectedAccountIndex(wallets.length);
    } catch (error) {
      console.error('Error generating Ethereum wallet:', error);
    }
  };

  const handleSelectAccount = (index) => {
    setSelectedAccountIndex(index);
    setShowModal(false);
  };

  const handleNetworkChange = (e) => {
    setSelectedNetwork(e.target.value);
  };

  const handleBackToHome = () => {
    navigate('/choose-network');
  };

  const selectedWallet = wallets[selectedAccountIndex] || {};

  return (
    <div className="Eth-Wallet">
      <div className="back-button-container">
        <button className="btn-back" onClick={handleBackToHome}>
          Back
        </button>
      </div>

      <div className="ethereum-wallet-page">
        <h1>Echo3 Ethereum Wallet</h1>
        <Button variant="primary" onClick={handleAddWallet}>
          Create Ethereum Wallet
        </Button>

        <div className="account-network-container">
          <div className="account-selection">
            <h2>Select Account</h2>
            <div className="dropdown-container">
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
          </div>

          <div className="network-selection">
            <h2 htmlFor="network-select">Select Network</h2>
            <select
              id="network-select"
              value={selectedNetwork}
              onChange={handleNetworkChange}
              className="form-control"
            >
              <option value="mainnet">Ethereum Mainnet</option>
              <option value="sepolia">Ethereum Sepolia</option>
            </select>
          </div>
        </div>

        {selectedAccountIndex !== null && (
          <>
            <div className="account-details">
              <h2>Account Details</h2>
              <div className="wallet-address">
                Address: {selectedWallet.address}
              </div>
              <Button variant="info" onClick={() => setShowModal(true)}>
                Show Private Key
              </Button>
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Private Key</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <pre>{selectedWallet.privateKey}</pre>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

                        
              <h2>Wallet Balance</h2>
              <EthereumWalletBalance selectedWallet={selectedWallet} selectedNetwork={selectedNetwork} />
            </div>
            
          </>
        )}
      </div>
    </div>
  );
};

export default EthereumWalletPage;
