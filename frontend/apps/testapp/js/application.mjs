import {router} from "/framework/js/router.mjs";
import {securityguard} from "/framework/js/securityguard.mjs";
import {i18n} from "/framework/js/i18n.mjs";
import {apimanager} from "/framework/js/apimanager.mjs";

const TASKS_PAGE = new URL("./tasks.html", window.location).href;
const TASKS_API = "http://localhost:9090/apps/testapp/tasks";

function init() {
    i18n.setSessionLang("en");

    securityguard.setPermissionsMap({
        guest: [TASKS_PAGE]
    });

    securityguard.setCurrentRole("guest");
}

async function main() {
    const response = await apimanager.rest(TASKS_API, "GET", {});

    if (!response || response.result !== true) {
        document.getElementById("startup-status").textContent =
            "Could not load tasks.";
        return;
    }

    await router.loadPage(TASKS_PAGE, {
        tasks: response.tasks
    });
}

export const application = { init, main };