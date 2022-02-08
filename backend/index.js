const config = require('./config/config');
const dbConnection = require('./config/database');
const { insertUserRoles, insertProductTags, insertServiceTags, insertDeliveries } = require('./utils/db');

const app = require('express')();

dbConnection().then(() => {

    require('./config/express')(app);

    require('./config/routes')(app);

    app.use(function (err, req, res, next) {
        console.error(err);
        res.status(500).send(err.message);
        console.log('*'.repeat(90))
    });

    insertUserRoles().then(() => {
        console.log("User roles inserted")  // Success
    }).catch((error) => {
        console.log(error)      // Failure
    });

    insertProductTags().then(() => {
        console.log("Product tags inserted")  // Success
    }).catch((error) => {
        console.log(error)      // Failure
    });

    insertServiceTags().then(() => {
        console.log("Service tags inserted")  // Success
    }).catch((error) => {
        console.log(error)      // Failure
    });

    insertDeliveries().then(() => {
        console.log("Deliveries inserted")  // Success
    }).catch((error) => {
        console.log(error)      // Failure
    });

    app.listen(config.port, console.log(`Listening on port ${config.port}!`))

}).catch(console.error);