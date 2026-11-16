const taskdb = require("../lib/taskdb.js");

exports.doService = async function (request) {
    if (!request || typeof request.title !== "string") {
        return {
            result: false,
            error: "A task title is required."
        };
    }

    const title = request.title.trim();

    if (!title) {
        return {
            result: false,
            error: "The task title cannot be empty."
        };
    }

    const database = await taskdb.getDB();

    const saved = await database.runCmd(
        "INSERT INTO tasks (title) VALUES (?)",
        [title]
    );

    if (!saved) {
        throw new Error("Could not save the task.");
    }

    return { result: true };
};