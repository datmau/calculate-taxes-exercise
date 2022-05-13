const transactions = require('./transaction.router')

module.exports = (app) => {
    app.use('/transactions', transactions)
}