const Router = require('express-promise-router')
const router = new Router()
const { list, getTransactions, deleteEntry, updateEntry, createEntry, getSummarizedTimeRange } = require('../controllers/transactions.controller')

router.get('/:clientId/events', getTransactions)
router.put('/:clientId', updateEntry)
router.delete('/:clientId', deleteEntry);
router.post('/', createEntry)
router.get('/', list)
router.get('/:clientId/summary', getSummarizedTimeRange)



module.exports = router
