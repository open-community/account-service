// ============================================================
// Constants

const NB_PASSWORD_CHECK_BEFORE_LOCK = 5;

const MIN_LOGIN_SIZE = 5;
const MAX_LOGIN_SIZE = 128;

const MIN_PASSWORD_SIZE = 6;
const MAX_PASSWORD_SIZE = 128;

const LOGIN_VALIDATION_REGEXP = /^[a-zA-Z0-9@+.-_]+$/;

// ============================================================
// Exports
export {
    LOGIN_VALIDATION_REGEXP,
    MAX_LOGIN_SIZE,
    MAX_PASSWORD_SIZE,
    MIN_LOGIN_SIZE,
    MIN_PASSWORD_SIZE,
    NB_PASSWORD_CHECK_BEFORE_LOCK,
};
