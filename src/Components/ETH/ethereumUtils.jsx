import { ethers } from 'ethers';

export const sendEthereum = async (recipientAddress, amountInEth) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tx = await signer.sendTransaction({
      to: recipientAddress,
      value: ethers.utils.parseEther(amountInEth),
    });
    console.log('Transaction Hash:', tx.hash);
    await tx.wait();
    console.log('Transaction Confirmed');
  } catch (error) {
    console.error('Error sending ETH:', error);
  }
};

