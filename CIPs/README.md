# CKB Script IPC Proposals (CIPs)

This directory contains CKB Script IPC Proposals (CIPs), which are design documents providing information to the CKB Script IPC community about new features, interface standards, and processes.

## What is a CIP?

CIPs are inspired by [Ethereum's EIP process](https://eips.ethereum.org/) and adapted for CKB Script IPC development. They serve as the primary mechanism for:

- Proposing new IPC service interface standards
- Defining communication protocols and wire formats
- Documenting best practices
- Tracking implementation progress

## CIP Index

### Meta CIPs

| CIP | Title | Status |
|-----|-------|--------|
| [CIP-0001](./cip-0001.md) | CIP Purpose and Guidelines | Active |

### Standards Track CIPs - Interface

| CIP | Title | Status |
|-----|-------|--------|
| [CIP-0002](./cip-0002.md) | Standard Crypto Service Interface | Draft |
| [CIP-0100](./cip-0100.md) | Standard Token Service Interface | Draft |

### Standards Track CIPs - Storage

| CIP | Title | Status |
|-----|-------|--------|
| [CIP-2001](./cip-2001.md) | Standard Key-Value Storage Service Interface | Draft |

## Contributing

To propose a new CIP:

1. Read [CIP-0001](./cip-0001.md) to understand the process and format
2. Discuss your idea with the community
3. Write your CIP following the template
4. Submit a pull request

## CIP Number Ranges

| Range | Purpose |
|-------|---------|
| 0001-0099 | Meta and process CIPs |
| 0100-0999 | Core protocol and interface standards |
| 1000-1999 | Crypto service interfaces |
| 2000-2999 | Storage and data service interfaces |
| 3000-3999 | Reserved for future use |

## License

All CIPs are placed in the public domain or under a permissive license compatible with the project's LICENSE file.
