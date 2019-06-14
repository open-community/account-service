// ============================================================
// Import modules
import createAccount from './createAccount';
import listAccount from './listAccounts';

// ============================================================
// Functions
function routes(app) {
    app.get('/accounts', listAccount);
    app.put('/account', createAccount);
}

// ============================================================
// Exports
export default routes;
