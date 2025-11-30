import { useState } from 'react';
import BridgeInterface from './components/BridgeInterface';
import InfoSection from './components/InfoSection';
import TransactionHistory from './components/TransactionHistory';

function App() {
  const [transactions, setTransactions] = useState<any[]>([]);

  const handleTransferComplete = (tx: any) => {
    setTransactions(prev => [tx, ...prev]);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🔒 Zcash ⟷ Miden Private Bridge</h1>
        <p>Shielded Cross-Chain Transfers with Zero-Knowledge Proofs</p>
      </div>

      <BridgeInterface onTransferComplete={handleTransferComplete} />
      <InfoSection />
      <TransactionHistory transactions={transactions} />
    </div>
  );
}

export default App;
