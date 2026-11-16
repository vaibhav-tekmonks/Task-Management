const taskdb = require("../lib/taskdb.js");

exports.doService = async function (request) {
    if (!request || !Number.isSafeInteger(request.id) || request.id <= 0) {
        return {
            result: false,
            error: "A valid task ID is required."
        };
    }

    const database = await taskdb.getDB();

    const deleted = await database.runCmd(
        "DELETE FROM tasks WHERE id = ?",
        [request.id]
    );

    if (!deleted) {
        throw new Error("Could not delete the task.");
    }

    return { result: true };
};