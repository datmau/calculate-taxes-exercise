const { existsSync, readFileSync, writeFileSync } = require('fs')
const { join, dirname } = require('path')
const { filterByDate, calculateTaxes } = require('../utils/calculateVariables.utils')
const appDir = dirname(require.main.filename)
let entities = []
const create = async (req, res, next) => {
    try {
        if (entities.length === 0) {
            load()
        }
        const object = Object.entries(req.body)

        entities = { ...entities, [object[0][0]]: object[0][1] }
        save()
        return res.status(200).json(entities)
    } catch (error) {
        next(error)
    }
}

const deleteEntry = async (req, res, next) => {
    try {
        const id = req.params.clientId
        const index = findIndex(id)
        entities.splice(index, 1)
        return res.status(200).send({ message: 'Object deleted Sucessfully' })
    } catch (error) {
        next(error)
    }
}

const get = async (req, res, next) => {
    try {
        if (entities.length === 0) {
            load()
        }
        const id = req.params.clientId
        if (id && entities[id]) {
            return res.status(200).json(entities[id])
        }
        return res
            .status(404)
            .send({ message: `Object not found whith id ${id}` })
    } catch (error) {
        next(error)
    }
}
const list = async (req, res, next) => {
    try {
        if (entities.length === 0) {
            load()
        }
        return res.status(200).json(entities)
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        if (entities.length === 0) {
            load()
        }
        const id = req.params.clientId
        const entity = req.body
        entities[id] = [...entities[id], req.body]
        save()
        return res.status(200).json({ message: 'Updated' })
    } catch (error) {
        next(error)
    }
}

const load = () => {
    const file = join(appDir, 'data', '1payloadTest (1).json')
    if (existsSync(file) && entities.length === 0) {
        entities = JSON.parse(readFileSync(file, { encoding: 'utf8' }))
    }
}

const save = async (req, res, next) => {
    const file = join(appDir, 'data', '1payloadTest (1).json')
    try {
        writeFileSync(file, JSON.stringify(entities, null, 2), {
            encoding: 'utf8',
        })
    } catch (error) {
        next(error)
    }
}

const findIndex = (id) => {
    const index = entities[id]
    if (index === -1) {
        throw new Error(`No transactions found with id ${id}`)
    }
    return index
}

const getSummarizedTimeRange = (req, res, next) => {
    try {
        if (entities.length === 0) {
            load()
        }
        const id = req.params.clientId
        if (!req.query) {
            return res
                .status(404)
                .send({ message: 'We need to provide start and end dates' })
        }
        const { startDate, endDate } = req.query;
        const filteredEvents = filterByDate(entities[id], startDate, endDate)
        const summarizedTaxes = calculateTaxes(filteredEvents)
        return res
            .status(200)
            .send({ clientId: 2, taxesAmount: summarizedTaxes })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    list,
    getTransactions: get,
    deleteEntry,
    updateEntry: update,
    createEntry: create,
    getSummarizedTimeRange
}
