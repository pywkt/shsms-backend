var whitelist = [
    'capacitor://localhost',
    'capacitor://localhost:3000',
    'http://localhost',
    'http://localhost:3000',
    `${process.env.DEV_SERVER}:${process.env.PORT}`,
    'https://twilio.com'
]

var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed'))
        }
    }
}

const corsSocketOptions = {
    cors: {
        origin: whitelist
    }
}

module.exports = { corsOptions, corsSocketOptions }