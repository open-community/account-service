import base64url from 'base64url';
import { isValidBase64 } from '../helpers';
import {
    MIN_LOGIN_SIZE,
    MIN_PASSWORD_SIZE,
    MAX_LOGIN_SIZE,
    MAX_PASSWORD_SIZE,
    LOGIN_VALIDATION_REGEXP,
} from '../constants';

import { ApiErrors } from './errors';

// ============================================================
// Module's constants and variables
const API_ID_REGEXP = /^([a-zA-Z0-9-_:]+):([a-zA-Z0-9-_]+)$/;
const ACCOUNT_TYPE_CODE = 'account';

// ============================================================
// Functions

function checkDates(datesString) {
    const invalidDates = [];

    const dates = datesString.map((dateString) => {
        if (!dateString) {
            return null;
        }

        const date = new Date(dateString);


        if (Number.isNaN(date.getTime())) {
            invalidDates.push(dateString);
            return null;
        }

        return date;
    });

    return [
        dates,
        _.uniq(invalidDates),
    ];
}

/**
 * Check the login format
 */
function checkLogin(login) {
    const errors = [];

    if (!login) {
        errors.push(ApiErrors.NO_LOGIN_PROVIDED);
    }
    else if (login.length < MIN_LOGIN_SIZE) {
        errors.push(ApiErrors.LOGIN_TOO_SHORT);
    }
    else if (login.length > MAX_LOGIN_SIZE) {
        errors.push(ApiErrors.LOGIN_TOO_LONG);
    }

    if (login && !login.match(LOGIN_VALIDATION_REGEXP)) {
        errors.push(ApiErrors.INVALID_CHARACTERS);
    }

    return errors;
}

function checkPassword(password) {
    const errors = [];

    if (!password) {
        errors.push(ApiErrors.NO_PASSWORD_PROVIDED);
    }
    else if (password.length < MIN_PASSWORD_SIZE) {
        errors.push(ApiErrors.PASSWORD_TOO_SHORT);
    }
    else if (password.length > MAX_PASSWORD_SIZE) {
        errors.push(ApiErrors.PASSWORD_TOO_LONG);
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
    checkDates,
    checkLogin,
    checkPassword,
    dbAccountToApi,
    getAccountIdFromApiId,
    toApiId,
};
