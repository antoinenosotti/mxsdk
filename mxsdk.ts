import {FetchType, RuntimeArguments} from "./runtimearguments";
const runtime = new RuntimeArguments({props: require('minimist')(process.argv.slice(2))});

import { Modules } from "./fetch/modules";
import {WorkingCopyManager} from "./workingcopymanager";
import {Load} from "./fetch/load";

runtime.time(`Took`);
runtime.about();

/*
* Assert Call Parameters
* */

if (runtime.fetch || runtime.load) {
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
* List Revisions
* */
if (runtime.list) {
    WorkingCopyManager.listWorkingCopies(runtime);
}

/*
* Fetch all manner of things
* */

else if (runtime.fetch) {
    if (runtime.fetch === FetchType.Modules) {
        Modules.fetchModules(runtime);
    }
}

/*
* Load a Revision
* */

else if (runtime.load) {
    Load.loadRevision(runtime);
}