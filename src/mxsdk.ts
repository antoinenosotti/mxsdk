import { DeleteType, FetchType, ListType, Runtime } from "./runtime";
import { Modules } from "./commands/fetch/modules";
import { Manager } from "./commands/workingcopy/manager";
import { Load } from "./commands/fetch/load";
import { CallbackUrl } from "./callbackurl";
import { Microflows } from "./commands/fetch/microflows";

export const argv = require("minimist")(process.argv.slice(2));
const emoji = require("node-emoji");
const express = require("express");

const
    postApi = [
        "/api",
        "/api/list",
        "/api/list/working_copy",
        "/api/list/revision",
        "/api/load",
        "/api/fetch",
        "/api/fetch/modules",
        "/api/fetch/microflows",
        "/api/delete"],
    deleteApi = [
        "/api/revision",
        "/api/working_copy"
    ];

export class MxSDK {
    public async execute(runtime: Runtime) {
        let executeResult: any = {};
        if (!MxSDK.validate(runtime)) {
            if (runtime.shutdownOnValidation !== false) {
                console.error(`There were some errors. Exiting`);
                process.exit();
            } else {
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
            const
                app = express(),
                bodyParser = require("body-parser"),
                swaggerUi = require("swagger-ui-express"),
                swaggerDocument = require("./swagger.json");

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
            app.post(postApi, async (request: any, response: any) => {
                const path = request.url.split("/").slice(2);
                if (path.length === 0) {
                    response.json({
                        post: postApi
                    });
                } else {
                    await this.handleRequest(request, response, path);
                }
            });
            /*
            * Startup the DELETE API
            * */
            app.delete(deleteApi, async (request: any, response: any) => {
                const path = request.url.split("/").slice(2);
                path.unshift(`delete`);
                if (path.length === 0) {
                    response.json({
                        post: postApi
                    });
                } else {
                    await this.handleRequest(request, response, path);
                }
            });
            /*
            * Startup the OPTION API
            * */
            app.options(["/api/shutdown"], async (request: any, response: any) => {
                const path = request.url.split("/").slice(2);
                await this.handleRequest(request, response, path);
            });

            app.listen(runtime.port, runtime.host, (err: any) => {
                if (err) {
                    return console.log("something bad happened", err);
                } else {
                    runtime.red(`\n\t\t\t\t         _/\\_\n\t\t\t\t       __\\  /__\n\t\t\t\t      <_      _>\n\t\t\t\t        |/ )\\|\n\t\t\t\t          /`);
                    runtime.green(emoji.emojify(`Now serving to the world :earth_africa: at ${runtime.host}:${runtime.port}!`));
                }
            });
            executeResult = {
                status: "API Rest Service Started"
            };
        }

        /*
        * List all Working Copies
        * */
        else if (runtime.list === ListType.WorkingCopy) {
            executeResult = Manager.listWorkingCopies(runtime);
        }
        /*
        * List all Revisions
        * */
        else if (runtime.list === ListType.Revision) {
            executeResult = Manager.listRevisions(runtime);
        }
        /*
        * List all Revisions
        * */
        else if (runtime.list === ListType.Help) {
            executeResult = MxSDK.renderHelp(ListType, `Here are the options for list:`, runtime);
        }

        /*
        * Fetch Help
        * */
        else if (runtime.fetch === FetchType.Help) {
            executeResult = MxSDK.renderHelp(FetchType, `fetch expects one following options:`, runtime);
        }
        /*
        * Fetch Modules
        * */
        else if (runtime.fetch === FetchType.Modules) {
            executeResult = Modules.fetchModules(runtime);
        }
        /*
        * Fetch Microflows
        * */
        else if (runtime.fetch === FetchType.Microflows) {
            executeResult = Microflows.fetchMicroflows(runtime);
        }

        /*
        * Load a Revision
        * */
        else if (runtime.load) {
            runtime.log(`Loading revision ${runtime.revision}`);
            executeResult = Load.loadRevision(runtime);
        }

        /*
        * Delete a Working Copy
        * */
        else if (runtime.delete === DeleteType.WorkingCopy) {
            runtime.log(`Deleting working copy ${runtime.workingCopyId} ${runtime.revision}`);
            executeResult = Manager.deleteWorkingCopy(runtime);
        }
        /*
        * Delete a Working Copy
        * */
        else if (runtime.delete === DeleteType.Revision) {
            runtime.log(`Deleting revision ${runtime.revision}`);
            executeResult = Manager.deleteRevision(runtime);
        }
        /*
        * Delete Help
        * */
        else if (runtime.delete === DeleteType.Help) {
            executeResult = MxSDK.renderHelp(DeleteType, `delete expects one following options:`, runtime);
        }
        /*
        * Shutdown
        * */
        else if (runtime.shutdown) {
            console.log(`Shutdown command received.`);
            process.kill(process.pid);
        } else {
            const result = {
                error: {
                    message: "No command received for payload"
                }
            };
            if (runtime.json) {
                console.log(JSON.stringify(result));
            } else {
                runtime.error(`No command specified!`);
            }
            executeResult = result;
        }
        return executeResult;
    }

    private async handleRequest(request: any, response: any, path?: any) {
        request.body._ = path;
        const runtime = new Runtime(request.body);
        runtime.setServerDefaults();
        let result = {};
        const callbackUrl = new CallbackUrl();
        try {
            const main = new MxSDK();
            if (!runtime.callback) {
                result = await main.execute(runtime);
            } else {
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
        } catch (e) {
            if (!runtime.callback) {
                runtime.error(e.message);
            } else {
                callbackUrl.callback(runtime.callback, e, true);
            }
        }
        if (runtime.hasErrors()) {
            response.status(runtime.runtimeError.statusCode || 500);
        }
        result = await result;
        response.json(await runtime.safeReturnOrError(result));
    }

    private static validate(runtime: Runtime) {
        /*
        * Assert Call Parameters
        * */
        if ((runtime.fetch && runtime.fetch !== FetchType.Help)
            || runtime.load
            || ((runtime.delete === DeleteType.Revision))) {
            runtime.assert(!!runtime.appId, `appId is missing`, true);
            runtime.assert(!!runtime.appName, `appName is missing`, true);
            runtime.assert(!!runtime.revision, `revision is missing`, true);
        }
        if ((runtime.fetch === FetchType.Microflows)) {
            runtime.assert(!!runtime.module, `module is missing`, true);
        }
        if (runtime.list
            || (runtime.fetch && runtime.fetch !== FetchType.Help)
            || (runtime.delete && (runtime.delete !== DeleteType.Help))) {
            runtime.assert(!!runtime.username, `username is missing`, true);
            runtime.assert(!!runtime.apiKey, `apiKey is missing`, true);
        }
        if (runtime.serve) {
            runtime.assert(!!runtime.host, `host is missing`, true);
            runtime.assert(!!runtime.port, `port is missing`, true);
        }
        if (runtime.delete === DeleteType.WorkingCopy) {
            runtime.assert(!!runtime.workingCopyId, `workingCopyId is missing`, true);
        }
        if (runtime.delete === DeleteType.Revision) {
            runtime.assert(!!runtime.revision, `revision is missing`, true);
        }
        if (runtime.list === ListType.Revision) {
            runtime.assert(!!runtime.appId, `appId is missing`, true);
            runtime.assert(!!runtime.appName, `appName is missing`, true);
        }
        return !runtime.hasErrors();
    }

    private static renderHelp(options: any, message: string, runtime: Runtime) {
        if (runtime.json) {
            console.log({
                instructions: message,
                options
            });
        } else {
            runtime.log(message);
            runtime.table(options);
        }
        return {
            instructions: message,
            options
        };
    }
}

if (argv._.length > 0) {
    const runtime = new Runtime(argv);
    runtime.time(`\x1b[32mTook\x1b[0m`);
    runtime.about();
    const main = new MxSDK();
    runtime.safeReturnOrError(main.execute(runtime));
} else {
    console.error(`No command passed ${JSON.stringify(argv)}`);
    console.log(`Usage:
    node mxsdk.js commands --options
    Commands:
    =========
    list                                Lists revision that have been downloaded from Mendix TeamServer. Options: username, apikey
    load revision:number                Loads a revision from TeamServer. Options: appId, appName, revision, username, apikey                            
    fetch modules|entities|microflows   Fetches mx objects. Options: appId, appName, revision, username, apikey
    delete revision|working_copy        Deletes revisions & wc. Options: appId, appName, revision, username, apikey`);
}
