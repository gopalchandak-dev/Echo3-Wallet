import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import './SolanaWalletBalance.css';

const SolanaWalletBalance = ({ publicKey, secretKey, network }) => {
  const [balance, setBalance] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendStatus, setSendStatus] = useState('');
  const [isSending, setIsSending] = useState(false);

  const connection = new Connection(
    network === 'mainnet-beta'
      ? import.meta.env.VITE_SOLANA_MAINNET_URL
      : import.meta.env.VITE_SOLANA_DEVNET_URL,
    'confirmed'
  );

  const fetchBalance = async () => {
    try {
      const walletPublicKey = new PublicKey(publicKey);
      const walletBalance = await connection.getBalance(walletPublicKey);
      setBalance(walletBalance / 1e9); // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching Solana balance:', error);
      setBalance('Error');
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchBalance();
    }
  }, [publicKey, network]);

  const handleSendSol = async () => {
    if (!recipientAddress || !sendAmount) {
      setSendStatus('Please fill in all fields.');
      return;
    }
  
    setIsSending(true);
    setSendStatus('');
  
    try {
      const fromPublicKey = new PublicKey(publicKey);
      const toPublicKey = new PublicKey(recipientAddress);
      const lamports = sendAmount * 1e9; // Convert SOL to lamports
  
      const secretKeyUint8Array = Uint8Array.from(secretKey);
      const keypair = Keypair.fromSecretKey(secretKeyUint8Array);
  
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: toPublicKey,
          lamports,
        })
      );
  
      // Send and confirm transaction
      const signature = await connection.sendTransaction(transaction, [keypair], {
        skipPreflight: false,
        preflightCommitment: 'processed',
      });
  
      // Poll for transaction confirmation
      let isConfirmed = false;
      let retries = 0;
      while (!isConfirmed && retries < 10) {
        const confirmation = await connection.getSignatureStatus(signature);
        if (confirmation.value && confirmation.value.confirmationStatus === 'confirmed') {
          isConfirmed = true;
          await fetchBalance(); // Update balance after confirmation
          setSendStatus('Transaction sent successfully!');
        } else {
          retries += 1;
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds before retrying
        }
      }
  
      if (!isConfirmed) {
        throw new Error(`Transaction was not confirmed after multiple attempts. Check signature ${signature} using the Solana Explorer or CLI tools.`);
      }
    } catch (error) {
      console.error('Error sending Solana:', error);
      setSendStatus(`Transaction failed: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };
  

  return (
    <div className="wallet-balance-container">
      <div className="balance-section">
        {balance !== null ? (
          <p className="balance-amount">{balance} SOL</p>
        ) : (
          <p>Loading balance...</p>
        )}
      </div>
      <div className="send-section">
        <h3>Send SOL</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleSendSol(); }} className="send-form">
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Amount in SOL"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            required
            step="0.0001"
            min="0"
          />
          <button type="submit" disabled={isSending}>
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
        {sendStatus && <p className="send-status">{sendStatus}</p>}
      </div>
    </div>
  );
};

export default SolanaWalletBalance;
