import React, { createContext, useState } from 'react';

// Create the context
export const SolanaWalletContext = createContext();

// Create a provider component
export const SolanaWalletProvider = ({ children }) => {
  const [wallets, setWallets] = useState([]);

  return (
    <SolanaWalletContext.Provider value={{ wallets, setWallets }}>
      {children}
    </SolanaWalletContext.Provider>
  );
};
