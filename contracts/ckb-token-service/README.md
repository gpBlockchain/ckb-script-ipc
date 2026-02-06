# CKB Token Service

This is a reference implementation of the [CIP-0100](../../CIPs/cip-0100.md) Standard Token Service Interface.

## Overview

The CKB Token Service provides an ERC-20-like token interface for CKB scripts via IPC. It supports:

- **Token Metadata**: `name()`, `symbol()`, `decimals()`, `total_supply()`
- **Balance Operations**: `balance_of(owner)`
- **Transfer Operations**: `transfer(to, amount)`, `transfer_from(from, to, amount)`
- **Allowance Operations**: `allowance(owner, spender)`, `approve(spender, amount)`, `increase_allowance()`, `decrease_allowance()`

## Usage

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
│   ├── server.rs     # Token server and storage implementation
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

## License

MIT
