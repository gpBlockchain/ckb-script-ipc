# CKB Script IPC - AI Assistant Guide

This guide is designed to help AI assistants (like ChatGPT, Claude, Copilot) quickly understand and use the ckb-script-ipc library. It provides structured information, templates, and patterns for generating CKB script IPC code.

## Quick Reference

| Component | Purpose |
|-----------|---------|
| `ckb-script-ipc` | Proc-macro library for generating IPC code |
| `ckb-script-ipc-common` | Runtime library with IPC utilities |
| `#[ckb_script_ipc::service]` | Main macro for defining IPC interfaces |
| `WorldClient` | Auto-generated client (replace "World" with trait name) |
| `run_server()` | Function to start the IPC server loop |
| `spawn_server()` | Function to spawn and connect to a server |

---

## Project Architecture

```
┌─────────────────┐    IPC    ┌─────────────────┐
│   Client Side   │◄─────────►│   Server Side   │
│                 │  (pipes)  │                 │
│  WorldClient    │           │  WorldServer    │
│  (auto-gen)     │           │  (implements    │
│                 │           │   World trait)  │
└─────────────────┘           └─────────────────┘
        │                             │
        └──────────┬──────────────────┘
                   │
         ┌─────────▼─────────┐
         │  Shared Definition│
         │  #[service] trait │
         │    World { ... }  │
         └───────────────────┘
```

---

## Step-by-Step Implementation

### Step 1: Add Dependencies

```toml
# Cargo.toml
[dependencies]
ckb-script-ipc = { version = "0.1" }
ckb-script-ipc-common = { version = "0.1" }
serde = { version = "1.0", default-features = false, features = ["derive"] }
```

### Step 2: Define the IPC Interface (Shared Code)

Create a trait with the `#[ckb_script_ipc::service]` macro. This should be in a shared library accessible by both client and server.

```rust
// In a shared library (e.g., `crate::def` or separate `*-def` crate)
use alloc::string::String;
use alloc::vec::Vec;
use serde::{Deserialize, Serialize};

// Custom types must implement Serialize and Deserialize
#[derive(Serialize, Deserialize, Clone)]
pub struct MyData {
    pub id: u64,
    pub name: String,
    pub values: Vec<u8>,
}

// Define the IPC interface
#[ckb_script_ipc::service]
pub trait MyService {
    // Simple method with primitive types
    fn add(a: u32, b: u32) -> u32;
    
    // Method with custom types
    fn process_data(data: MyData) -> Result<MyData, u64>;
    
    // Method with no return value
    fn log_message(msg: String);
    
    // Method returning Result for error handling
    fn validate(input: Vec<u8>) -> Result<bool, String>;
}
```

**Important Notes:**
- Methods should NOT have `&self` or `&mut self` parameters in the trait definition
- All types must implement `serde::Serialize` and `serde::Deserialize`
- The macro generates: `MyServiceClient`, `MyServiceRequest`, `MyServiceResponse`, `ServeMyService`

### Step 3: Implement the Server

```rust
// server.rs
use crate::def::{MyService, MyData};
use ckb_script_ipc_common::spawn::run_server;

// Create a struct that implements the service trait
struct MyServiceServer;

impl MyService for MyServiceServer {
    fn add(&mut self, a: u32, b: u32) -> u32 {
        a + b
    }
    
    fn process_data(&mut self, data: MyData) -> Result<MyData, u64> {
        // Process the data
        Ok(MyData {
            id: data.id + 1,
            name: data.name,
            values: data.values.iter().map(|v| v + 1).collect(),
        })
    }
    
    fn log_message(&mut self, msg: String) {
        // Log the message
    }
    
    fn validate(&mut self, input: Vec<u8>) -> Result<bool, String> {
        if input.is_empty() {
            Err("Input cannot be empty".into())
        } else {
            Ok(true)
        }
    }
}

pub fn server_entry() -> Result<(), Error> {
    let server = MyServiceServer;
    // run_server runs an infinite loop processing requests
    run_server(server.server())
        .map_err(|_| Error::ServerError)
}
```

### Step 4: Implement the Client

```rust
// client.rs
use crate::def::MyServiceClient;
use alloc::ffi::CString;
use ckb_script_ipc_common::spawn::spawn_server;
use ckb_std::ckb_constants::Source;

pub fn client_entry() -> Result<(), Error> {
    // Spawn the server and get communication pipes
    let (read_pipe, write_pipe) = spawn_server(
        0,                    // cell index
        Source::CellDep,      // source type
        &[CString::new("server").unwrap().as_ref()],  // args to distinguish server mode
    ).map_err(|_| Error::SpawnError)?;
    
    // Create the client
    let mut client = MyServiceClient::new(read_pipe, write_pipe);
    
    // Call remote methods as if they were local
    let sum = client.add(10, 20);  // Returns 30
    
    let data = MyData {
        id: 1,
        name: "test".into(),
        values: vec![1, 2, 3],
    };
    let result = client.process_data(data)?;
    
    Ok(())
}
```

---

## Common Patterns and Templates

### Pattern 1: Simple Request-Response

```rust
#[ckb_script_ipc::service]
pub trait Calculator {
    fn add(a: i64, b: i64) -> i64;
    fn subtract(a: i64, b: i64) -> i64;
    fn multiply(a: i64, b: i64) -> i64;
    fn divide(a: i64, b: i64) -> Result<i64, String>;
}
```

### Pattern 2: Crypto Service Pattern

```rust
use alloc::vec::Vec;

#[derive(Serialize, Deserialize)]
pub enum CryptoError {
    InvalidKey,
    InvalidSignature,
    VerificationFailed,
}

#[ckb_script_ipc::service]
pub trait CryptoService {
    fn hash(data: Vec<u8>) -> Vec<u8>;
    fn verify_signature(
        public_key: Vec<u8>,
        message: Vec<u8>,
        signature: Vec<u8>,
    ) -> Result<(), CryptoError>;
}
```

### Pattern 3: Stateful Context Service

```rust
#[derive(Clone, Serialize, Deserialize)]
pub struct SessionCtx(pub u64);

#[ckb_script_ipc::service]
pub trait SessionService {
    fn create_session() -> SessionCtx;
    fn update_session(ctx: SessionCtx, data: Vec<u8>) -> Result<(), u64>;
    fn finalize_session(ctx: SessionCtx) -> Result<Vec<u8>, u64>;
}
```

### Pattern 4: Entry Point with Client/Server Switch

```rust
// main.rs or entry.rs
use ckb_std::env::argv;

pub fn entry() -> Result<(), Error> {
    let argv = argv();
    
    // Determine mode based on arguments
    if argv.is_empty() {
        // No args = client mode
        client_entry()
    } else {
        // Has args = server mode
        server_entry()
    }
}
```

---

## Generated Code Reference

When you apply `#[ckb_script_ipc::service]` to a trait named `MyService`, the macro generates:

| Generated Item | Type | Purpose |
|----------------|------|---------|
| `MyService` | trait | The original trait with `&mut self` added |
| `MyServiceClient<R, W>` | struct | Client for calling remote methods |
| `MyServiceRequest` | enum | Serializable request variants |
| `MyServiceResponse` | enum | Serializable response variants |
| `ServeMyService<S>` | struct | Server wrapper |

### Client Usage

```rust
// Auto-generated client methods mirror the trait
impl<R: Read, W: Write> MyServiceClient<R, W> {
    pub fn new(reader: R, writer: W) -> Self { ... }
    pub fn add(&mut self, a: u32, b: u32) -> u32 { ... }
    pub fn process_data(&mut self, data: MyData) -> Result<MyData, u64> { ... }
}
```

---

## Off-chain (Native) Testing

For testing on-chain scripts from off-chain Rust code:

```rust
// tests/src/tests_native.rs
use ckb_script_ipc_common::native::spawn_server;
use my_def::MyServiceClient;

#[test]
fn test_my_service() {
    // Read the compiled script binary
    let script_binary = std::fs::read("../build/release/my-script").unwrap();
    
    // Spawn server with native test infrastructure
    let (read_pipe, write_pipe) = spawn_server(
        &script_binary,
        &["server_entry"],  // args to trigger server mode
    ).unwrap();
    
    // Use client normally
    let mut client = MyServiceClient::new(read_pipe, write_pipe);
    let result = client.add(1, 2);
    assert_eq!(result, 3);
}
```

Enable the `std` feature in `ckb-script-ipc-common` for native testing:

```toml
[dev-dependencies]
ckb-script-ipc-common = { version = "0.1", features = ["std"] }
```

---

## Supported Types

### Primitive Types (Direct Support)
- `i8`, `i16`, `i32`, `i64`, `i128`
- `u8`, `u16`, `u32`, `u64`, `u128`
- `bool`
- `char`

### Standard Library Types (Direct Support)
- `String`
- `Vec<T>`
- `Option<T>`
- `Result<T, E>`
- `BTreeMap<K, V>`
- Arrays: `[T; N]`

### Custom Types (Require Derive)
```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct MyStruct {
    pub field1: u64,
    pub field2: String,
    pub field3: Vec<u8>,
}

#[derive(Serialize, Deserialize)]
pub enum MyEnum {
    Variant1,
    Variant2(u32),
    Variant3 { name: String },
}
```

### Special Handling for Byte Arrays
For large byte arrays, use `serde_with::hex::Hex`:

```rust
use serde_with::serde_as;

#[serde_as]
#[derive(Serialize, Deserialize)]
pub struct DataWithBytes {
    pub id: u64,
    #[serde_as(as = "serde_with::hex::Hex")]
    pub data: Vec<u8>,
}
```

---

## Error Handling

### Method Return Types

```rust
#[ckb_script_ipc::service]
pub trait ErrorHandling {
    // Simple return - panics on error
    fn simple_method() -> u32;
    
    // Result return - allows error propagation
    fn fallible_method() -> Result<u32, String>;
    
    // Custom error enum
    fn custom_error_method() -> Result<Data, MyError>;
}

#[derive(Serialize, Deserialize, Debug)]
pub enum MyError {
    NotFound,
    InvalidInput(String),
    InternalError(u64),
}
```

### Client-Side Error Handling

```rust
// The client method returns the same type as defined in the trait
let result: Result<u32, String> = client.fallible_method();
match result {
    Ok(value) => { /* handle success */ }
    Err(error) => { /* handle error */ }
}
```

---

## Wire Protocol Summary

The IPC uses a simple packet-based protocol over pipes:

**Request Format:**
```
| version (VLQ) | method_id (VLQ) | length (VLQ) | payload (JSON) |
```

**Response Format:**
```
| version (VLQ) | error_code (VLQ) | length (VLQ) | payload (JSON) |
```

- VLQ: Variable-Length Quantity encoding (compact integers)
- Payload: JSON-serialized request/response data
- Current version: 0

---

## Project Structure Example

```
my-ckb-project/
├── Cargo.toml              # Workspace definition
├── crates/
│   └── my-service-def/     # Shared IPC definitions
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs      # #[service] trait definitions
├── contracts/
│   └── my-contract/        # On-chain script
│       ├── Cargo.toml
│       └── src/
│           ├── main.rs
│           ├── entry.rs    # Entry point switching
│           ├── client.rs   # Client implementation
│           ├── server.rs   # Server implementation
│           └── error.rs
└── tests/
    ├── Cargo.toml
    └── src/
        └── tests_native.rs # Off-chain tests
```

---

## Building and Testing

```bash
# Build all contracts
make build

# Build specific contract
make build CONTRACT=my-contract

# Run tests
make test

# Run specific test
cargo test test_my_service -- --nocapture

# Check code
make check

# Format code
make fmt
```

---

## FAQ for AI Assistants

**Q: How do I create a new IPC service?**
A: 1) Define a trait with `#[ckb_script_ipc::service]`, 2) Implement the trait for a server struct, 3) Create a client using the auto-generated `*Client` type.

**Q: Why does my custom type not work?**
A: Ensure it has `#[derive(Serialize, Deserialize)]` from serde.

**Q: How do I handle errors?**
A: Use `Result<T, E>` as the return type where E implements Serialize/Deserialize.

**Q: Can I use `&str` instead of `String`?**
A: No, use owned types (`String`, `Vec<T>`) because data must be serialized.

**Q: How do I test my IPC code?**
A: Use the native test infrastructure with `ckb_script_ipc_common::native::spawn_server`.

**Q: What's the difference between `spawn_server` and `spawn_cell_server`?**
A: `spawn_server` uses cell index, `spawn_cell_server` uses code_hash/hash_type.

---

## Quick Copy-Paste Templates

### Minimal Service Definition

```rust
#![no_std]
extern crate alloc;
use alloc::string::String;

#[ckb_script_ipc::service]
pub trait MyService {
    fn hello(name: String) -> String;
}
```

### Minimal Server Implementation

```rust
use crate::def::MyService;
use ckb_script_ipc_common::spawn::run_server;

struct MyServer;

impl MyService for MyServer {
    fn hello(&mut self, name: String) -> String {
        format!("Hello, {}!", name)
    }
}

pub fn server_entry() -> Result<(), i8> {
    run_server(MyServer.server()).map_err(|_| -1)
}
```

### Minimal Client Implementation

```rust
use crate::def::MyServiceClient;
use alloc::ffi::CString;
use ckb_script_ipc_common::spawn::spawn_server;
use ckb_std::ckb_constants::Source;

pub fn client_entry() -> Result<(), i8> {
    let (r, w) = spawn_server(0, Source::CellDep, &[CString::new("s").unwrap().as_ref()])
        .map_err(|_| -1)?;
    let mut client = MyServiceClient::new(r, w);
    let _result = client.hello("World".into());
    Ok(())
}
```

---

## See Also

- [Main README](../README.md) - Project overview
- [C Implementation](../c/README.md) - C language implementation
- [Demo Project](../contracts/ckb-script-ipc-demo/) - Complete working example
- [Unit Tests Definition](../crates/unit-tests-def/) - Complex type examples
- [Crypto Interface](../crates/ckb-crypto-interface/) - Real-world service example
