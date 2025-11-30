function InfoSection() {
  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem' }}>Privacy Features</h2>
      <div className="info-section">
        <div className="info-card">
          <h3>🔐 Zcash Shielded Pool</h3>
          <ul>
            <li>zk-SNARKs for transaction privacy</li>
            <li>Hidden sender, receiver, and amount</li>
            <li>Sapling shielded addresses</li>
            <li>Encrypted memo fields</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>🌐 Cross-Chain Privacy</h3>
          <ul>
            <li>Zero-knowledge proof verification</li>
            <li>Commitment-based transfers</li>
            <li>No public transaction linking</li>
            <li>Decentralized relayer network</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>⚡ Miden Rollup</h3>
          <ul>
            <li>Client-side proof generation</li>
            <li>Private state transitions</li>
            <li>STARK-based verification</li>
            <li>Local transaction execution</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>🛡️ Security Guarantees</h3>
          <ul>
            <li>Cryptographic privacy preservation</li>
            <li>Non-custodial architecture</li>
            <li>Atomic swap guarantees</li>
            <li>Fraud proof protection</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
