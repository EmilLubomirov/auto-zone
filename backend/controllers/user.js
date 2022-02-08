const models = require('../models');
const config = require('../config/config');
const utils = require('../utils');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { getCollectionDocumentsCount } = require("../utils/db");

module.exports = {

    verifyLogin: async (req, res, next) =>{

        let authToken = req.headers.authorization;

        if (authToken.startsWith('Bearer')){
            authToken = authToken.split(' ')[1];
        }

        if (!authToken){
            return false;
        }

        try {
            const decodedToken = await utils.jwt.verifyToken(authToken);
            return res.send(decodedToken);
        }
        catch (e) {
            next(e);
        }
    },
    get: (req, res, next) => {
        models.User.find()
            .then((users) => res.send(users))
            .catch(next)
    },

    post: {
        register: async (req, res, next) => {

            const { username, password, rePassword } = req.body;

            if  (!(username && password && rePassword)){
                res.sendStatus(500);
                return;
            }

            if (password !== rePassword){
                res.sendStatus(500);
                return;
            }

            try {

                const userByUsername =  await models.User.findOne({
                    username: username
                });

                if (userByUsername){
                    res.status(409).send({success: false, error: {message: 'User already exists'}});
                    return;
                }

                const usersCount = await getCollectionDocumentsCount('users');
                const userRole =  await models.Role.findOne({
                    name: "USER"
                });

                let roles = [ObjectId(userRole._id)];

                if (usersCount === 0){
                    const adminRole =  await models.Role.findOne({
                        name: "ADMIN"
                    });

                    roles.push(ObjectId(adminRole._id));
                }

                const createdUser =  await models.User.create({
                    username,
                    password,
                    roles
                });

                res.status(201).send(createdUser);
            }

            catch (e) {
                next(e);
            }
        },

        login: (req, res, next) => {
            const { username, password, isFacebook } = req.body;

            models.User.findOne({ username })
                .then((user) => Promise.all([user, !isFacebook ? (user ? user.matchPassword(password) : false) : true]))
                .then(([user, match]) => {
                    if (!match) {
                        res.status(401).send('User does not exist');
                        return;
                    }

                    models.Role.findOne({
                        name: "ADMIN"
                    }).then(role => {
                        const isAdmin = JSON.stringify(user.roles).includes(JSON.stringify(role._id));

                        const token = utils.jwt.createToken({ id: user._id, username: user.username, isAdmin });
                        res.header("Authorization", token).send({
                            user,
                            isAdmin
                        });
                    });
                })
                .catch(next);
        },

        logout: (req, res, next) => {
            const token = req.cookies[config.authCookieName];
            console.log('-'.repeat(100));
            console.log(token);
            console.log('-'.repeat(100));
            models.TokenBlacklist.create({ token })
                .then(() => {
                    res.clearCookie(config.authCookieName).send('Logout successfully!');
                })
                .catch(next);
        }
    },

    put: (req, res, next) => {
        const id = req.params.id;
        const { username, password } = req.body;
        models.User.update({ _id: id }, { username, password })
            .then((updatedUser) => res.send(updatedUser))
            .catch(next)
    },

    delete: (req, res, next) => {
        const id = req.params.id;
        models.User.deleteOne({ _id: id })
            .then((removedUser) => res.send(removedUser))
            .catch(next)
    }
};