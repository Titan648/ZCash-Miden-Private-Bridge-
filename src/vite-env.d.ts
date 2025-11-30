/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ZCASH_TESTNET_RPC: string
  readonly VITE_MIDEN_TESTNET_RPC: string
  readonly VITE_BRIDGE_CONTRACT_ADDRESS: string
  readonly VITE_RELAYER_PORT: string
  readonly VITE_RELAYER_PRIVATE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
