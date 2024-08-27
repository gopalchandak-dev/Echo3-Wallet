import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './EthereumWalletBalance.css';

const EthereumWalletBalance = ({ selectedWallet, selectedNetwork }) => {
  const [balance, setBalance] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [sendStatus, setSendStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchBalance = async () => {
      if (selectedWallet && selectedWallet.address) {
        const providerUrl = selectedNetwork === 'mainnet'
          ? import.meta.env.VITE_ETHEREUM_MAINNET_URL
          : import.meta.env.VITE_ETHEREUM_SEPOLIA_URL;

        if (!providerUrl) {
          console.error('Provider URL is not defined');
          return;
        }

        const provider = new ethers.JsonRpcProvider(providerUrl);
        try {
          const bal = await provider.getBalance(selectedWallet.address);
          setBalance(ethers.formatEther(bal));
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance('Error');
        }
      }
    };

    fetchBalance();
  }, [selectedWallet, selectedNetwork]);

  const handleSend = async () => {
    if (!recipient || !amount) {
      setSendStatus('Please fill in all fields.');
      return;
    }

    const providerUrl = selectedNetwork === 'mainnet'
      ? import.meta.env.VITE_ETHEREUM_MAINNET_URL
      : import.meta.env.VITE_ETHEREUM_SEPOLIA_URL;

    if (!providerUrl) {
      setSendStatus('Provider URL is not defined');
      return;
    }

    const provider = new ethers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(selectedWallet.privateKey, provider);
    const transaction = {
      to: recipient,
      value: ethers.parseEther(amount),
    };

    try {
      setIsLoading(true);
      const txResponse = await wallet.sendTransaction(transaction);
      await txResponse.wait();
      setSendStatus('Transaction sent successfully!');
      // Refresh balance
      const bal = await provider.getBalance(selectedWallet.address);
      setBalance(ethers.formatEther(bal));
    } catch (error) {
      console.error('Transaction failed:', error);
      setSendStatus(`Transaction failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wallet-balance-container">
      <div className="balance-section">
        <h3>Wallet Balance</h3>
        {balance !== null ? (
          <p className="balance-amount">{balance} ETH</p>
        ) : (
          <p>Loading balance...</p>
        )}
      </div>
      <div className="send-section">
        <h3>Send ETH</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="send-form">
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            step="0.0001"
            min="0"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
        {sendStatus && <p className="send-status">{sendStatus}</p>}
      </div>
    </div>
  );
};

export default EthereumWalletBalance;
