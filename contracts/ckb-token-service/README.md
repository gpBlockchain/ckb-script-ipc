# CKB Token Service

This is a reference implementation of the [CIP-0100](../../CIPs/cip-0100.md) Standard Token Service Interface.

## CKB vs Ethereum: Key Differences

**Important**: CKB's data model is fundamentally different from Ethereum:

| Aspect | Ethereum | CKB |
|--------|----------|-----|
| State Model | Global World State | Cell Model (UTXO-like) |
| Data Storage | Contract storage slots | Cell data |
| State Access | Read/write anytime | Read from syscalls |
| Persistence | Automatic | Via input/output cells |

### How CKB Contracts Work

1. **No Global State**: CKB contracts cannot store persistent state like Ethereum
2. **Cell-Based Data**: All data exists in cells (UTXOs with associated data)
3. **Syscalls**: Contracts use `ckb_std` syscalls to read:
   - Cell data: `load_cell_data()`
   - Witnesses: `load_witness_args()`
   - Script info: `load_script_hash()`
   - Transaction data: `load_transaction()`

### Token Data in CKB (UDT Pattern)

```
┌─────────────────────────────────────────────────┐
│                    Cell                          │
├─────────────────────────────────────────────────┤
│ Capacity: 100 CKB                               │
│ Lock Script: owner's script (who can spend)     │
│ Type Script: token type (validates rules)       │
│ Data: [token_amount: u128]                      │
└─────────────────────────────────────────────────┘
```

- **Balance**: Sum of token amounts in cells with matching type script
- **Transfer**: Verified by checking `sum(inputs) >= sum(outputs)`
- **Owner**: Determined by the cell's lock script

## Overview

The CKB Token Service provides an ERC-20-like token interface for CKB scripts via IPC. It supports:

- **Token Metadata**: `name()`, `symbol()`, `decimals()`, `total_supply()`
- **Balance Operations**: `balance_of(owner)`
- **Transfer Operations**: `transfer(to, amount)`, `transfer_from(from, to, amount)`
- **Allowance Operations**: `allowance(owner, spender)`, `approve(spender, amount)`, `increase_allowance()`, `decrease_allowance()`

## Usage

### Reading Cell Data with ckb-std

```rust
use ckb_std::high_level::{load_cell_data, load_script_hash};
use ckb_std::ckb_constants::Source;

// Load data from an input cell
let data = load_cell_data(0, Source::Input)?;

// Load current script hash
let script_hash = load_script_hash()?;

// Iterate through all input cells and sum token amounts
// Note: CKB's Simple UDT standard uses u128 (16 bytes, little-endian) for token amounts
// This interface uses U256 for compatibility with larger token amounts
for i in 0.. {
    match load_cell_data(i, Source::Input) {
        Ok(data) if data.len() >= 16 => {
            // Simple UDT uses u128 (little-endian, 16 bytes)
            let amount = u128::from_le_bytes(data[0..16].try_into().unwrap());
            // Convert to U256 for this interface
            let amount_u256 = U256::from_u128(amount);
        }
        _ => break, // No more cells
    }
}
```

### As a Server

The token service runs as an IPC server:

```rust
use ckb_token_service::server::TokenServer;
use ckb_script_ipc_common::spawn::run_server;

let server = TokenServer::new();
run_server(server.server())?;
```

### As a Client

Other scripts can interact with the token service:

```rust
use ckb_token_interface::{CkbTokenClient, Address, U256};
use ckb_script_ipc_common::spawn::spawn_server;

// Spawn the token service
let (read_pipe, write_pipe) = spawn_server(0, Source::CellDep, &[])?;

// Create client
let mut client = CkbTokenClient::new(read_pipe, write_pipe);

// Query token info
let name = client.name()?;
let symbol = client.symbol()?;
let balance = client.balance_of(my_address)?;

// Transfer tokens
client.transfer(recipient, amount)?;
```

## Architecture

```
contracts/ckb-token-service/
├── src/
│   ├── main.rs       # Entry point
│   ├── server.rs     # Token server (reads from cells via syscalls)
│   └── error.rs      # Error types
└── Cargo.toml
```

## Interface Definition

The token interface is defined in `crates/ckb-token-interface/`:

```rust
#[ckb_script_ipc::service]
pub trait CkbToken {
    fn name() -> String;
    fn symbol() -> String;
    fn decimals() -> u8;
    fn total_supply() -> U256;
    fn balance_of(owner: Address) -> U256;
    fn transfer(to: Address, amount: U256) -> Result<bool, TokenError>;
    fn transfer_from(from: Address, to: Address, amount: U256) -> Result<bool, TokenError>;
    fn allowance(owner: Address, spender: Address) -> U256;
    fn approve(spender: Address, amount: U256) -> Result<bool, TokenError>;
    fn increase_allowance(spender: Address, added_value: U256) -> Result<bool, TokenError>;
    fn decrease_allowance(spender: Address, subtracted_value: U256) -> Result<bool, TokenError>;
}
```

## Security Considerations

See [CIP-0100 Security Considerations](../../CIPs/cip-0100.md#security-considerations) for detailed security guidance.

Key points:
- Use `increase_allowance`/`decrease_allowance` instead of `approve` to prevent race conditions
- All arithmetic uses checked operations to prevent overflow/underflow
- Zero address validation on transfers and approvals
- In CKB, verify input/output balance conservation for transfers

## References

- [CKB RFC: Simple UDT](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0025-simple-udt/0025-simple-udt.md)
- [ckb-std documentation](https://docs.rs/ckb-std)

## License

MIT
