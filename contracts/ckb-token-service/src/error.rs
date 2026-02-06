//! Error types for the token service

#[repr(i8)]
pub enum Error {
    Unknown = 1,
    ServerError = 2,
    StorageError = 3,
}
