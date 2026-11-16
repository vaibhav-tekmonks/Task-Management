const path = require("path");
const schema = require("./schema.js");
const db = require(`${CONSTANTS.LIBDIR}/db.js`);

const databasePath = path.resolve(__dirname, "../db/tasks.db");

const database = db.getDBDriver(
    "sqlite",
    databasePath,
    schema
);

let initialization;

exports.getDB = async function () {
    if (!initialization) {
        initialization = database.init();
    }

    await initialization;
    return database;
};