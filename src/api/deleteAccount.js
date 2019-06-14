// ============================================================
// Import modules
import { Account } from '../models';
import {
    getAccountIdFromApiId,
} from './helpers';

// ============================================================
// Errors

const API_ERRORS = {
    INVALID_ID: 'Invalid ID',
};

// ============================================================
// Functions
async function deleteAccount(req, res) {
    const { id: apiId } = req.params;

    const id = getAccountIdFromApiId(apiId);

    if (!id) {
        const errors = {
            code: 'INVALID_ID',
            error: API_ERRORS.INVALID_ID,
        };

        res.status(400).json(errors);
        return;
    }

    await Account.deleteOne({ id });

    res.status(200).send();
}

// ============================================================
// Exports
export default deleteAccount;
