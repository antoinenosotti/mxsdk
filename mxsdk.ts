import { FetchType, RuntimeArguments } from "./runtimearguments";
export const argv = require("minimist")(process.argv.slice(2));

import { Modules } from "./src/commands/fetch/modules";
import { Manager } from "./src/commands/workingcopy/manager";
import { Load } from "./src/commands/fetch/load";

export class Main {
    public static async run(runtime: RuntimeArguments) {
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
            await Manager.listWorkingCopies(runtime);
        }

        /*
        * Fetch all manner of things
        * */

        else if (runtime.fetch) {
            if (runtime.fetch === FetchType.Modules) {
                await Modules.fetchModules(runtime);
            }
        }

        /*
        * Load a Revision
        * */

        else if (runtime.load) {
            await Load.loadRevision(runtime);
        }
    }
}

if (Object.keys(argv).length > 1) {
    const runtime = new RuntimeArguments({props: argv});
    runtime.time(`\x1b[32mTook\x1b[0m`);
    runtime.about();
    Main.run(runtime);
}