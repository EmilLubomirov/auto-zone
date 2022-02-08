const jwt = require('jsonwebtoken');
const config = require('../config/config');

function createToken(data) {
    return jwt.sign(data, config.tokenSecret, { expiresIn: '1h' });
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.tokenSecret, (err, data) => {
            if (err) { reject(err); return; }
            resolve(data);
        });
    });
}

module.exports = {
    createToken,
    verifyToken
};