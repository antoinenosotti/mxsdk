import { Runtime } from "../../runtime";
import { Branch, Project, Revision } from "mendixplatformsdk";
import { IModel } from "mendixmodelsdk";

const fs = require("fs");
const exitHook = require("exit-hook");

/*
* Shared Error Codes
* */
export enum ErrorCodes {
    NotFoundError = "NotFoundError"
}

/*
* Some basic structures interfaces for our configuration
* */
interface IRevision {
    workingCopyId: string;
    revision: number;
    branchName: string;
    mendixVersion: string;
}

interface IApplication {
    revisions: IRevision[];
    appName: string;
}

interface IConfig {
    applications: {[s: string]: IApplication};
}

/*
* We need to MonkeyPatch console.log for things outside our control, like the Mendix SDK js files.
* */
const consoleBanana = console.log;
export function monkeyPatchConsole(monkeyGood = false) {
    if (monkeyGood) {
        console.log = consoleBanana;
    } else {
        console.log = () => {
            // Monkey Bad
        };
    }
}

/*
* This Helper class will give us our basic working copy helper methods to TeamServer/Mendix.
* */
export class Manager {
    static homeFolder = `${require("os").homedir()}/.mxsdk`;
    static registryFilePath = `${Manager.homeFolder}/working-copies.registry`;
    public static config: IConfig = {
        applications: {}
    };
    /*
    * State management for our config registry. What we've loaded etc
    * */
    public static async readConfig() {
        /*
        * Take care of creating all the folders and writing the file if it's empty
        * */
        const self = Manager;
        if (!fs.existsSync(self.homeFolder)) {
            fs.mkdirSync(self.homeFolder);
        }
        if (!fs.existsSync(self.registryFilePath)) {
            this.saveConfig();
        } else {
            this.config = JSON.parse(fs.readFileSync(self.registryFilePath).toString());
        }
    }
    public static saveConfig() {
        const self = Manager;
        const configData = JSON.stringify(self.config);
        fs.writeFileSync(self.registryFilePath, configData);
    }
    /*
    * Revision Helper methods, list, has and get. ToDo: Delete
    * */
    static hasRevision(runtime: Runtime) {
        if (runtime.appId !== void 0) {
            const revision = runtime.revision || -1;
            return !!self.config.applications[runtime.appId].revisions[revision];
        } else {
            return void 0;
        }
    }
    static async getRevision(runtime: Runtime): Promise<IModel | void> {
        // @ts-ignore
        if (!self.config.applications[runtime.appId]) {
            // @ts-ignore
            self.config.applications[runtime.appId] = {
                revisions: {},
                appName: runtime.appName
            };
        }

        if (this.hasRevision(runtime)) {
            // @ts-ignore
            const workingCopyId = self.config.applications[runtime.appId].revisions[runtime.revision].workingCopyId;
            runtime.log(`Opening working copy ${workingCopyId} for revision ${runtime.revision} of ${runtime.appName}`);
            monkeyPatchConsole(!runtime.json);
            const iModel = await runtime.getClient().model().openWorkingCopy(workingCopyId)
                .then((model) => {
                    return model;
                })
                .catch((error) => {
                    runtime.runtimeError.statusCode = error.statusCode;
                    runtime.runtimeError.name = error.error.name;
                    runtime.runtimeError.message = error.error.message;
                });
            monkeyPatchConsole(true);
            return iModel;
        } else {
            const
                project = new Project(runtime.getClient(), `${runtime.appId}`, `${runtime.appName}`),
                branch = new Branch(project, `${runtime.branchName}`),
                revisionNumber = runtime.revision || -1,
                revision = new Revision(revisionNumber, branch);
            monkeyPatchConsole(!runtime.json);
            const workingCopy = await runtime.getClient().platform().createOnlineWorkingCopy(project, revision);
            monkeyPatchConsole(true);
            // @ts-ignore
            self.config.applications[runtime.appId].revisions[runtime.revision] = {
                workingCopyId: workingCopy.id(),
            };
            return workingCopy.model();
        }
    }
    public static async listRevisions(runtime: Runtime) {
        const client = runtime.getClient();
        try {
            const result: any[] = [];
            const workingCopies = await client.model().getMyWorkingCopies();
            workingCopies.forEach(async (workingCopy) => {
                // @ts-ignore
                const app = self.config.applications[workingCopy.metaData.projectId];
                if (app) {
                    // @ts-ignore
                    result.push({
                        appName: app.appName,
                        projectId: workingCopy.metaData.projectId,
                        mendixVersion: workingCopy.metaData.metaModelVersion,
                        // @ts-ignore
                        revision: workingCopy.metaData.teamServerBaseRevision.valueOf(),
                        branch: workingCopy.metaData.teamServerBaseBranch,
                        workingCopyId: workingCopy.id
                    });
                } else {
                    runtime.warn(`I don't know revision ${workingCopy.id}`);
                }
            });
            if (!runtime.json) {
                runtime.blue(`Available revisions:`);
                return result;
            } else {
                return {
                    revisions: result
                };
            }
        } catch (error) {
            return {
                error: {
                    message: error.message
                }
            };
        }
    }

    static async deleteWorkingCopy(runtime: Runtime) {
        if (runtime.workingCopyId !== void 0) {
            monkeyPatchConsole(!runtime.json);
            await runtime.getClient().model().deleteWorkingCopy(runtime.workingCopyId)
                .catch((error) => {
                    runtime.runtimeError.statusCode = error.statusCode;
                    runtime.runtimeError.name = error.error.name;
                    runtime.runtimeError.message = error.error.message;
                });
            monkeyPatchConsole(true);
        } else {
            runtime.error(`No working copy found for id ${runtime.workingCopyId}`);
        }
        return {
            deleted: true,
            workingCopyId: runtime.workingCopyId
        };
    }

    static async deleteRevision(runtime: Runtime) {
        const appId = runtime.appId || "unspecified";
        if (!self.config.applications[appId]) {
            runtime.error(`Application of id ${runtime.appId} not known`);
            return runtime.runtimeError;
        }
        const revision = runtime.revision || -1;
        if (!self.config.applications[appId].revisions[revision]) {
            runtime.error(`Revision ${runtime.revision} of application with id  ${runtime.appId} not known`);
            runtime.runtimeError.statusCode = 404;
            runtime.runtimeError.code = "REVISION-404";
            return runtime.runtimeError;
        }
        runtime.workingCopyId = self.config.applications[appId].revisions[revision].workingCopyId;
        if (runtime.workingCopyId !== void 0) {
            monkeyPatchConsole(!runtime.json);
            await runtime.getClient().model().deleteWorkingCopy(runtime.workingCopyId)
                .catch((error) => {
                    if (error.name === ErrorCodes.NotFoundError) {
                        runtime.runtimeError.statusCode = error.statusCode;
                        runtime.runtimeError.name = error.error.name;
                        runtime.runtimeError.message = error.error.message;
                    }
                });
            monkeyPatchConsole(true);
        } else {
            runtime.error(`No working copy found for revision ${runtime.revision} using workingCopyId ${runtime.workingCopyId}`);
        }
        delete self.config.applications[appId].revisions[revision];
        return {
            deleted: true,
            workingCopyId: runtime.workingCopyId,
            revision: runtime.revision
        };
    }
}

/*
* Short-hand for the Class, since most methods will be and use static methods
* Static methods were created to take advantage of async/await
* */
const self = Manager;
/*
* Let's read the config and make sure we write it when we exit.
* */
Manager.readConfig().then(() => {
    exitHook(async () => {
        await Manager.saveConfig();
    });
});
