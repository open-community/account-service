// ============================================================
// Import packages
import { Schema } from 'mongoose';

import { AccountLockedError } from '../errors';

import { NB_PASSWORD_CHECK_BEFORE_LOCK } from '../constants';

import {
    generateAccountId,
    generatePasswordSalt,
    hashPassword,
} from '../helpers';

// ============================================================
// Schema
const AccountSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },

    login: {
        type: String,
        required: true,
    },

    auth: {
        password: {
            type: String,
        },

        salt: {
            type: String,
        },

        nbInvalidAttempts: {
            type: Number,
            default: 0,
        },
    },

    deletionDate: Date,
    creationDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

// ============================================================
// Methods

/**
 * Indicate if the account is locked or not.
 * @public
 */
AccountSchema.methods.isLocked = function isLocked() {
    return this.auth.nbInvalidAttempts >= NB_PASSWORD_CHECK_BEFORE_LOCK;
};

/**
 * Indicate if the given password match the account password
 * @public
 */
AccountSchema.methods.isPasswordEqual = async function isPasswordEqual(password) {
    if (this.isLocked()) {
        throw new AccountLockedError();
    }

    // If no password, then the check will always fail
    if (!this.auth.password) {
        return false;
    }

    const hash = await hashPassword(password, this.salt);

    const isEqual = hash === this.auth.hash;

    const shouldUpdateAttemptNumber = !isEqual || this.auth.nbInvalidAttempts > 0;

    // Updating the attempt number
    if (shouldUpdateAttemptNumber) {
        const nbInvalidAttempts = isEqual
            ? 0
            : this.auth.nbInvalidAttempts + 1;

        await this.update({
            auth: {
                nbInvalidAttempts,
            },
        });

        await this.save();
    }

    return isEqual;
};

/**
 * Update the account password.
 * The document will not be saved.
 * @param {string} password - New account password.
 * @public
 */
AccountSchema.methods.updatePassword = async function updatePassword(password) {
    const salt = generatePasswordSalt();
    const hash = await hashPassword(password, salt);

    this.auth.hash = hash;
    this.auth.salt = salt;
};

/**
 * Unlock the account by setting the number of invalid attempts to 0.
 * The document will not be saved.
 * @public
 */
AccountSchema.methods.unlock = async function unlock() {
    this.auth.nbInvalidAttempts = 0;
};

// ============================================================
// Statisc
/**
 * Create a new account.
 * @public
 */
AccountSchema.statics.createAccount = async function createAccount({
    login,
    password,
}) {
    const account = await this.create({
        id: generateAccountId(),
        login,
        auth: {
            nbInvalidAttempts: 0,
        },
    });

    await account.updatePassword(password);

    return account;
};

// ============================================================
// Exports
export default AccountSchema;
