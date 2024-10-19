// components/payment.tsx
import { FC, useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

interface PaymentProps {
  totalPrice: number;
  recipientAddress: string; // Recipient's address (User A)
}

const Payment: FC<PaymentProps> = ({ totalPrice, recipientAddress }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const appWalletAddress = "A7NWEiLApRZSdYDn5RWftcAzR3yDuHF8xXfxt6vGuivb"; // Solwish wallet public key

  useEffect(() => {
    if (recipientAddress) {
      console.log('Recipient Address:', recipientAddress);
    }
  }, [recipientAddress]);

  const handleProceedToPayment = async () => {
    if (!publicKey) {
      alert('Please connect your wallet to proceed with payment.');
      return;
    }
  
    if (!recipientAddress) {
      alert('Recipient wallet address is missing.');
      return;
    }
  
    try {
      const recipientPubkey = new PublicKey(recipientAddress); // User A's address
      const appPubkey = new PublicKey(appWalletAddress); // Solwish app's wallet
  
      const senderBalance = await connection.getBalance(publicKey);
      const roundedTotalPrice = parseFloat(totalPrice.toFixed(2));
      const lamportsTotal = roundedTotalPrice * 1e9; // Convert total price (SOL) to lamports
      const feeLamports = 0.005 * 1e9; // 0.005 SOL fee to Solwish app
      const lamportsToSend = lamportsTotal - feeLamports; // Remaining amount to send to User A
  
      if (senderBalance < lamportsTotal) {
        alert('Insufficient balance to complete the transaction.');
        return;
      }
  
      // Fetch the latest blockhash
      const latestBlockhash = await connection.getLatestBlockhash();
  
      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: lamportsToSend,
        }),
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: appPubkey,
          lamports: feeLamports,
        })
      );
  
      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
  
      // Confirm the transaction
      await connection.confirmTransaction(
        {
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        'finalized' // Commitment level
      );
  
      alert(`Payment successful! Transaction signature: ${signature}`);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={handleProceedToPayment}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </div>
  );
};

export default Payment;