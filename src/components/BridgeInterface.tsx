import { useState } from 'react';
import { initiateZcashToMiden, initiateMidenToZcash } from '../services/bridgeService';

interface BridgeInterfaceProps {
  onTransferComplete: (tx: any) => void;
}

function BridgeInterface({ onTransferComplete }: BridgeInterfaceProps) {
  const [direction, setDirection] = useState<'zcash-to-miden' | 'miden-to-zcash'>('zcash-to-miden');
  const [amount, setAmount] = useState('');
  const [sourceAddress, setSourceAddress] = useState('');
  const [destAddress, setDestAddress] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any[]>([]);

  const handleTransfer = async () => {
    if (!amount || !sourceAddress || !destAddress) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setStatus([]);

    try {
      const transferData = {
        amount,
        sourceAddress,
        destAddress,
        memo
      };

      if (direction === 'zcash-to-miden') {
        await initiateZcashToMiden(transferData, (update) => {
          setStatus(prev => [...prev, update]);
        });
      } else {
        await initiateMidenToZcash(transferData, (update) => {
          setStatus(prev => [...prev, update]);
        });
      }

      onTransferComplete({
        id: Date.now(),
        direction,
        amount,
        sourceAddress,
        destAddress,
        timestamp: new Date().toISOString(),
        status: 'completed'
      });

      setAmount('');
      setMemo('');
    } catch (error: any) {
      setStatus(prev => [...prev, {
        step: 'Error',
        message: error.message,
        status: 'error'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDirection = () => {
    setDirection(prev => 
      prev === 'zcash-to-miden' ? 'miden-to-zcash' : 'zcash-to-miden'
    );
  };

  return (
    <div className="card">
      <div className="bridge-interface">
        <div className="chain-section">
          <div className="chain-header">
            <div className="chain-icon zcash-icon">Z</div>
            <div>
              <h3>Zcash Testnet</h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Shielded Pool</p>
            </div>
          </div>
          
          <div className="input-group">
            <label>Amount (ZEC)</label>
            <input
              type="number"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>
              {direction === 'zcash-to-miden' ? 'Source' : 'Destination'} Address
            </label>
            <input
              type="text"
              value={sourceAddress}
              onChange={(e) => setSourceAddress(e.target.value)}
              placeholder="zs1..."
              disabled={loading}
            />
          </div>
        </div>

        <div className="arrow-container">
          <button 
            className="arrow" 
            onClick={toggleDirection}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '1rem'
            }}
          >
            {direction === 'zcash-to-miden' ? '→' : '←'}
          </button>
        </div>

        <div className="chain-section">
          <div className="chain-header">
            <div className="chain-icon miden-icon">M</div>
            <div>
              <h3>Miden Testnet</h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Private Rollup</p>
            </div>
          </div>

          <div className="input-group">
            <label>Amount (ZEC)</label>
            <input
              type="text"
              value={amount}
              readOnly
              placeholder="0.00"
              style={{ background: '#f9fafb' }}
            />
          </div>

          <div className="input-group">
            <label>
              {direction === 'zcash-to-miden' ? 'Destination' : 'Source'} Address
            </label>
            <input
              type="text"
              value={destAddress}
              onChange={(e) => setDestAddress(e.target.value)}
              placeholder="0x..."
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="input-group">
        <label>Encrypted Memo (Optional)</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Private message encrypted with recipient's key..."
          disabled={loading}
        />
      </div>

      <div className="privacy-indicator">
        End-to-End Privacy Enabled
      </div>

      <button 
        className="button" 
        onClick={handleTransfer}
        disabled={loading}
        style={{ marginTop: '1.5rem' }}
      >
        {loading ? 'Processing...' : 'Initiate Shielded Transfer'}
      </button>

      {status.length > 0 && (
        <div className="status-section">
          <h3 style={{ marginBottom: '1rem' }}>Transfer Status</h3>
          {status.map((item, index) => (
            <div key={index} className="status-item">
              <div className={`status-icon status-${item.status}`}>
                {item.status === 'success' ? '✓' : item.status === 'error' ? '✗' : '⋯'}
              </div>
              <div>
                <strong>{item.step}</strong>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BridgeInterface;
