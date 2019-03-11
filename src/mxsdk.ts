import { DeleteType, FetchType, RuntimeArguments } from "./runtimearguments";
import { Modules } from "./commands/fetch/modules";
import { Manager } from "./commands/workingcopy/manager";
import { Load } from "./commands/fetch/load";

export const argv = require("minimist")(process.argv.slice(2));
const emoji = require("node-emoji");
const express = require("express");
// const cliProgress = require("cli-progress");

export class MxSDK {
    public async execute(runtime: RuntimeArguments) {
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
            * Startup the API
            * */
            app.post("/api", async (request: any, response: any) => {
                await this.handleRequest(request, response, {});
            });
            app.post("/api/list", async (request: any, response: any) => {
                await this.handleRequest(request, response, {
                    list: true
                });
            });

            app.listen(runtime.port, runtime.host, (err: any) => {
                if (err) {
                    return console.log("something bad happened", err);
                } else {
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
            return await Manager.listRevisions(runtime);
        }

        /*
        * Fetch all manner of things
        * */
        else if (runtime.fetch) {
            if (runtime.fetch === FetchType.Modules) {
                return await Modules.fetchModules(runtime);
            }
        }

        /*
        * Load a Revision
        * */
        else if (runtime.load) {
            runtime.log(`Loading revision ${runtime.revision}`);
            return await Load.loadRevision(runtime);
        }

        /*
        * Delete a Working Copy
        * */
        else if (runtime.delete === DeleteType.WorkingCopy) {
            runtime.log(`Deleting working copy ${runtime.workingCopyId} ${runtime.revision}`);
            return await Manager.deleteWorkingCopy(runtime);
        }
        /*
        * Delete a Working Copy
        * */
        else if (runtime.delete === DeleteType.Revision) {
            runtime.log(`Deleting revision ${runtime.revision}`);
            return await Manager.deleteRevision(runtime);
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
            return result;
        }
    }

    private async handleRequest(request: any, response: any, defaults?: any) {
        const runtime = new RuntimeArguments(request.body);
        runtime.setServerDefaults(defaults);
        let result = {};
        try {
            const main = new MxSDK();
            result = await main.execute(runtime);
        } catch (e) {
            runtime.error(e.message);
        }
        if (runtime.hasErrors()) {
            response.status(runtime.runtimeError.statusCode || 500);
        }
        response.json(runtime.safeReturnOrError(result));
    }

    private static validate(runtime: RuntimeArguments) {
        /*
        * Assert Call Parameters
        * */
        if (runtime.fetch || runtime.load || (runtime.delete === DeleteType.Revision)) {
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
        if (runtime.delete === DeleteType.WorkingCopy) {
            runtime.assert(!!runtime.workingCopyId, `workingCopyId is missing`, true);
        }
        if (runtime.delete === DeleteType.Revision) {
            runtime.assert(!!runtime.revision, `revision is missing`, true);
        }
        return !runtime.hasErrors();
    }
}

if (Object.keys(argv).length > 1) {
    const runtime = new RuntimeArguments(argv);
    runtime.time(`\x1b[32mTook\x1b[0m`);
    runtime.about();
    const main = new MxSDK();
    main.execute(runtime);
}
