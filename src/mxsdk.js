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
const callbackurl_1 = require("./callbackurl");
exports.argv = require("minimist")(process.argv.slice(2));
const emoji = require("node-emoji");
const express = require("express");
// const cliProgress = require("cli-progress");
const postApi = [
    "/api",
    "/api/list",
    "/api/load",
    "/api/fetch",
    "/api/fetch/modules",
    "/api/delete"
], deleteApi = [
    "/api/revision",
    "/api/working_copy"
];
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
                * Startup the POST API
                * */
                app.post(postApi, (request, response) => __awaiter(this, void 0, void 0, function* () {
                    const path = request.url.split("/").slice(2);
                    if (path.length === 0) {
                        response.json({
                            post: postApi
                        });
                    }
                    else {
                        yield this.handleRequest(request, response, path);
                    }
                }));
                /*
                * Startup the DELETE API
                * */
                app.delete(deleteApi, (request, response) => __awaiter(this, void 0, void 0, function* () {
                    const path = request.url.split("/").slice(2);
                    path.unshift(`delete`);
                    if (path.length === 0) {
                        response.json({
                            post: postApi
                        });
                    }
                    else {
                        yield this.handleRequest(request, response, path);
                    }
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
            * List all Revisions
            * */
            else if (runtime.list) {
                return yield manager_1.Manager.listRevisions(runtime);
            }
            /*
            * Fetch Help
            * */
            else if (runtime.fetch === runtimearguments_1.FetchType.Help) {
                return MxSDK.renderHelp(runtimearguments_1.FetchType, `fetch expects one following options:`, runtime);
            }
            /*
            * Fetch Modules
            * */
            else if (runtime.fetch === runtimearguments_1.FetchType.Modules) {
                return yield modules_1.Modules.fetchModules(runtime);
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
            /*
            * Delete Help
            * */
            else if (runtime.delete === runtimearguments_1.DeleteType.Help) {
                return MxSDK.renderHelp(runtimearguments_1.DeleteType, `delete expects one following options:`, runtime);
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
    handleRequest(request, response, path) {
        return __awaiter(this, void 0, void 0, function* () {
            request.body._ = path;
            const runtime = new runtimearguments_1.RuntimeArguments(request.body);
            runtime.setServerDefaults();
            let result = {};
            const callbackUrl = new callbackurl_1.CallbackUrl();
            try {
                const main = new MxSDK();
                if (!runtime.callback) {
                    result = yield main.execute(runtime);
                }
                else {
                    main.execute(runtime)
                        .then((result) => {
                        result.timeStamp = runtime.startTime;
                        result.took = Date.now() - result.timeStamp;
                        callbackUrl.callback(runtime.callback, result);
                    })
                        .catch((error) => {
                        callbackUrl.callback(runtime.callback, error, true);
                    });
                    result = callbackUrl;
                }
            }
            catch (e) {
                if (!runtime.callback) {
                    runtime.error(e.message);
                }
                else {
                    callbackUrl.callback(runtime.callback, e, true);
                }
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
        if ((runtime.fetch && runtime.fetch !== runtimearguments_1.FetchType.Help)
            || runtime.load
            || ((runtime.delete === runtimearguments_1.DeleteType.Revision))) {
            runtime.assert(!!runtime.appId, `appId is missing`, true);
            runtime.assert(!!runtime.appName, `appName is missing`, true);
            runtime.assert(!!runtime.revision, `revision is missing`, true);
        }
        if (runtime.list
            || (runtime.fetch && runtime.fetch !== runtimearguments_1.FetchType.Help)
            || (runtime.delete && (runtime.delete !== runtimearguments_1.DeleteType.Help))) {
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
    static renderHelp(options, message, runtime) {
        if (runtime.json) {
            console.log({
                instructions: message,
                options
            });
        }
        else {
            runtime.log(message);
            runtime.table(options);
        }
        return {
            instructions: message,
            options
        };
    }
}
exports.MxSDK = MxSDK;
if (exports.argv._.length > 0) {
    const runtime = new runtimearguments_1.RuntimeArguments(exports.argv);
    runtime.time(`\x1b[32mTook\x1b[0m`);
    runtime.about();
    const main = new MxSDK();
    main.execute(runtime);
}
else {
    console.error(`No command passed ${JSON.stringify(exports.argv)}`);
    console.log(`Usage:
    node mxsdk.js commands --options
    Commands:
    =========
    list                                Lists revision that have been downloaded from Mendix TeamServer. Options: username, apikey
    load revision:number                Loads a revision from TeamServer. Options: appId, appName, revision, username, apikey                            
    fetch modules|entities|microflows   Fetches mx objects. Options: appId, appName, revision, username, apikey
    delete revision|working_copy        Deletes revisions & wc. Options: appId, appName, revision, username, apikey`);
}
//# sourceMappingURL=mxsdk.js.map