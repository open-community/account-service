import base64url from 'base64url';
import { isValidBase64 } from '../helpers';
import {
    MIN_LOGIN_SIZE,
    MAX_LOGIN_SIZE,
    LOGIN_VALIDATION_REGEXP,
} from '../constants';

// ============================================================
// Module's constants and variables
const API_ID_REGEXP = /^([a-zA-Z0-9-_:]+):([a-zA-Z0-96-_]+)$/;
const ACCOUNT_TYPE_CODE = 'account';

// ============================================================
// Functions

/**
 * Check the login format
 */
function checkLogin(login) {
    const errors = [];

    if (!login) {
        errors.push('NO_LOGIN_PROVIDED');
    }
    else if (login.length < MIN_LOGIN_SIZE) {
        errors.push('LOGIN_TOO_SHORT');
    }
    else if (login.length > MAX_LOGIN_SIZE) {
        errors.push('LOGIN_TOO_LONG');
    }

    if (login && !login.match(LOGIN_VALIDATION_REGEXP)) {
        errors.push('INVALID_CHARACTERS');
    }

    return errors;
}

/**
 *
 * @param {Account} account
 * @returns {Object}
 */
function dbAccountToApi({
    id,
    login,
    creationDate,
    deletionDate,
}) {
    return {
        id: toApiId(id),
        login,
        creationDate,
        deletionDate,
    };
}

/**
 * Return the real account ID from an API ID.
 * @returns {string}
 */
function getAccountIdFromApiId(id) {
    const info = parsePublicId(id);

    if (!info) {
        return null;
    }

    if (info.type !== ACCOUNT_TYPE_CODE) {
        return null;
    }

    if (!isValidBase64(info.id)) {
        return null;
    }

    return info.id;
}

/**
 * Parse a public ID and return it's type and real id
 * @param {string} apiId
 * @returns {{type: string, id: string}}
 * @public
 */
function parsePublicId(apiId) {
    const decoded = base64url.decode(apiId);

    const match = decoded.match(API_ID_REGEXP);

    if (!match) {
        return null;
    }

    return {
        type: match[1],
        id: match[2],
    };
}

/**
 * Transform an account ID to it's API equivalent
 * @param {string} id
 * @public
 */
function toApiId(id) {
    return base64url.encode(`${ACCOUNT_TYPE_CODE}:${id}`);
}

// ============================================================
// Exports
export {
    checkLogin,
    dbAccountToApi,
    getAccountIdFromApiId,
    toApiId,
};
