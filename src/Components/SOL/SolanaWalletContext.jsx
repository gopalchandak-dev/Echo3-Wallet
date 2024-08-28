import React, { createContext, useState } from 'react';

export const SolanaWalletContext = createContext();

export const SolanaWalletProvider = ({ children }) => {
  const [wallets, setWallets] = useState([]);

  return (
    <SolanaWalletContext.Provider value={{ wallets, setWallets }}>
      {children}
    </SolanaWalletContext.Provider>
  );
};
