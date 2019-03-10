"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const runtimearguments_1 = require("./runtimearguments");
exports.argv = require("minimist")(process.argv.slice(2));
const modules_1 = require("./src/commands/fetch/modules");
const manager_1 = require("./src/commands/workingcopy/manager");
const load_1 = require("./src/commands/fetch/load");
class Main {
    static run(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield manager_1.Manager.listWorkingCopies(runtime);
            }
            /*
            * Fetch all manner of things
            * */
            else if (runtime.fetch) {
                if (runtime.fetch === runtimearguments_1.FetchType.Modules) {
                    yield modules_1.Modules.fetchModules(runtime);
                }
            }
            /*
            * Load a Revision
            * */
            else if (runtime.load) {
                yield load_1.Load.loadRevision(runtime);
            }
        });
    }
}
exports.Main = Main;
if (Object.keys(exports.argv).length > 1) {
    const runtime = new runtimearguments_1.RuntimeArguments({ props: exports.argv });
    runtime.time(`\x1b[32mTook\x1b[0m`);
    runtime.about();
    Main.run(runtime);
}
//# sourceMappingURL=mxsdk.js.map