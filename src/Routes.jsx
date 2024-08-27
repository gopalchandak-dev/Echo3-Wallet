// routes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import ChooseNetwork from './Components/ChooseNetwork';
import RecoveryPage from './Components/RecoveryPage';
import CreateAccountEthereum from './Components/ETH/CreateAccountEthereum'; // Ensure this is imported
import EthereumWalletPage from './Components/EthereumWalletPage'; // Ensure this is imported
import CreateAccountSolana from './Components/SOL/CreateAccountSolana'; // Import the new component
import SolanaWalletPage from './Components/SolanaWalletPage'; 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/choose-network" element={<ChooseNetwork />} />
        <Route path="/recover-account" element={<RecoveryPage />} />
        <Route path="/create-account-ethereum" element={<CreateAccountEthereum />} /> {/* Correct route */}
        <Route path="/ethereum-wallet" element={<EthereumWalletPage />} />
        <Route path="/create-account-solana" element={<CreateAccountSolana />} /> {/* New Route */}
        <Route path="/solana-wallet" element={<SolanaWalletPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
