//! CIP-0100: Standard Token Service Interface
//!
//! This crate provides the interface definition for CIP-0100 compliant token services.
//! It defines the `CkbToken` trait with ERC-20-like functionality including:
//! - Token metadata (name, symbol, decimals, total_supply)
//! - Balance queries (balance_of)
//! - Transfer operations (transfer, transfer_from)
//! - Allowance management (allowance, approve, increase_allowance, decrease_allowance)

#![no_std]
extern crate alloc;

use alloc::string::String;
use core::cmp::Ordering;
use core::ops::{Add, Sub};
use serde::{Deserialize, Serialize};

/// Represents a CKB address (script hash)
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, Default)]
pub struct Address(pub [u8; 32]);

impl Address {
    /// Zero address constant
    pub const ZERO: Address = Address([0u8; 32]);

    /// Creates an Address from a script hash
    pub fn from_script_hash(hash: [u8; 32]) -> Self {
        Address(hash)
    }

    /// Returns the address as bytes
    pub fn as_bytes(&self) -> &[u8; 32] {
        &self.0
    }

    /// Checks if this is the zero address
    pub fn is_zero(&self) -> bool {
        self.0 == [0u8; 32]
    }
}

/// A 256-bit unsigned integer for token amounts
/// Uses little-endian representation with 4 u64 limbs
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, Default, Copy)]
pub struct U256(pub [u64; 4]);

impl U256 {
    /// Zero value
    pub const ZERO: U256 = U256([0, 0, 0, 0]);

    /// Maximum value
    pub const MAX: U256 = U256([u64::MAX, u64::MAX, u64::MAX, u64::MAX]);

    /// One value
    pub const ONE: U256 = U256([1, 0, 0, 0]);

    /// Creates a U256 from a u64 value
    pub fn from_u64(value: u64) -> Self {
        U256([value, 0, 0, 0])
    }

    /// Creates a U256 from a u128 value
    pub fn from_u128(value: u128) -> Self {
        U256([value as u64, (value >> 64) as u64, 0, 0])
    }

    /// Checks if this is zero
    pub fn is_zero(&self) -> bool {
        self.0[0] == 0 && self.0[1] == 0 && self.0[2] == 0 && self.0[3] == 0
    }

    /// Adds two U256 values, returning None if overflow occurs
    pub fn checked_add(&self, other: &U256) -> Option<U256> {
        let mut result = [0u64; 4];
        let mut carry = 0u64;

        for i in 0..4 {
            let (sum1, overflow1) = self.0[i].overflowing_add(other.0[i]);
            let (sum2, overflow2) = sum1.overflowing_add(carry);
            result[i] = sum2;
            carry = (overflow1 as u64) + (overflow2 as u64);
        }

        if carry > 0 {
            None
        } else {
            Some(U256(result))
        }
    }

    /// Subtracts other from self, returning None if underflow occurs
    pub fn checked_sub(&self, other: &U256) -> Option<U256> {
        let mut result = [0u64; 4];
        let mut borrow = 0u64;

        for i in 0..4 {
            let (diff1, overflow1) = self.0[i].overflowing_sub(other.0[i]);
            let (diff2, overflow2) = diff1.overflowing_sub(borrow);
            result[i] = diff2;
            borrow = (overflow1 as u64) + (overflow2 as u64);
        }

        if borrow > 0 {
            None
        } else {
            Some(U256(result))
        }
    }

    /// Multiplies two U256 values, returning None if overflow occurs
    pub fn checked_mul(&self, other: &U256) -> Option<U256> {
        // Simple implementation for basic cases
        // For a full implementation, consider using a dedicated big integer library
        if self.is_zero() || other.is_zero() {
            return Some(U256::ZERO);
        }

        // Check if we can use simple u128 multiplication
        if self.0[2] == 0 && self.0[3] == 0 && other.0[2] == 0 && other.0[3] == 0 {
            let a = (self.0[1] as u128) << 64 | (self.0[0] as u128);
            let b = (other.0[1] as u128) << 64 | (other.0[0] as u128);

            // Check for overflow
            if a > 0 && b > u128::MAX / a {
                return None;
            }

            let result = a.checked_mul(b)?;
            return Some(U256::from_u128(result));
        }

        // For larger numbers, we need proper big integer multiplication
        // This is a simplified check that may reject some valid multiplications
        None
    }

    /// Compares two U256 values
    pub fn cmp(&self, other: &U256) -> Ordering {
        for i in (0..4).rev() {
            match self.0[i].cmp(&other.0[i]) {
                Ordering::Equal => continue,
                other => return other,
            }
        }
        Ordering::Equal
    }

    /// Returns true if self >= other
    pub fn gte(&self, other: &U256) -> bool {
        matches!(self.cmp(other), Ordering::Greater | Ordering::Equal)
    }

    /// Returns true if self > other
    pub fn gt(&self, other: &U256) -> bool {
        matches!(self.cmp(other), Ordering::Greater)
    }

    /// Returns true if self <= other
    pub fn lte(&self, other: &U256) -> bool {
        matches!(self.cmp(other), Ordering::Less | Ordering::Equal)
    }

    /// Returns true if self < other
    pub fn lt(&self, other: &U256) -> bool {
        matches!(self.cmp(other), Ordering::Less)
    }
}

impl PartialOrd for U256 {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for U256 {
    fn cmp(&self, other: &Self) -> Ordering {
        U256::cmp(self, other)
    }
}

impl Add for U256 {
    type Output = U256;

    fn add(self, other: U256) -> U256 {
        self.checked_add(&other).expect("U256 addition overflow")
    }
}

impl Sub for U256 {
    type Output = U256;

    fn sub(self, other: U256) -> U256 {
        self.checked_sub(&other).expect("U256 subtraction underflow")
    }
}

/// Error types for token operations
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum TokenError {
    /// Insufficient balance for transfer
    InsufficientBalance,
    /// Insufficient allowance for transfer_from
    InsufficientAllowance,
    /// Arithmetic overflow in calculations
    Overflow,
    /// Arithmetic underflow in calculations
    Underflow,
    /// Invalid address (zero address or malformed)
    InvalidAddress,
    /// Transfer to zero address
    TransferToZeroAddress,
    /// Approve to zero address
    ApproveToZeroAddress,
    /// Operation not permitted
    NotPermitted,
    /// Internal error
    InternalError,
}

/// Transfer event emitted when tokens are transferred
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TransferEvent {
    pub from: Address,
    pub to: Address,
    pub amount: U256,
}

/// Approval event emitted when an allowance is set
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApprovalEvent {
    pub owner: Address,
    pub spender: Address,
    pub amount: U256,
}

/// CIP-0100 Standard Token Service Interface
///
/// This trait defines the standard interface for fungible tokens on CKB,
/// inspired by Ethereum's ERC-20 standard.
#[ckb_script_ipc::service]
pub trait CkbToken {
    /// Returns the name of the token
    fn name() -> String;

    /// Returns the symbol of the token
    fn symbol() -> String;

    /// Returns the number of decimals used for display purposes
    fn decimals() -> u8;

    /// Returns the total token supply
    fn total_supply() -> U256;

    /// Returns the token balance of an address
    fn balance_of(owner: Address) -> U256;

    /// Transfers tokens from the caller to a recipient
    fn transfer(to: Address, amount: U256) -> Result<bool, TokenError>;

    /// Transfers tokens from one address to another using the allowance mechanism
    fn transfer_from(from: Address, to: Address, amount: U256) -> Result<bool, TokenError>;

    /// Returns the remaining allowance that a spender can spend on behalf of owner
    fn allowance(owner: Address, spender: Address) -> U256;

    /// Sets the allowance for a spender to spend tokens on behalf of the caller
    fn approve(spender: Address, amount: U256) -> Result<bool, TokenError>;

    /// Atomically increases the allowance granted to a spender
    fn increase_allowance(spender: Address, added_value: U256) -> Result<bool, TokenError>;

    /// Atomically decreases the allowance granted to a spender
    fn decrease_allowance(spender: Address, subtracted_value: U256) -> Result<bool, TokenError>;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_u256_basic() {
        let zero = U256::ZERO;
        let one = U256::ONE;
        let max = U256::MAX;

        assert!(zero.is_zero());
        assert!(!one.is_zero());
        assert!(!max.is_zero());
    }

    #[test]
    fn test_u256_from() {
        let from_u64 = U256::from_u64(100);
        assert_eq!(from_u64.0[0], 100);
        assert_eq!(from_u64.0[1], 0);

        let from_u128 = U256::from_u128(1_000_000_000_000_000_000);
        assert!(!from_u128.is_zero());
    }

    #[test]
    fn test_u256_add() {
        let a = U256::from_u64(100);
        let b = U256::from_u64(200);
        let result = a.checked_add(&b).unwrap();
        assert_eq!(result.0[0], 300);
    }

    #[test]
    fn test_u256_sub() {
        let a = U256::from_u64(300);
        let b = U256::from_u64(100);
        let result = a.checked_sub(&b).unwrap();
        assert_eq!(result.0[0], 200);
    }

    #[test]
    fn test_u256_sub_underflow() {
        let a = U256::from_u64(100);
        let b = U256::from_u64(200);
        assert!(a.checked_sub(&b).is_none());
    }

    #[test]
    fn test_u256_cmp() {
        let a = U256::from_u64(100);
        let b = U256::from_u64(200);
        let c = U256::from_u64(100);

        assert!(a.lt(&b));
        assert!(b.gt(&a));
        assert!(a.lte(&c));
        assert!(a.gte(&c));
    }

    #[test]
    fn test_address() {
        let zero = Address::ZERO;
        assert!(zero.is_zero());

        let hash = [1u8; 32];
        let addr = Address::from_script_hash(hash);
        assert!(!addr.is_zero());
        assert_eq!(addr.as_bytes(), &hash);
    }
}
