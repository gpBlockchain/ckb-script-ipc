//! CIP-0100 Token Service Implementation
//!
//! This is a reference implementation of the CIP-0100 standard token interface.
//! It demonstrates how to implement an ERC-20-like token on CKB using IPC.

#![no_std]
#![cfg_attr(not(test), no_main)]

#[cfg(test)]
extern crate alloc;

pub mod error;
pub mod server;

#[cfg(not(test))]
use ckb_std::default_alloc;
#[cfg(not(test))]
ckb_std::entry!(program_entry);
#[cfg(not(test))]
default_alloc!();

pub fn program_entry() -> i8 {
    drop(ckb_std::logger::init());
    match server::run_token_server() {
        Ok(_) => 0,
        Err(e) => e as i8,
    }
}
