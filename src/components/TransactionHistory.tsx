interface Transaction {
  id: number;
  direction: string;
  amount: string;
  sourceAddress: string;
  destAddress: string;
  timestamp: string;
  status: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return null;
  }

  const formatAddress = (addr: string) => {
    if (addr.length > 20) {
      return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
    }
    return addr;
  };

  return (
    <div className="card transaction-history">
      <h2 style={{ marginBottom: '1.5rem' }}>Recent Transfers</h2>
      {transactions.map((tx) => (
        <div key={tx.id} className="transaction-item">
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
              {tx.amount} ZEC
            </div>
            <div className="transaction-hash">
              {formatAddress(tx.sourceAddress)} → {formatAddress(tx.destAddress)}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.25rem' }}>
              {new Date(tx.timestamp).toLocaleString()}
            </div>
          </div>
          <div>
            <span 
              className="transaction-status"
              style={{
                background: tx.status === 'completed' ? '#10b98120' : '#fbbf2420',
                color: tx.status === 'completed' ? '#059669' : '#d97706'
              }}
            >
              {tx.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransactionHistory;
