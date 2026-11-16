const taskdb = require("../lib/taskdb.js");


exports.doService = async function () {
    // const tasks = [
    //     { id: 1, title: "Understand Monkshu startup" },
    //     { id: 2, title: "Learn how Monkshu loads a page" }
    // ];

    const database = await taskdb.getDB();

    const tasks = await database.getQuery(
        "SELECT id, title, completed FROM tasks ORDER BY id"
    );

    if (tasks === false) {
        throw new Error("Could not read tasks.");
    }

    return {
        result: true,
        tasks: tasks
    };
};