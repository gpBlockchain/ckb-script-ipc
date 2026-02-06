//! Token server implementation
//!
//! This implements the CIP-0100 token service trait.

use alloc::collections::BTreeMap;
use alloc::string::{String, ToString};
use ckb_script_ipc_common::spawn::run_server;
use ckb_token_interface::{Address, CkbToken, TokenError, U256};

use crate::error::Error;

/// Token storage state
pub struct TokenStorage {
    /// Token name
    pub name: &'static str,
    /// Token symbol
    pub symbol: &'static str,
    /// Token decimals
    pub decimals: u8,
    /// Total supply
    pub total_supply: U256,
    /// Balances mapping: address -> balance
    pub balances: BTreeMap<[u8; 32], U256>,
    /// Allowances mapping: (owner, spender) -> allowance
    pub allowances: BTreeMap<([u8; 32], [u8; 32]), U256>,
}

impl TokenStorage {
    /// Creates a new token storage with initial configuration
    pub fn new(
        name: &'static str,
        symbol: &'static str,
        decimals: u8,
        initial_supply: U256,
        initial_holder: Address,
    ) -> Self {
        let mut balances = BTreeMap::new();
        balances.insert(*initial_holder.as_bytes(), initial_supply);

        TokenStorage {
            name,
            symbol,
            decimals,
            total_supply: initial_supply,
            balances,
            allowances: BTreeMap::new(),
        }
    }

    /// Gets the balance of an address
    pub fn get_balance(&self, owner: &Address) -> U256 {
        self.balances
            .get(owner.as_bytes())
            .copied()
            .unwrap_or(U256::ZERO)
    }

    /// Sets the balance of an address
    pub fn set_balance(&mut self, owner: &Address, amount: U256) {
        if amount.is_zero() {
            self.balances.remove(owner.as_bytes());
        } else {
            self.balances.insert(*owner.as_bytes(), amount);
        }
    }

    /// Gets the allowance for (owner, spender)
    pub fn get_allowance(&self, owner: &Address, spender: &Address) -> U256 {
        let key = (*owner.as_bytes(), *spender.as_bytes());
        self.allowances.get(&key).copied().unwrap_or(U256::ZERO)
    }

    /// Sets the allowance for (owner, spender)
    pub fn set_allowance(&mut self, owner: &Address, spender: &Address, amount: U256) {
        let key = (*owner.as_bytes(), *spender.as_bytes());
        if amount.is_zero() {
            self.allowances.remove(&key);
        } else {
            self.allowances.insert(key, amount);
        }
    }
}

impl Default for TokenStorage {
    fn default() -> Self {
        // Default token configuration for testing
        // In production, these would be read from cell data
        let initial_holder = Address::from_script_hash([1u8; 32]);
        let initial_supply = U256::from_u128(1_000_000_000_0000_0000); // 1 billion tokens with 8 decimals

        TokenStorage::new(
            "CKB Demo Token",
            "CDT",
            8,
            initial_supply,
            initial_holder,
        )
    }
}

/// Token server that implements the CkbToken trait
pub struct TokenServer {
    storage: TokenStorage,
    /// Current caller address (in real impl, derived from script context)
    caller: Address,
}

impl TokenServer {
    /// Creates a new token server with default storage
    pub fn new() -> Self {
        TokenServer {
            storage: TokenStorage::default(),
            // In a real implementation, the caller would be derived from
            // the transaction context or authenticated via signature
            caller: Address::from_script_hash([1u8; 32]),
        }
    }

    /// Creates a new token server with custom storage
    pub fn with_storage(storage: TokenStorage) -> Self {
        TokenServer {
            storage,
            caller: Address::from_script_hash([1u8; 32]),
        }
    }

    /// Sets the current caller (for testing/simulation)
    pub fn set_caller(&mut self, caller: Address) {
        self.caller = caller;
    }

    /// Internal transfer implementation
    fn _transfer(&mut self, from: &Address, to: &Address, amount: &U256) -> Result<bool, TokenError> {
        // Check for zero address
        if to.is_zero() {
            return Err(TokenError::TransferToZeroAddress);
        }

        // Check balance
        let from_balance = self.storage.get_balance(from);
        if from_balance.lt(amount) {
            return Err(TokenError::InsufficientBalance);
        }

        // Calculate new balances
        let new_from_balance = from_balance
            .checked_sub(amount)
            .ok_or(TokenError::Underflow)?;

        let to_balance = self.storage.get_balance(to);
        let new_to_balance = to_balance.checked_add(amount).ok_or(TokenError::Overflow)?;

        // Update balances
        self.storage.set_balance(from, new_from_balance);
        self.storage.set_balance(to, new_to_balance);

        Ok(true)
    }

    /// Internal approve implementation
    fn _approve(&mut self, owner: &Address, spender: &Address, amount: &U256) -> Result<bool, TokenError> {
        // Check for zero address
        if spender.is_zero() {
            return Err(TokenError::ApproveToZeroAddress);
        }

        // Set allowance
        self.storage.set_allowance(owner, spender, *amount);

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
        self.storage.name.to_string()
    }

    fn symbol(&mut self) -> String {
        self.storage.symbol.to_string()
    }

    fn decimals(&mut self) -> u8 {
        self.storage.decimals
    }

    fn total_supply(&mut self) -> U256 {
        self.storage.total_supply
    }

    fn balance_of(&mut self, owner: Address) -> U256 {
        self.storage.get_balance(&owner)
    }

    fn transfer(&mut self, to: Address, amount: U256) -> Result<bool, TokenError> {
        let caller = self.caller.clone();
        self._transfer(&caller, &to, &amount)
    }

    fn transfer_from(
        &mut self,
        from: Address,
        to: Address,
        amount: U256,
    ) -> Result<bool, TokenError> {
        let caller = self.caller.clone();

        // Check allowance
        let current_allowance = self.storage.get_allowance(&from, &caller);
        if current_allowance.lt(&amount) {
            return Err(TokenError::InsufficientAllowance);
        }

        // Perform transfer
        self._transfer(&from, &to, &amount)?;

        // Decrease allowance
        let new_allowance = current_allowance
            .checked_sub(&amount)
            .ok_or(TokenError::Underflow)?;
        self.storage.set_allowance(&from, &caller, new_allowance);

        Ok(true)
    }

    fn allowance(&mut self, owner: Address, spender: Address) -> U256 {
        self.storage.get_allowance(&owner, &spender)
    }

    fn approve(&mut self, spender: Address, amount: U256) -> Result<bool, TokenError> {
        let caller = self.caller.clone();
        self._approve(&caller, &spender, &amount)
    }

    fn increase_allowance(
        &mut self,
        spender: Address,
        added_value: U256,
    ) -> Result<bool, TokenError> {
        if spender.is_zero() {
            return Err(TokenError::ApproveToZeroAddress);
        }

        let caller = self.caller.clone();
        let current_allowance = self.storage.get_allowance(&caller, &spender);
        let new_allowance = current_allowance
            .checked_add(&added_value)
            .ok_or(TokenError::Overflow)?;

        self.storage.set_allowance(&caller, &spender, new_allowance);

        Ok(true)
    }

    fn decrease_allowance(
        &mut self,
        spender: Address,
        subtracted_value: U256,
    ) -> Result<bool, TokenError> {
        if spender.is_zero() {
            return Err(TokenError::ApproveToZeroAddress);
        }

        let caller = self.caller.clone();
        let current_allowance = self.storage.get_allowance(&caller, &spender);
        let new_allowance = current_allowance
            .checked_sub(&subtracted_value)
            .ok_or(TokenError::Underflow)?;

        self.storage.set_allowance(&caller, &spender, new_allowance);

        Ok(true)
    }
}

/// Runs the token server
pub fn run_token_server() -> Result<(), Error> {
    let server = TokenServer::new();
    run_server(server.server()).map_err(|_| Error::ServerError)
}
