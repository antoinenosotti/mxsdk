import {RuntimeArguments} from "./runtimearguments";
import {Branch, MendixSdkClient, OnlineWorkingCopy, Project, Revision} from "mendixplatformsdk";

const fs = require("fs");
const exitHook = require('exit-hook');

/*
* Where we'll keep the branch information
* */
export interface IRevision {
    revision: number | undefined;
    branchName: string | undefined;
}

export class WorkingCopyManager {
    static homeFolder = `${require('os').homedir()}/.mxsdk`;
    static registryFilePath = `${WorkingCopyManager.homeFolder}/working-copies.registry`;
    public static config = {
        applications: {},
        homeFolder: "",
        registryFilePath: ""
    };
    public static async readConfig() {
        const self = WorkingCopyManager;
        if (!fs.existsSync(self.homeFolder)) {
            fs.mkdirSync(self.homeFolder);
        }
        if (!fs.existsSync(self.registryFilePath)) {
            this.saveConfig();
        } else {
            this.config = JSON.parse(fs.readFileSync(self.registryFilePath).toString());
        }
        this.config.homeFolder = self.homeFolder;
        this.config.registryFilePath = self.registryFilePath;
    }
    public static saveConfig() {
        const self = WorkingCopyManager;
        const configData = JSON.stringify(self.config);
        fs.writeFileSync(self.registryFilePath, configData);
    }
    static hasRevision(runtime: RuntimeArguments) {
        // @ts-ignore
        return !!self.config.applications[runtime.appId].revisions[runtime.revision];
    }
    static async getRevision(runtime: RuntimeArguments) {
        // @ts-ignore
        if (!self.config.applications[runtime.appId]) {
            // @ts-ignore
            self.config.applications[runtime.appId] = {
                revisions: {},
                appName: runtime.appName
            }
        }

        if (this.hasRevision(runtime)) {
            // @ts-ignore
            const workingCopyId = self.config.applications[runtime.appId].revisions[runtime.revision].workingCopyId;
            runtime.log(`Opening working copy ${workingCopyId} for revision ${runtime.revision} of ${runtime.appName}`);
            return await runtime.getClient().model().openWorkingCopy(workingCopyId);
        } else {
            const project = new Project(runtime.getClient(), `${runtime.appId}`, `${runtime.appName}`);
            const branch = new Branch(project, `${runtime.branchName}`);
            const revision = new Revision(runtime.revision, branch);
            const workingCopy = await runtime.getClient().platform().createOnlineWorkingCopy(project, revision);
            runtime.red(`Project: ${workingCopy.sourceRevision().branch().project().name()}`);
            runtime.red(`Branch: ${workingCopy.sourceRevision().branch().name()}`);
            // @ts-ignore
            self.config.applications[runtime.appId].revisions[runtime.revision] = {
                workingCopyId: workingCopy.id(),
            };
            return workingCopy.model();
        }
    }

    public static async listWorkingCopies(runtime: RuntimeArguments) {
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
                    runtime.red(`Deleting working copy ${workingCopy.id} because I don't know it`);
                    await runtime.getClient().model().deleteWorkingCopy(workingCopy.id);
                }
            });
            if (!runtime.json) {
                runtime.blue(`Available revisions:`);
                runtime.table(result);
                runtime.timeEnd(`Took`);
            } else {
                console.log(JSON.stringify({
                    revisions: result
                }));
            }
        } catch (Error) {
            runtime.error(Error);
        }
    }
}

const self = WorkingCopyManager;

WorkingCopyManager.readConfig().then(() => {
    exitHook(async () => {
        await WorkingCopyManager.saveConfig();
    });
});