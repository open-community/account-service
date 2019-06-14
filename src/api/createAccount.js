// ============================================================
// Import modules

import {
    checkLogin,
    dbAccountToApi,
} from './helpers';

import {
    MAX_LOGIN_SIZE,
    MIN_LOGIN_SIZE,
    MAX_PASSWORD_SIZE,
    MIN_PASSWORD_SIZE,
} from '../constants';

import { Account } from '../models';

// ============================================================
// Module's constants and variables

const API_ERRORS = {
    LOGIN_ALREADY_USED: 'Login already used',

    NO_LOGIN_PROVIDED: 'No login provided',
    NO_PASSWORD_PROVIDED: 'No password provided',

    LOGIN_TOO_SHORT: `Login too short (min: ${MIN_LOGIN_SIZE})`,
    PASSWORD_TOO_SHORT: `Password too short (min: ${MIN_PASSWORD_SIZE})`,

    LOGIN_TOO_LONG: `Login too long (min: ${MAX_LOGIN_SIZE})`,
    PASSWORD_TOO_LONG: `Password too long (min: ${MAX_PASSWORD_SIZE})`,
};

// ============================================================
// Functions

async function createAccount(req, res) {
    const { login, password } = req.body;

    const errors = [
        ...checkLogin(login),
        ...checkPassword(password),
    ];

    if (errors.length) {
        const apiErrors = errors.map(code => ({
            code,
            detail: API_ERRORS[code],
        }));

        res.status(400).json(apiErrors);
        return;
    }

    // Checking that the login is not already used
    const nbAccounts = await Account.countDocuments({
        login,
        deletionDate: null,
    });

    if (nbAccounts > 0) {
        const code = 'LOGIN_ALREADY_USED';
        const apiErrors = [{
            code,
            detail: API_ERRORS[code],
        }];

        res.status(400).json(apiErrors);
        return;
    }

    const account = await Account.createAccount({
        login,
        password,
    });

    await account.save();

    res.status(200).json(dbAccountToApi(account));
}

function checkPassword(password) {
    const errors = [];

    if (!password) {
        errors.push('NO_PASSWORD_PROVIDED');
    }
    else if (password.length < MIN_PASSWORD_SIZE) {
        errors.push('PASSWORD_TOO_SHORT');
    }
    else if (password.length > MAX_PASSWORD_SIZE) {
        errors.push('PASSWORD_TOO_LONG');
    }

    return errors;
}

// ============================================================
// exports
export default createAccount;
