module.exports = {
    string: (str) => typeof str === 'string',
    email: (str) => String(str).includes('@'),
    number: (str) => !isNaN(Number(str))
}
