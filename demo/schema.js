const validators = require('./validators');

module.exports = {
  firstName: {
    label: 'First Name',
    aliases: ['nameFirst', 'first'],
    validator: validators.string
  },
  lastName: {
    label: 'Last Name',
    aliases: ['nameLast', 'last'],
    validator: validators.string
  },
  email: {
    label: 'E-Mail Address',
    validator: validators.email
  },
  latitude: {
    label: 'Latitude',
    aliases: ['lat'],
    validator: validators.number
  },
  longitude: {
    label: 'Longitude',
    aliases: ['lng', 'long'],
    validator: validators.number
  },
  address: {
    label: 'Address',
    aliases: ['streetaddress', 'street', 'address1'],
    validator: validators.string
  },
  city: {
    label: 'City',
    validator: validators.string
  },
  state: {
    label: 'State',
    validator: validators.string
  },
  zip: {
    label: 'Zipcode',
    aliases: ['zipcode', 'postalcode'],
    validator: validators.number
  }
};
