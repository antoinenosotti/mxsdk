"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtimearguments_1 = require("./runtimearguments");
const runtime = new runtimearguments_1.RuntimeArguments({ props: require('minimist')(process.argv.slice(2)) });
const modules_1 = require("./fetch/modules");
const workingcopymanager_1 = require("./workingcopymanager");
runtime.time(`Took`);
runtime.about();
/*
* Assert Call Arguments
* */
if (runtime.fetch) {
    runtime.assert(!!runtime.appId, `appId is missing`, true);
    runtime.assert(!!runtime.appName, `appName is missing`, true);
    if (runtime.hasErrors) {
        process.exit(0);
    }
}
if (runtime.list || runtime.fetch) {
    runtime.assert(!!runtime.username, `username is missing`, true);
    runtime.assert(!!runtime.apiKey, `apiKey is missing`, true);
    if (runtime.hasErrors) {
        throw new Error(`There were some errors. Exiting`);
    }
}
/*
* List
* */
if (runtime.list) {
    workingcopymanager_1.WorkingCopyManager.listWorkingCopies(runtime);
}
/*
* Fetch
* */
else if (runtime.fetch) {
    if (runtime.fetch === runtimearguments_1.FetchType.Modules) {
        modules_1.Modules.fetchModules(runtime);
    }
}
runtime.timeEnd(`Took`);
//# sourceMappingURL=mxsdk.js.map