// WalletContext.jsx
import React, { createContext, useState, useContext } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [ethereumMnemonic, setEthereumMnemonic] = useState('');

  return (
    <WalletContext.Provider value={{ ethereumMnemonic, setEthereumMnemonic }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
