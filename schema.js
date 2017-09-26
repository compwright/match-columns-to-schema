const validators = require('./validators')

module.exports = {
    firstName: {
        aliases: ['nameFirst', 'first'],
        validator: validators.string
    },
    lastName: {
        aliases: ['nameLast', 'last'],
        validator: validators.string
    },
    email: {
        validator: validators.email
    },
    latitude: {
        aliases: ['lat'],
        validator: validators.number
    },
    longitude: {
        aliases: ['lng', 'long'],
        validator: validators.number
    },
    address: {
        aliases: ['streetaddress', 'street', 'address1'],
        validator: validators.string
    },
    city: {
        validator: validators.string
    },
    state: {
        validator: validators.string
    },
    zip: {
        aliases: ['zipcode', 'postalcode'],
        validator: validators.number
    }
}
