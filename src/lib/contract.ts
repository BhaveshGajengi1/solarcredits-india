// SRC Token Contract Configuration
// Deployed on Arbitrum Sepolia
export const SRC_TOKEN_ADDRESS = "0x00DEfe6c8fE01610406Aa58538952D5b7d92c56e";

// Standard ERC-20 ABI for SRC token operations
export const ERC20_ABI = [
  // Read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  
  // Write functions
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

// SRC Token specific ABI (extends ERC-20 with minting/burning)
export const SRC_TOKEN_ABI = [
  ...ERC20_ABI,
  // Minting (for verified solar producers)
  "function mint(address to, uint256 amount) returns (bool)",
  // Burning (for ESG retirement)
  "function burn(uint256 amount) returns (bool)",
  // Events
  "event CreditsMinted(address indexed producer, uint256 amount, bytes32 verificationHash)",
  "event CreditsBurned(address indexed burner, uint256 amount)",
];

// Convert human-readable amount to wei (18 decimals)
export function toTokenUnits(amount: number): bigint {
  return BigInt(Math.floor(amount * 1e18));
}

// Convert wei to human-readable amount
export function fromTokenUnits(amount: bigint): number {
  return Number(amount) / 1e18;
}

// Encode function call data for ERC-20 transfer
export function encodeTransferData(to: string, amount: bigint): string {
  // transfer(address,uint256) function selector
  const selector = "0xa9059cbb";
  // Pad address to 32 bytes (remove 0x, pad left)
  const paddedAddress = to.slice(2).toLowerCase().padStart(64, "0");
  // Convert amount to hex and pad to 32 bytes
  const paddedAmount = amount.toString(16).padStart(64, "0");
  return `${selector}${paddedAddress}${paddedAmount}`;
}

// Encode function call data for ERC-20 approve
export function encodeApproveData(spender: string, amount: bigint): string {
  // approve(address,uint256) function selector
  const selector = "0x095ea7b3";
  const paddedAddress = spender.slice(2).toLowerCase().padStart(64, "0");
  const paddedAmount = amount.toString(16).padStart(64, "0");
  return `${selector}${paddedAddress}${paddedAmount}`;
}

// Encode balanceOf call
export function encodeBalanceOfData(address: string): string {
  // balanceOf(address) function selector
  const selector = "0x70a08231";
  const paddedAddress = address.slice(2).toLowerCase().padStart(64, "0");
  return `${selector}${paddedAddress}`;
}

// Check if contract is deployed (address is not zero)
export function isContractDeployed(): boolean {
  return SRC_TOKEN_ADDRESS.toLowerCase() !== "0x0000000000000000000000000000000000000000";
}
