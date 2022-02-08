require('dotenv').config();
const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        port: process.env.PORT || 9999,
        dbURL: process.env.DATABASE_URL,
        cookieSecret: process.env.COOKIE_SECRET,
        tokenSecret: process.env.TOKEN_SECRET,
        authCookieName: 'x-auth-token'
    },
    production: {}
};

module.exports = config[env];