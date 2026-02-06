//! Token server implementation
//!
//! This implements the CIP-0100 token service trait for CKB.
//!
//! # CKB vs Ethereum Data Model
//!
//! Unlike Ethereum which has a global "world state" where contracts can store and
//! retrieve data at any time, CKB uses a **Cell Model**:
//!
//! - **No Global State**: CKB contracts cannot store persistent state like Ethereum contracts
//! - **Cell-Based Data**: All data is stored in cells (UTXOs with associated data)
//! - **Transaction Inputs/Outputs**: Contracts read data from input cells and write to output cells
//! - **Syscalls**: Contracts use `ckb_std` syscalls to read cell data, witnesses, and transaction info
//!
//! # How Token Data is Handled in CKB
//!
//! In CKB, token balances are typically represented as:
//! 1. **UDT (User Defined Token)**: Token amounts stored in cell data
//! 2. **Lock Script**: Owner's address (who can spend the cell)
//! 3. **Type Script**: Token type identifier (ensures token rules are followed)
//!
//! # Important: Filtering by Type Script
//!
//! When iterating through cells, you MUST filter by type script to only process
//! cells belonging to your specific token. A transaction can contain multiple
//! cell types (CKB capacity cells, different tokens, etc.).
//!
//! ```ignore
//! use ckb_std::high_level::{load_cell_type, load_cell_type_hash, load_script_hash};
//! use ckb_std::ckb_constants::Source;
//!
//! // Get current script hash (this token's type script)
//! let current_script_hash = load_script_hash()?;
//!
//! // Only process cells with matching type script
//! for i in 0.. {
//!     match load_cell_type_hash(i, Source::Input)? {
//!         Some(type_hash) if type_hash == current_script_hash => {
//!             // This cell belongs to our token, process it
//!             let data = load_cell_data(i, Source::Input)?;
//!         }
//!         Some(_) => continue, // Different token type, skip
//!         None => continue,    // No type script (plain CKB cell), skip
//!     }
//! }
//! ```

use alloc::string::{String, ToString};
use alloc::vec::Vec;
use ckb_script_ipc_common::spawn::run_server;
use ckb_std::ckb_constants::Source;
use ckb_std::high_level::{load_cell_data, load_cell_type_hash, load_script_hash, load_witness_args};
use ckb_token_interface::{Address, CkbToken, TokenError, U256};

use crate::error::Error;

/// Token configuration loaded from cell data
/// 
/// In CKB, token metadata is typically stored in a "info cell" that contains:
/// - Token name
/// - Token symbol  
/// - Decimals
/// - Total supply
/// 
/// This struct represents the parsed token configuration.
#[derive(Debug, Clone)]
pub struct TokenConfig {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub total_supply: U256,
}

impl Default for TokenConfig {
    fn default() -> Self {
        // Default configuration - in production, this would be loaded from cell data
        TokenConfig {
            name: String::from("CKB Demo Token"),
            symbol: String::from("CDT"),
            decimals: 8,
            total_supply: U256::from_u128(1_000_000_000_00000000), // 1 billion with 8 decimals
        }
    }
}

/// Token server that implements the CkbToken trait
/// 
/// This server provides token operations by reading data from CKB cells
/// using syscalls. Unlike Ethereum's persistent storage, CKB contracts
/// read transaction data at runtime.
pub struct TokenServer {
    /// Token configuration (loaded from cells)
    config: TokenConfig,
}

impl TokenServer {
    /// Creates a new token server
    /// 
    /// In a production implementation, this would:
    /// 1. Load token config from the type script's associated info cell
    /// 2. Parse the cell data to extract token metadata
    pub fn new() -> Self {
        // In production: load config from cell data using syscalls
        // let config = Self::load_token_config_from_cell()?;
        TokenServer {
            config: TokenConfig::default(),
        }
    }

    /// Load token configuration from cell data
    /// 
    /// This demonstrates how to read data from CKB cells using syscalls.
    /// The token info would typically be stored in a cell with a specific type script.
    #[allow(dead_code)]
    fn load_token_config_from_cell() -> Result<TokenConfig, Error> {
        // In CKB, we read data from cells using syscalls
        // This is just a demonstration - real implementation would parse the cell data
        
        // Try to load cell data from the first cell_dep (where token info might be stored)
        match load_cell_data(0, Source::CellDep) {
            Ok(data) => {
                // Parse token config from cell data
                // Format could be: name_len(1) + name + symbol_len(1) + symbol + decimals(1) + total_supply(32)
                Self::parse_token_config(&data)
            }
            Err(_) => {
                // Fallback to default if no cell data available
                Ok(TokenConfig::default())
            }
        }
    }

    /// Parse token configuration from raw cell data
    #[allow(dead_code)]
    fn parse_token_config(data: &[u8]) -> Result<TokenConfig, Error> {
        if data.is_empty() {
            return Ok(TokenConfig::default());
        }

        // Simple parsing - in production, use a proper serialization format
        // This is just demonstrating the pattern
        let mut offset = 0;

        // Read name
        if data.len() < offset + 1 {
            return Ok(TokenConfig::default());
        }
        let name_len = data[offset] as usize;
        offset += 1;

        if data.len() < offset + name_len {
            return Ok(TokenConfig::default());
        }
        let name = String::from_utf8_lossy(&data[offset..offset + name_len]).to_string();
        offset += name_len;

        // Read symbol
        if data.len() < offset + 1 {
            return Ok(TokenConfig::default());
        }
        let symbol_len = data[offset] as usize;
        offset += 1;

        if data.len() < offset + symbol_len {
            return Ok(TokenConfig::default());
        }
        let symbol = String::from_utf8_lossy(&data[offset..offset + symbol_len]).to_string();
        offset += symbol_len;

        // Read decimals
        if data.len() < offset + 1 {
            return Ok(TokenConfig::default());
        }
        let decimals = data[offset];
        offset += 1;

        // Read total supply (32 bytes for U256)
        let total_supply = if data.len() >= offset + 32 {
            let mut bytes = [0u64; 4];
            for i in 0..4 {
                let start = offset + i * 8;
                let end = start + 8;
                bytes[i] = u64::from_le_bytes(data[start..end].try_into().unwrap_or([0; 8]));
            }
            U256(bytes)
        } else {
            U256::from_u128(1_000_000_000_0000_0000)
        };

        Ok(TokenConfig {
            name,
            symbol,
            decimals,
            total_supply,
        })
    }

    /// Read balance from cell data
    /// 
    /// In CKB's UDT model, the balance is stored in the cell's data field.
    /// This function demonstrates how to read balance from input cells.
    /// 
    /// # Important: Type Script Filtering
    /// 
    /// You MUST filter cells by type script hash to only process cells belonging
    /// to THIS token. A transaction may contain many different cell types:
    /// - Plain CKB capacity cells (no type script)
    /// - Other UDT token cells (different type script)
    /// - NFT cells, etc.
    /// 
    /// # Arguments
    /// * `owner` - The address (script hash) of the token owner
    /// 
    /// # Returns
    /// The token balance found in cells belonging to this owner
    fn read_balance_from_cells(&self, _owner: &Address) -> U256 {
        // In CKB, to get a user's balance, you would:
        // 1. Get the current script hash (identifies this token type)
        // 2. Iterate through cells, FILTERING by type script
        // 3. Check if the cell's lock script hash matches the owner
        // 4. Sum up the token amounts in those cells
        //
        // CORRECT PATTERN - Filter by type script:
        //
        // let current_type_hash = load_script_hash().expect("get script hash");
        // let mut balance = U256::ZERO;
        // 
        // for i in 0.. {
        //     // IMPORTANT: Check type script hash first!
        //     let type_hash = match load_cell_type_hash(i, Source::Input) {
        //         Ok(Some(hash)) => hash,
        //         Ok(None) => continue,  // No type script = not a token cell, SKIP
        //         Err(_) => break,       // No more cells
        //     };
        //     
        //     // Only process cells with OUR token's type script
        //     if type_hash != current_type_hash {
        //         continue; // Different token type, SKIP
        //     }
        //     
        //     // Now safe to read cell data - this IS our token
        //     match load_cell_data(i, Source::Input) {
        //         Ok(data) if data.len() >= 16 => {
        //             // Simple UDT uses u128 (little-endian, 16 bytes)
        //             let amount_bytes: [u8; 16] = data[0..16].try_into().unwrap();
        //             let amount = u128::from_le_bytes(amount_bytes);
        //             balance = balance.checked_add(&U256::from_u128(amount)).unwrap_or(U256::MAX);
        //         }
        //         _ => {} // Invalid data format
        //     }
        // }
        // balance

        // For this demo, return a default balance
        U256::from_u128(1000_00000000) // 1000 tokens with 8 decimals
    }

    /// Read allowance from witness data
    /// 
    /// Allowances in CKB can be implemented using witness data or a separate
    /// allowance cell pattern. This demonstrates reading from witness.
    fn read_allowance_from_witness(&self, _owner: &Address, _spender: &Address) -> U256 {
        // In CKB, allowances could be:
        // 1. Stored in witness data for the transaction
        // 2. Implemented via a separate "allowance cell" pattern
        // 3. Use signature-based authorization instead
        //
        // Example reading from witness:
        // match load_witness_args(0, Source::Input) {
        //     Ok(witness) => {
        //         if let Some(lock_data) = witness.lock().to_opt() {
        //             // Parse allowance from witness data
        //         }
        //     }
        //     Err(_) => {}
        // }

        // For this demo, return zero (no allowance)
        U256::ZERO
    }

    /// Verify transfer by checking input/output balance conservation
    /// 
    /// In CKB, transfers are verified by ensuring:
    /// 1. Input cells have sufficient balance
    /// 2. Output cells receive the correct amounts
    /// 3. Total inputs >= Total outputs (for the token type)
    fn verify_transfer(&self, _from: &Address, _to: &Address, _amount: &U256) -> Result<bool, TokenError> {
        // In CKB, the script verifies transfers by:
        // 1. Summing token amounts in input cells
        // 2. Summing token amounts in output cells
        // 3. Ensuring inputs >= outputs
        //
        // The actual transfer happens at the cell level - this script just validates it
        //
        // Example:
        // let input_sum = self.sum_cells(Source::Input)?;
        // let output_sum = self.sum_cells(Source::Output)?;
        // if input_sum < output_sum {
        //     return Err(TokenError::InsufficientBalance);
        // }

        // For this demo, always succeed
        Ok(true)
    }
}

impl Default for TokenServer {
    fn default() -> Self {
        Self::new()
    }
}

impl CkbToken for TokenServer {
    fn name(&mut self) -> String {
        self.config.name.clone()
    }

    fn symbol(&mut self) -> String {
        self.config.symbol.clone()
    }

    fn decimals(&mut self) -> u8 {
        self.config.decimals
    }

    fn total_supply(&mut self) -> U256 {
        self.config.total_supply
    }

    fn balance_of(&mut self, owner: Address) -> U256 {
        // In CKB, balance is read from cells, not from stored state
        self.read_balance_from_cells(&owner)
    }

    fn transfer(&mut self, to: Address, amount: U256) -> Result<bool, TokenError> {
        // Check for zero address
        if to.is_zero() {
            return Err(TokenError::TransferToZeroAddress);
        }

        // In CKB, the "caller" is determined by which lock script is being executed
        // The transfer verification checks that input/output balances are correct
        let from = Address::from_script_hash([0u8; 32]); // Would be derived from current script context
        
        self.verify_transfer(&from, &to, &amount)
    }

    fn transfer_from(
        &mut self,
        from: Address,
        to: Address,
        amount: U256,
    ) -> Result<bool, TokenError> {
        // Check for zero address
        if to.is_zero() {
            return Err(TokenError::TransferToZeroAddress);
        }

        // In CKB, transfer_from requires checking allowance from witness or allowance cells
        let caller = Address::from_script_hash([0u8; 32]); // Would be derived from context
        let current_allowance = self.read_allowance_from_witness(&from, &caller);
        
        if current_allowance.lt(&amount) {
            return Err(TokenError::InsufficientAllowance);
        }

        self.verify_transfer(&from, &to, &amount)
    }

    fn allowance(&mut self, owner: Address, spender: Address) -> U256 {
        // Read allowance from witness data or allowance cells
        self.read_allowance_from_witness(&owner, &spender)
    }

    fn approve(&mut self, spender: Address, _amount: U256) -> Result<bool, TokenError> {
        // Check for zero address
        if spender.is_zero() {
            return Err(TokenError::ApproveToZeroAddress);
        }

        // In CKB, "approve" would typically:
        // 1. Create an allowance cell with the approval amount
        // 2. Or include the approval in witness data for later verification
        //
        // Note: CKB's model is different - approvals are usually handled via
        // multi-sig or other cryptographic patterns rather than stored state

        Ok(true)
    }

    fn increase_allowance(
        &mut self,
        spender: Address,
        _added_value: U256,
    ) -> Result<bool, TokenError> {
        if spender.is_zero() {
            return Err(TokenError::ApproveToZeroAddress);
        }

        // Would modify allowance cell or update witness data
        Ok(true)
    }

    fn decrease_allowance(
        &mut self,
        spender: Address,
        _subtracted_value: U256,
    ) -> Result<bool, TokenError> {
        if spender.is_zero() {
            return Err(TokenError::ApproveToZeroAddress);
        }

        // Would modify allowance cell or update witness data
        Ok(true)
    }
}

/// Runs the token server
pub fn run_token_server() -> Result<(), Error> {
    let server = TokenServer::new();
    run_server(server.server()).map_err(|_| Error::ServerError)
}
