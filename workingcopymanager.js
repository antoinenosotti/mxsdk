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
const mendixplatformsdk_1 = require("mendixplatformsdk");
const fs = require("fs");
const exitHook = require('exit-hook');
class WorkingCopyManager {
    static readConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const self = WorkingCopyManager;
            if (!fs.existsSync(self.homeFolder)) {
                fs.mkdirSync(self.homeFolder);
            }
            if (!fs.existsSync(self.registryFilePath)) {
                this.saveConfig();
            }
            else {
                this.config = JSON.parse(fs.readFileSync(self.registryFilePath).toString());
            }
            this.config.homeFolder = self.homeFolder;
            this.config.registryFilePath = self.registryFilePath;
        });
    }
    static saveConfig() {
        const self = WorkingCopyManager;
        const configData = JSON.stringify(self.config);
        fs.writeFileSync(self.registryFilePath, configData);
    }
    static hasRevision(runtime) {
        // @ts-ignore
        return !!self.config.applications[runtime.appId].revisions[runtime.revision];
    }
    static getRevision(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
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
                return yield runtime.getClient().model().openWorkingCopy(workingCopyId);
            }
            else {
                const project = new mendixplatformsdk_1.Project(runtime.getClient(), `${runtime.appId}`, `${runtime.appName}`);
                const branch = new mendixplatformsdk_1.Branch(project, `${runtime.branchName}`);
                const revision = new mendixplatformsdk_1.Revision(runtime.revision, branch);
                const workingCopy = yield runtime.getClient().platform().createOnlineWorkingCopy(project, revision);
                runtime.red(`Project: ${workingCopy.sourceRevision().branch().project().name()}`);
                runtime.red(`Branch: ${workingCopy.sourceRevision().branch().name()}`);
                // @ts-ignore
                self.config.applications[runtime.appId].revisions[runtime.revision] = {
                    workingCopyId: workingCopy.id(),
                };
                return workingCopy.model();
            }
        });
    }
    static listWorkingCopies(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = runtime.getClient();
            runtime.verbose = true;
            try {
                const result = [];
                const workingCopies = yield client.model().getMyWorkingCopies();
                workingCopies.forEach((workingCopy) => __awaiter(this, void 0, void 0, function* () {
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
                    }
                    else {
                        runtime.red(`Deleting working copy ${workingCopy.id} because I don't know it`);
                        yield runtime.getClient().model().deleteWorkingCopy(workingCopy.id);
                    }
                }));
                if (!runtime.json) {
                    runtime.blue(`Available revisions:`);
                    runtime.table(result);
                }
                else {
                    console.log(JSON.stringify({
                        revisions: result
                    }));
                }
            }
            catch (Error) {
                runtime.error(Error);
            }
        });
    }
}
WorkingCopyManager.homeFolder = `${require('os').homedir()}/.mxsdk`;
WorkingCopyManager.registryFilePath = `${WorkingCopyManager.homeFolder}/working-copies.registry`;
WorkingCopyManager.config = {
    applications: {},
    homeFolder: "",
    registryFilePath: ""
};
exports.WorkingCopyManager = WorkingCopyManager;
const self = WorkingCopyManager;
WorkingCopyManager.readConfig().then(() => {
    exitHook(() => __awaiter(this, void 0, void 0, function* () {
        yield WorkingCopyManager.saveConfig();
    }));
});
//# sourceMappingURL=workingcopymanager.js.map