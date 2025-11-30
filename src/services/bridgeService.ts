import { ZcashService } from './zcashService';
import { MidenService } from './midenService';
import { RelayerService } from './relayerService';

interface TransferData {
  amount: string;
  sourceAddress: string;
  destAddress: string;
  memo?: string;
}

type StatusCallback = (update: { step: string; message: string; status: string }) => void;

export async function initiateZcashToMiden(
  data: TransferData,
  onStatusUpdate: StatusCallback
) {
  const zcashService = new ZcashService();
  const midenService = new MidenService();
  const relayerService = new RelayerService();

  try {
    onStatusUpdate({
      step: 'Creating Shielded Commitment',
      message: 'Generating zero-knowledge proof for Zcash transaction...',
      status: 'pending'
    });

    const commitment = await zcashService.createShieldedCommitment(
      data.amount,
      data.sourceAddress,
      data.memo
    );

    onStatusUpdate({
      step: 'Shielded Commitment Created',
      message: `Commitment: ${commitment.hash}`,
      status: 'success'
    });

    onStatusUpdate({
      step: 'Locking Funds',
      message: 'Sending transaction to Zcash shielded pool...',
      status: 'pending'
    });

    const lockTx = await zcashService.lockFunds(commitment);

    onStatusUpdate({
      step: 'Funds Locked',
      message: `Transaction: ${lockTx.txid}`,
      status: 'success'
    });

    onStatusUpdate({
      step: 'Generating Cross-Chain Proof',
      message: 'Creating zero-knowledge proof for bridge verification...',
      status: 'pending'
    });

    const proof = await relayerService.generateCrossChainProof(
      commitment,
      lockTx,
      data.destAddress
    );

    onStatusUpdate({
      step: 'Cross-Chain Proof Generated',
      message: 'Proof ready for Miden verification',
      status: 'success'
    });

    onStatusUpdate({
      step: 'Submitting to Miden',
      message: 'Creating private state transition on Miden...',
      status: 'pending'
    });

    const midenTx = await midenService.mintPrivateAsset(
      data.destAddress,
      data.amount,
      proof
    );

    onStatusUpdate({
      step: 'Transfer Complete',
      message: `Miden transaction: ${midenTx.hash}`,
      status: 'success'
    });

    return {
      zcashTx: lockTx.txid,
      midenTx: midenTx.hash,
      commitment: commitment.hash
    };
  } catch (error: any) {
    throw new Error(`Transfer failed: ${error.message}`);
  }
}

export async function initiateMidenToZcash(
  data: TransferData,
  onStatusUpdate: StatusCallback
) {
  const zcashService = new ZcashService();
  const midenService = new MidenService();
  const relayerService = new RelayerService();

  try {
    onStatusUpdate({
      step: 'Creating Burn Proof',
      message: 'Generating STARK proof for Miden burn...',
      status: 'pending'
    });

    const burnProof = await midenService.burnPrivateAsset(
      data.sourceAddress,
      data.amount
    );

    onStatusUpdate({
      step: 'Burn Proof Created',
      message: `Proof: ${burnProof.hash}`,
      status: 'success'
    });

    onStatusUpdate({
      step: 'Burning Assets',
      message: 'Executing private state transition on Miden...',
      status: 'pending'
    });

    const burnTx = await midenService.submitBurnTransaction(burnProof);

    onStatusUpdate({
      step: 'Assets Burned',
      message: `Transaction: ${burnTx.hash}`,
      status: 'success'
    });

    onStatusUpdate({
      step: 'Generating Unlock Proof',
      message: 'Creating proof for Zcash unlock...',
      status: 'pending'
    });

    const unlockProof = await relayerService.generateUnlockProof(
      burnProof,
      burnTx,
      data.destAddress
    );

    onStatusUpdate({
      step: 'Unlock Proof Generated',
      message: 'Proof ready for Zcash verification',
      status: 'success'
    });

    onStatusUpdate({
      step: 'Unlocking Funds',
      message: 'Sending shielded transaction on Zcash...',
      status: 'pending'
    });

    const unlockTx = await zcashService.unlockFunds(
      data.destAddress,
      data.amount,
      unlockProof,
      data.memo
    );

    onStatusUpdate({
      step: 'Transfer Complete',
      message: `Zcash transaction: ${unlockTx.txid}`,
      status: 'success'
    });

    return {
      midenTx: burnTx.hash,
      zcashTx: unlockTx.txid,
      burnProof: burnProof.hash
    };
  } catch (error: any) {
    throw new Error(`Transfer failed: ${error.message}`);
  }
}
