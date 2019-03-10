import { FetchType, RuntimeArguments } from "./runtimearguments";
export const argv = require("minimist")(process.argv.slice(2));
const emoji = require("node-emoji");
const express = require("express");

import { Modules } from "./commands/fetch/modules";
import { Manager } from "./commands/workingcopy/manager";
import { Load } from "./commands/fetch/load";
import {start} from "repl";

export class Main {
    public async run(runtime: RuntimeArguments) {
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
                const runtime = new RuntimeArguments(request.body);
                runtime.setServerDefaults();
                const startTime = Date.now();
                try {
                    const main = new Main();
                    const result = await main.run(runtime);
                    // @ts-ignore
                    result.took = Date.now() - startTime; result.timestamp = startTime;
                    if (runtime.json) {
                        response.json(result);
                    } else {
                        response.send(result);
                    }
                } catch (e) {
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
            });

            app.listen(runtime.port, runtime.host, (err: any) => {
                if (err) {
                    return console.log("something bad happened", err);
                } else {
                    runtime.red(`\n\t\t\t\t         _/\\_\n\t\t\t\t       __\\  /__\n\t\t\t\t      <_      _>\n\t\t\t\t        |/ )\\|\n\t\t\t\t          /`);
                    runtime.green(emoji.emojify(`Now serving to the world :earth_africa: at ${runtime.host}:${runtime.port}!`));
                }
            });
        }

        /*
        * Fetch all manner of things
        * */

        else if (runtime.list) {
            const result = await Manager.listRevisions(runtime);
            return result;
        }

        /*
        * Fetch all manner of things
        * */

        else if (runtime.fetch) {
            if (runtime.fetch === FetchType.Modules) {
                const result = await Modules.fetchModules(runtime);
                return result;
            }
        }

        /*
        * Load a Revision
        * */

        else if (runtime.load) {
            const result = await Load.loadRevision(runtime);
            return result;
        }
    }
}

if (Object.keys(argv).length > 1) {
    const runtime = new RuntimeArguments(argv);
    runtime.time(`\x1b[32mTook\x1b[0m`);
    runtime.about();
    const main = new Main();
    main.run(runtime);
}