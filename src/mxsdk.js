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
const emoji = require("node-emoji");
const express = require("express");
const modules_1 = require("./commands/fetch/modules");
const manager_1 = require("./commands/workingcopy/manager");
const load_1 = require("./commands/fetch/load");
class Main {
    run(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            * Assert Call Parameters
            * */
            if (runtime.fetch || runtime.load) {
                runtime.assert(!!runtime.appId, `appId is missing`, true);
                runtime.assert(!!runtime.appName, `appName is missing`, true);
            }
            if (runtime.list || runtime.fetch) {
                runtime.assert(!!runtime.username, `username is missing`, true);
                runtime.assert(!!runtime.apiKey, `apiKey is missing`, true);
            }
            if (runtime.serve) {
                runtime.assert(!!runtime.host, `host is missing`, true);
                runtime.assert(!!runtime.port, `port is missing`, true);
            }
            if (runtime.hasErrors) {
                throw new Error(`There were some errors. Exiting`);
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
                    const runtime = new runtimearguments_1.RuntimeArguments(request.body);
                    runtime.setServerDefaults();
                    const startTime = Date.now();
                    try {
                        const main = new Main();
                        const result = yield main.run(runtime);
                        // @ts-ignore
                        result.took = Date.now() - startTime;
                        result.timestamp = startTime;
                        if (runtime.json) {
                            response.json(result);
                        }
                        else {
                            response.send(result);
                        }
                    }
                    catch (e) {
                        response.status(500);
                        response.json({
                            error: {
                                message: e.message,
                                details: runtime.errorLog
                            },
                            took: Date.now() - startTime,
                            timestamp: startTime
                        });
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
            }
            /*
            * Fetch all manner of things
            * */
            else if (runtime.list) {
                const result = yield manager_1.Manager.listRevisions(runtime);
                return result;
            }
            /*
            * Fetch all manner of things
            * */
            else if (runtime.fetch) {
                if (runtime.fetch === runtimearguments_1.FetchType.Modules) {
                    const result = yield modules_1.Modules.fetchModules(runtime);
                    return result;
                }
            }
            /*
            * Load a Revision
            * */
            else if (runtime.load) {
                const result = yield load_1.Load.loadRevision(runtime);
                return result;
            }
        });
    }
}
exports.Main = Main;
if (Object.keys(exports.argv).length > 1) {
    const runtime = new runtimearguments_1.RuntimeArguments(exports.argv);
    runtime.time(`\x1b[32mTook\x1b[0m`);
    runtime.about();
    const main = new Main();
    main.run(runtime);
}
//# sourceMappingURL=mxsdk.js.map