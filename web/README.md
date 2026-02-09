# CKB Script IPC Web Playground

An in-browser playground that runs the **CKB VM** via WebAssembly, letting you
interact with CKB server contracts using JSON-based IPC — directly from your
browser, no backend required.

## How It Works

```
┌─────────────────── Browser ───────────────────┐
│                                                │
│   index.html          ┌──────────────────┐    │
│   ┌──────────┐  JSON  │  WASM Module     │    │
│   │  Web UI  │ ─────► │  (ckb-vm         │    │
│   │          │ ◄───── │   interpreter)   │    │
│   └──────────┘  JSON  └──────────────────┘    │
│                                                │
│   1. Upload a RISC-V binary (CKB script)      │
│   2. Enter JSON request                        │
│   3. Click Execute                             │
│   4. View JSON response                        │
└────────────────────────────────────────────────┘
```

The WASM module contains the CKB VM interpreter compiled to WebAssembly. When
you click **Execute**, the playground:

1. Serialises your JSON into the IPC wire-protocol (VLQ-encoded packets)
2. Feeds the packet to the CKB VM as pipe input
3. Runs the RISC-V binary inside the VM
4. Captures the response packet from the VM's pipe output
5. Parses and displays the JSON response

## Prerequisites

- [Rust](https://rustup.rs/) (nightly or stable 1.70+)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

Install wasm-pack:

```bash
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
# or
cargo install wasm-pack
```

## Building

```bash
cd web
wasm-pack build --target web --out-dir www/pkg
```

This compiles the Rust WASM crate and outputs the JS/WASM bindings to `www/pkg/`.

## Running

Serve the `web` directory with any static file server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js (npx)
npx serve .
```

Then open <http://localhost:8080> in your browser.

## Usage

1. **Load Script Binary** — Upload a compiled CKB RISC-V binary. This is the
   server contract (e.g. `build/release/unit-tests`).

2. **Server Arguments** — Enter comma-separated arguments for the script. For
   the unit-tests binary, use `server_entry`.

3. **JSON Request** — Enter the JSON request. For example:
   ```json
   {"TestPrimitiveTypes":{"arg1":1,"arg2":2,"arg3":3,"arg4":4,"arg5":5,"arg6":6,"arg7":7,"arg8":8,"arg9":9,"arg10":10,"arg11":true}}
   ```

4. **Execute** — Click the Execute button. The response will appear below.

### Example

Using the `unit-tests` binary with `server_entry` argument:

**Request:**
```json
{"TestPrimitiveTypes":{"arg1":1,"arg2":2,"arg3":3,"arg4":4,"arg5":5,"arg6":6,"arg7":7,"arg8":8,"arg9":9,"arg10":10,"arg11":true}}
```

**Response:**
```json
{"TestPrimitiveTypes": null}
```

## Project Structure

```
web/
├── Cargo.toml        # Rust WASM crate configuration
├── src/
│   └── lib.rs        # CKB VM wrapper + WASM bindings
├── index.html        # Web playground UI
├── app.js            # Frontend JavaScript logic
├── style.css         # Styling
└── README.md         # This file
```

## Technical Details

### Wire Protocol

The playground implements the same binary wire protocol as
`ckb-script-ipc-common`:

- **Request Packet**: `version(VLQ) + method_id(VLQ) + length(VLQ) + payload`
- **Response Packet**: `version(VLQ) + error_code(VLQ) + length(VLQ) + payload`

### In-Memory Pipes

Since the browser is single-threaded (no OS pipes), the playground uses
in-memory buffers to simulate the pipe communication:

- **Read pipe**: Pre-filled with the serialised request packet. Returns EOF
  after the data is consumed.
- **Write pipe**: Collects all bytes written by the VM. The response is
  extracted after execution.

### CKB VM Syscalls

The following syscalls are implemented for the WASM environment:

| Syscall       | Number | Description                    |
|---------------|--------|--------------------------------|
| `READ`        | 2606   | Read from input pipe           |
| `WRITE`       | 2605   | Write to output pipe           |
| `INHERITED_FD`| 2607   | Return inherited file descriptors |
| `CLOSE`       | 2608   | No-op close                    |
| `DEBUG_PRINT` | 2177   | Capture debug output           |
