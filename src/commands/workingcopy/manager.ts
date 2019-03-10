import { RuntimeArguments } from "../../runtimearguments";
import { Branch, Project, Revision } from "mendixplatformsdk";

const fs = require("fs");
const exitHook = require("exit-hook");

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
    static hasRevision(runtime: RuntimeArguments) {
        if (runtime.appId !== void 0) {
            return !!self.config.applications[runtime.appId].revisions[runtime.revision];
        } else {
            return void 0;
        }
    }
    static async getRevision(runtime: RuntimeArguments) {
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
            const iModel = await runtime.getClient().model().openWorkingCopy(workingCopyId);
            monkeyPatchConsole(true);
            return iModel;
        } else {
            const project = new Project(runtime.getClient(), `${runtime.appId}`, `${runtime.appName}`);
            const branch = new Branch(project, `${runtime.branchName}`);
            const revision = new Revision(runtime.revision, branch);
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
    public static async listRevisions(runtime: RuntimeArguments) {
        const client = runtime.getClient();
        runtime.verbose = true;
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
                        branch: workingCopy.metaData.teamServerBaseBranch
                    });
                } else {
                    runtime.error(`I don't know revision ${workingCopy.id}`);
                }
            });
            if (!runtime.json) {
                runtime.blue(`Available revisions:`);
                runtime.table(result);
                runtime.timeEnd(`\x1b[32mTook\x1b[0m`);
                return result;
            } else {
                const response = {
                    revisions: result
                };
                console.log(JSON.stringify(response));
                return response;
            }
        } catch (error) {
            const response = {
                error: {
                    message: error.message
                }
            };
            console.error(JSON.stringify(response));
            return response;
        }
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
