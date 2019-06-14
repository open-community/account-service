// ============================================================
// Import modules
import createAccount from './createAccount';
import deleteAccount from './deleteAccount';
import getAccount from './getAccount';
import listAccount from './listAccounts';
import updateAccount from './updateAccount';
import { BASE64_REGEXP } from '../constants';

// ============================================================
// Functions
function routes(app) {
    let route;

    // /accounts
    route = '/accounts';
    app.get(route, listAccount);

    // /account
    route = '/account';
    app.put('/account', createAccount);

    // account/:id
    route = `/account/:id`;
    app.get(route, getAccount);
    app.delete(route, deleteAccount);
    app.post(route, updateAccount);
}

// ============================================================
// Exports
export default routes;
