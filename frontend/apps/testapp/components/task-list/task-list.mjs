import {monkshu_component} from "/framework/js/monkshu_component.mjs";
import {router} from "/framework/js/router.mjs";
import {apimanager} from "/framework/js/apimanager.mjs";

const TASKS_API = "http://localhost:9090/apps/testapp/tasks";
const CREATE_TASK_API = "http://localhost:9090/apps/testapp/tasks/create";
const COMPLETE_TASK_API = "http://localhost:9090/apps/testapp/tasks/complete";
const DELETE_TASK_API = "http://localhost:9090/apps/testapp/tasks/delete";

function elementConnected(host) {
    const pageData = router.getCurrentPageData();

    task_list.setData(host.id, {
        tasks: pageData.tasks
    });
}
async function refresh(button) {
    const host = task_list.getHostElement(button);

    const response = await apimanager.rest(TASKS_API, "GET", {});

    if (!response || response.result !== true) {
        window.alert("Could not refresh tasks.");
        return;
    }

    await task_list.bindData({
        tasks: response.tasks
    }, host.id);
}

async function prepareTask(button) {
    const host = task_list.getHostElement(button);
    const root = task_list.getShadowRootByHost(host);

    const input = root.querySelector("#new-task-title");
    const message = root.querySelector("#task-message");

    const title = input.value.trim();

    if (!title) {
        message.textContent = "Please enter a task title.";
        return;
    }

    message.textContent = "Saving task...";

    const response = await apimanager.rest(
        CREATE_TASK_API,
        "POST",
        { title: title }
    );

    if (!response || response.result !== true) {
        message.textContent =
            response?.error || "Could not confirm that the task was saved.";
        return;
    }

    input.value = "";
    message.textContent = "";

    await refresh(button);
}

async function completeTask(button) {
    const id = Number(button.dataset.taskId);

    const response = await apimanager.rest(
        COMPLETE_TASK_API,
        "POST",
        { id: id }
    );

    if (!response || response.result !== true) {
        window.alert(
            response?.error || "Could not confirm task completion."
        );
        return;
    }

    await refresh(button);
}

async function deleteTask(button) {
    const id = Number(button.dataset.taskId);

    const response = await apimanager.rest(
        DELETE_TASK_API,
        "POST",
        { id: id }
    );

    if (!response || response.result !== true) {
        window.alert(
            response?.error || "Could not confirm task deletion."
        );
        return;
    }

    await refresh(button);
}

export const task_list = {
    trueWebComponentMode: true,
    elementConnected,
    refresh,
    prepareTask,
    completeTask,
    deleteTask
};

monkshu_component.register(
    "task-list",
    "/apps/testapp/components/task-list/task-list.html",
    task_list
);