const moment = require('moment')

const calculateInsurance = (events) => {
    const basePriceSummarized = events.reduce((acc, item) => {
        if (item.amount > 100) {
            acc += parseInt(item.amount)
        }
        return acc
    })
    return basePriceSummarized * 0.05
}

const calculateServices = (events) => {
    const services = events.reduce((acc, item) => {
        const base = parseInt(item.amount)
        const serviceTax = base * 0.02
        if (events.length > 4) {
            acc = parseInt(item.amount) + serviceTax + 0.25
        } else {
            acc = parseInt(item.amount) + serviceTax
        }
    })
    return services
}

const calculateCommisions = (events) => {
    const calculateCommisions = events.reduce((acc, item) => {
        if (item.lastEvent.type === 'debit') {
            acc += (parseInt(item.amount) * 0.05)
        }

        if (item.lastEvent.type === 'credit') {
            acc += (parseInt(item.amount) * 0.17)
        }

        return acc
    })
    return calculateCommisions
}

const calculateIva = (events) => {
    const iva = events.reduce((acc, item) => {
        acc += parseInt(item.amount) * 0.12
        return acc
    })
    return iva
}

const filterByDate = (events, startDate, endDate) => {
    const formatedStartDate = moment(startDate)
    const formatedEndDate = moment(endDate)
    const filteredEvents = events.map((event) => {
        const compareDate = moment(event.datetime)
        if (compareDate.isBetween(formatedStartDate, formatedEndDate)) {
            return event
        }
    })
    return filteredEvents
}

const calculateTaxes = (events) => {
    return (
        calculateCommisions(events) +
        calculateInsurance(events) +
        calculateServices(events) +
        calculateIva(events)
    )
}
module.exports = {
    filterByDate,
    calculateTaxes,
}
