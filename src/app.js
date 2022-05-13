const express = require('express')
const routes = require('./routes')
const { errorHandler } = require('./errorHandler')
const app = express()

app.use(express.json());
routes(app);

app.use(async (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    errorHandler.handleError(err, req, res) //The error handler will send a response
})

process.on('uncaughtException', (error) => {
    errorHandler.handleError(error)
})

process.on('unhandledRejection', (reason) => {
    errorHandler.handleError(reason)
})

app.listen(5000, () => {
    console.log('server is listening on port 5000')
})
