const taskdb = require("../lib/taskdb.js");

exports.doService = async function (request) {
    if (!request || !Number.isSafeInteger(request.id) || request.id <= 0) {
        return {
            result: false,
            error: "A valid task ID is required."
        };
    }

    const database = await taskdb.getDB();

    const updated = await database.runCmd(
        "UPDATE tasks SET completed = 1 WHERE id = ?",
        [request.id]
    );

    if (!updated) {
        throw new Error("Could not complete the task.");
    }

    return { result: true };
};