import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppRoutes from './Routes';
import { WalletProvider } from './Components/ETH/WalletContext'; // Import WalletProvider

ReactDOM.render(
  <React.StrictMode>
    <WalletProvider> {/* Wrap AppRoutes with WalletProvider */}
      <AppRoutes />
    </WalletProvider>
  </React.StrictMode>,
  document.getElementById('root')
);