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
const modules_1 = require("./commands/fetch/modules");
const manager_1 = require("./commands/workingcopy/manager");
const load_1 = require("./commands/fetch/load");
exports.argv = require("minimist")(process.argv.slice(2));
const emoji = require("node-emoji");
const express = require("express");
// const cliProgress = require("cli-progress");
class MxSDK {
    execute(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!MxSDK.validate(runtime)) {
                if (runtime.shutdownOnValidation !== false) {
                    console.error(`There were some errors. Exiting`);
                    process.exit();
                }
                else {
                    runtime.runtimeError.message = "There were some validation errors.";
                    runtime.runtimeError.code = "INPUT-400";
                    runtime.runtimeError.statusCode = 400;
                    return runtime.runtimeError;
                }
            }
            /*
            * List Revisions
            * */
            if (runtime.serve) {
                const app = express(), bodyParser = require("body-parser"), swaggerUi = require("swagger-ui-express"), swaggerDocument = require("./swagger.json");
                /*
                * Setup Swagger API Docs
                * */
                app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
                /*
                * Setup JSON and Static web pages
                * */
                app.use(bodyParser.urlencoded({ extended: true }));
                app.use(bodyParser.json());
                app.use("/", express.static("public"));
                /*
                * Startup the API
                * */
                app.post("/api", (request, response) => __awaiter(this, void 0, void 0, function* () {
                    yield this.handleRequest(request, response, {});
                }));
                app.post("/api/list", (request, response) => __awaiter(this, void 0, void 0, function* () {
                    yield this.handleRequest(request, response, {
                        list: true
                    });
                }));
                app.listen(runtime.port, runtime.host, (err) => {
                    if (err) {
                        return console.log("something bad happened", err);
                    }
                    else {
                        runtime.red(`\n\t\t\t\t         _/\\_\n\t\t\t\t       __\\  /__\n\t\t\t\t      <_      _>\n\t\t\t\t        |/ )\\|\n\t\t\t\t          /`);
                        runtime.green(emoji.emojify(`Now serving to the world :earth_africa: at ${runtime.host}:${runtime.port}!`));
                    }
                });
                return {
                    status: "API Rest Service Started"
                };
            }
            /*
            * Fetch all manner of things
            * */
            else if (runtime.list) {
                return yield manager_1.Manager.listRevisions(runtime);
            }
            /*
            * Fetch all manner of things
            * */
            else if (runtime.fetch) {
                if (runtime.fetch === runtimearguments_1.FetchType.Modules) {
                    return yield modules_1.Modules.fetchModules(runtime);
                }
            }
            /*
            * Load a Revision
            * */
            else if (runtime.load) {
                runtime.log(`Loading revision ${runtime.revision}`);
                return yield load_1.Load.loadRevision(runtime);
            }
            /*
            * Delete a Working Copy
            * */
            else if (runtime.delete === runtimearguments_1.DeleteType.WorkingCopy) {
                runtime.log(`Deleting working copy ${runtime.workingCopyId} ${runtime.revision}`);
                return yield manager_1.Manager.deleteWorkingCopy(runtime);
            }
            /*
            * Delete a Working Copy
            * */
            else if (runtime.delete === runtimearguments_1.DeleteType.Revision) {
                runtime.log(`Deleting revision ${runtime.revision}`);
                return yield manager_1.Manager.deleteRevision(runtime);
            }
            else {
                const result = {
                    error: {
                        message: "No command received for payload"
                    }
                };
                if (runtime.json) {
                    console.log(JSON.stringify(result));
                }
                else {
                    runtime.error(`No command specified!`);
                }
                return result;
            }
        });
    }
    handleRequest(request, response, defaults) {
        return __awaiter(this, void 0, void 0, function* () {
            const runtime = new runtimearguments_1.RuntimeArguments(request.body);
            runtime.setServerDefaults(defaults);
            let result = {};
            try {
                const main = new MxSDK();
                result = yield main.execute(runtime);
            }
            catch (e) {
                runtime.error(e.message);
            }
            if (runtime.hasErrors()) {
                response.status(runtime.runtimeError.statusCode || 500);
            }
            response.json(runtime.safeReturnOrError(result));
        });
    }
    static validate(runtime) {
        /*
        * Assert Call Parameters
        * */
        if (runtime.fetch || runtime.load || (runtime.delete === runtimearguments_1.DeleteType.Revision)) {
            runtime.assert(!!runtime.appId, `appId is missing`, true);
            runtime.assert(!!runtime.appName, `appName is missing`, true);
            runtime.assert(!!runtime.revision, `revision is missing`, true);
        }
        if (runtime.list || runtime.fetch || runtime.delete) {
            runtime.assert(!!runtime.username, `username is missing`, true);
            runtime.assert(!!runtime.apiKey, `apiKey is missing`, true);
        }
        if (runtime.serve) {
            runtime.assert(!!runtime.host, `host is missing`, true);
            runtime.assert(!!runtime.port, `port is missing`, true);
        }
        if (runtime.delete === runtimearguments_1.DeleteType.WorkingCopy) {
            runtime.assert(!!runtime.workingCopyId, `workingCopyId is missing`, true);
        }
        if (runtime.delete === runtimearguments_1.DeleteType.Revision) {
            runtime.assert(!!runtime.revision, `revision is missing`, true);
        }
        return !runtime.hasErrors();
    }
}
exports.MxSDK = MxSDK;
if (Object.keys(exports.argv).length > 1) {
    const runtime = new runtimearguments_1.RuntimeArguments(exports.argv);
    runtime.time(`\x1b[32mTook\x1b[0m`);
    runtime.about();
    const main = new MxSDK();
    main.execute(runtime);
}
//# sourceMappingURL=mxsdk.js.map