// MainApp.jsx
import React from 'react';
import { WalletProvider } from './Components/ETH/WalletContext'; // Import the WalletProvider
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import ChooseNetwork from './Components/ChooseNetwork';
import RecoveryPage from './Components/RecoveryPage';
import CreateAccountEthereum from './Components/ETH/CreateAccountEthereum';
import EthereumWalletPage from './Components/EthereumWalletPage';
import CreateAccountSolana from './Components/SOl/CreateAccountSolana'; // Import the new component
import SolanaWalletPage from './Components/SolanaWalletPage'; 


const MainApp = () => {
  return (
    <WalletProvider> {/* Wrap your application with the WalletProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/choose-network" element={<ChooseNetwork />} />
          <Route path="/recover-account" element={<RecoveryPage />} />
          <Route path="/create-account-ethereum" element={<CreateAccountEthereum />} />
          <Route path="/ethereum-wallet" element={<EthereumWalletPage />} />
          <Route path="/create-account-solana" element={<CreateAccountSolana />} /> {/* New Route */}
          <Route path="/solana-wallet" element={<SolanaWalletPage />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
};

export default MainApp;
