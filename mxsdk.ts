import {FetchType, RuntimeArguments} from "./runtimearguments";
const runtime = new RuntimeArguments({props: require('minimist')(process.argv.slice(2))});

import { Modules } from "./fetch/modules";
import {WorkingCopyManager} from "./workingcopymanager";

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
    WorkingCopyManager.listWorkingCopies(runtime);
}

/*
* Fetch
* */

else if (runtime.fetch) {
    if (runtime.fetch === FetchType.Modules) {
        Modules.fetchModules(runtime);
    }
}

runtime.timeEnd(`Took`);