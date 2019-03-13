import { Runtime } from "../../runtime";
import { Branch, Project, Revision } from "mendixplatformsdk";
import { IModel } from "mendixmodelsdk";
import { IRuntimeArgumentsBase } from "../../runtimebase";

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
    appId: string;
}

class Config {
    constructor(props: any | IRuntimeArgumentsBase) {
        for (const propName in props) {
            // @ts-ignore
            this[propName] = props[propName];
        }
    }
    private applications: IApplication[] = [];
    hasApp(appId: string | undefined) {
        return this.getApp(appId) !== void 0;
    }
    getApp(appId: string | undefined) {
        return this.applications.find((app) => { return app.appId === appId; });
    }
    hasRevision(appId: string, revisionNumber: number) {
        return this.getRevision(appId, revisionNumber) !== void 0;
    }
    getRevision(appId: string, revisionNumber: number) {
        const app = this.getApp(appId);
        if (app) {
            return app.revisions.find((revision) => { return revision.revision === revisionNumber; });
        }
        return void 0;
    }

    deleteRevision(appId: string, revisionNumber: number) {
        const app = this.getApp(appId);
        if (app) {
            const foundRevision = this.getRevision(appId, revisionNumber);
            if (foundRevision) {
                app.revisions = app.revisions.filter((revision) => {return revision !== foundRevision; });
                return true;
            }
        }
        return false;
    }
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
    public static config: Config = new Config({});
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
            this.config = new Config(JSON.parse(fs.readFileSync(self.registryFilePath).toString()));
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
            return self.config.getRevision(runtime.appId, revision);
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
                appName: runtime.appName,
                appId: runtime.appId
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
    public static async listWorkingCopies(runtime: Runtime) {
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
                    runtime.warn(`I don't know working copy ${workingCopy.id}`);
                }
            });
            if (!runtime.json) {
                runtime.blue(`Available working copies:`);
                return result;
            } else {
                return {
                    workingCopies: result
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

    public static async listRevisions(runtime: Runtime) {
        try {
            if (Manager.config.hasApp(runtime.appId)) {
                runtime.blue(`Available revisions:`);
                const
                    appId = runtime.appId + "",
                    app = Manager.config.getApp(appId);
                if (app !== undefined) {
                    return {
                        revisions: app.revisions
                    };
                }
            } else {
                runtime.runtimeError.message = `Application of id ${runtime.appId} is unknown`;
                throw new Error(runtime.runtimeError.message);
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
        const
            appId = runtime.appId || "unspecified",
            app = self.config.getApp(appId),
            revisionNumber = runtime.revision || -1,
            revision = self.config.getRevision(appId, revisionNumber);
        if (app === void 0) {
            runtime.error(`Application of id ${runtime.appId} not known`);
            return runtime.runtimeError;
        }
        if (revision === void 0) {
            runtime.error(`Revision ${revisionNumber} of application with id  ${appId} not known`);
            runtime.runtimeError.statusCode = 404;
            runtime.runtimeError.code = "REVISION-404";
            return runtime.runtimeError;
        }
        runtime.workingCopyId = revision.workingCopyId;
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
        self.config.deleteRevision(appId, revisionNumber);
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
