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
const exitHook = require("exit-hook");
/*
* Shared Error Codes
* */
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes["NotFoundError"] = "NotFoundError";
})(ErrorCodes = exports.ErrorCodes || (exports.ErrorCodes = {}));
class Config {
    constructor(props) {
        this.applications = [];
        for (const propName in props) {
            // @ts-ignore
            this[propName] = props[propName];
        }
    }
    hasApp(appId) {
        return this.getApp(appId) !== void 0;
    }
    getApp(appId) {
        return this.applications.find((app) => { return app.appId === appId; });
    }
    addApp(appId, appName) {
        this.applications.push({
            revisions: [],
            appId,
            appName
        });
    }
    hasRevision(appId, revisionNumber) {
        return this.getRevision(appId, revisionNumber) !== void 0;
    }
    getRevision(appId, revisionNumber) {
        const app = this.getApp(appId);
        if (app) {
            return app.revisions.find((revision) => { return revision.revision === revisionNumber; });
        }
        return void 0;
    }
    addRevision(runtime, revision) {
        if (!this.hasApp(runtime.appId)) {
            this.addApp(runtime.appId || "unspecified", runtime.appName || "unspecified");
        }
        const app = this.getApp(runtime.appId || "unspecified");
        if (app) {
            if (!this.hasRevision(runtime.appId || "unspecified", runtime.revision || -1)) {
                app.revisions.push(revision);
            }
        }
    }
    deleteRevision(appId, revisionNumber) {
        const app = this.getApp(appId);
        if (app) {
            const foundRevision = this.getRevision(appId, revisionNumber);
            if (foundRevision) {
                app.revisions = app.revisions.filter((revision) => { return revision !== foundRevision; });
                return true;
            }
        }
        return false;
    }
    flush() {
        this.applications = [];
    }
}
/*
* We need to MonkeyPatch console.log for things outside our control, like the Mendix SDK js files.
* */
const consoleBanana = console.log;
function monkeyPatchConsole(monkeyGood = false) {
    if (monkeyGood) {
        console.log = consoleBanana;
    }
    else {
        console.log = () => {
            // Monkey Bad
        };
    }
}
exports.monkeyPatchConsole = monkeyPatchConsole;
/*
* This Helper class will give us our basic working copy helper methods to TeamServer/Mendix.
* */
class Manager {
    /*
    * State management for our config registry. What we've loaded etc
    * */
    static readConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            * Take care of creating all the folders and writing the file if it's empty
            * */
            const self = Manager;
            if (!fs.existsSync(self.homeFolder)) {
                fs.mkdirSync(self.homeFolder);
            }
            if (!fs.existsSync(self.registryFilePath)) {
                this.saveConfig();
            }
            else {
                this.config = new Config(JSON.parse(fs.readFileSync(self.registryFilePath).toString()));
            }
        });
    }
    static saveConfig() {
        const self = Manager;
        const configData = JSON.stringify(self.config);
        fs.writeFileSync(self.registryFilePath, configData);
    }
    /*
    * Revision Helper methods, list, has and get. ToDo: Delete
    * */
    static hasRevision(runtime) {
        if (runtime.appId !== void 0) {
            const revision = runtime.revision || -1;
            return self.config.getRevision(runtime.appId, revision);
        }
        else {
            return void 0;
        }
    }
    static getWorkingCopyForRevision(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            if (!self.config.hasApp(runtime.appId)) {
                // @ts-ignore
                self.config.addApp(runtime.appId || "unspecified", runtime.appName || "unspecified");
            }
            if (this.hasRevision(runtime)) {
                // @ts-ignore
                const workingCopyId = self.config.getRevision(runtime.appId, runtime.revision).workingCopyId;
                runtime.log(`Opening working copy ${workingCopyId} for revision ${runtime.revision} of ${runtime.appName}`);
                monkeyPatchConsole(!runtime.json);
                const iModel = yield runtime.getClient().model().openWorkingCopy(workingCopyId)
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
            }
            else {
                const project = new mendixplatformsdk_1.Project(runtime.getClient(), `${runtime.appId}`, `${runtime.appName}`), branch = new mendixplatformsdk_1.Branch(project, `${runtime.branchName}`), revisionNumber = runtime.revision || -1, revision = new mendixplatformsdk_1.Revision(revisionNumber, branch);
                monkeyPatchConsole(!runtime.json);
                const workingCopy = yield runtime.getClient().platform().createOnlineWorkingCopy(project, revision);
                monkeyPatchConsole(true);
                // @ts-ignore
                self.config.addRevision(runtime, {
                    workingCopyId: workingCopy.id(),
                    revision: revisionNumber,
                    branchName: runtime.branchName,
                    mendixVersion: workingCopy.model().metaModelVersion.toString()
                });
                return workingCopy.model();
            }
        });
    }
    static listWorkingCopies(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = runtime.getClient();
            try {
                const result = [];
                const workingCopies = yield client.model().getMyWorkingCopies();
                workingCopies.forEach((workingCopy) => __awaiter(this, void 0, void 0, function* () {
                    // @ts-ignore
                    const app = self.config.getApp(workingCopy.metaData.projectId);
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
                    }
                    else {
                        runtime.warn(`I don't know working copy ${workingCopy.id}`);
                        self.config.addApp(workingCopy.metaData.projectId, workingCopy.metaData.name);
                        const newRuntime = {
                            appId: workingCopy.metaData.projectId,
                            appName: workingCopy.metaData.name,
                            revision: workingCopy.metaData.teamServerBaseRevision && workingCopy.metaData.teamServerBaseRevision.valueOf()
                        }, revision = {
                            appName: workingCopy.metaData.name,
                            projectId: workingCopy.metaData.projectId,
                            mendixVersion: workingCopy.metaData.metaModelVersion,
                            // @ts-ignore
                            revision: workingCopy.metaData.teamServerBaseRevision.valueOf(),
                            branch: workingCopy.metaData.teamServerBaseBranch,
                            workingCopyId: workingCopy.id
                        };
                        // @ts-ignore
                        self.config.addRevision(newRuntime, revision);
                        result.push(revision);
                    }
                }));
                if (!runtime.json) {
                    runtime.blue(`Available working copies:`);
                    return result;
                }
                else {
                    return {
                        workingCopies: result
                    };
                }
            }
            catch (error) {
                return {
                    error: {
                        message: error.message
                    }
                };
            }
        });
    }
    static listRevisions(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Manager.config.hasApp(runtime.appId)) {
                    Manager.config.addApp(runtime.appId || "unspecified", runtime.appName || "unspecified");
                }
                runtime.blue(`Available revisions:`);
                const appId = runtime.appId + "", app = Manager.config.getApp(appId);
                if (app !== undefined) {
                    if (runtime.json) {
                        return {
                            revisions: app.revisions
                        };
                    }
                    else {
                        return app.revisions;
                    }
                }
            }
            catch (error) {
                return {
                    error: {
                        message: error.message
                    }
                };
            }
        });
    }
    static deleteWorkingCopy(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            if (runtime.workingCopyId === "*") {
                monkeyPatchConsole(!runtime.json);
                const workingCopies = yield runtime.getClient().model().getMyWorkingCopies();
                workingCopies.forEach((wc) => __awaiter(this, void 0, void 0, function* () {
                    yield runtime.getClient().model().deleteWorkingCopy(wc.id)
                        .catch((error) => {
                        runtime.runtimeError.statusCode = error.statusCode;
                        runtime.runtimeError.name = error.error.name;
                        runtime.runtimeError.message = error.error.message;
                    });
                }));
                self.config.flush();
                this.saveConfig();
                monkeyPatchConsole(true);
            }
            else if (runtime.workingCopyId !== void 0) {
                monkeyPatchConsole(!runtime.json);
                yield runtime.getClient().model().deleteWorkingCopy(runtime.workingCopyId)
                    .catch((error) => {
                    runtime.runtimeError.statusCode = error.statusCode;
                    runtime.runtimeError.name = error.error.name;
                    runtime.runtimeError.message = error.error.message;
                });
                monkeyPatchConsole(true);
            }
            else {
                runtime.error(`No working copy found for id ${runtime.workingCopyId}`);
            }
            return {
                deleted: true,
                workingCopyId: runtime.workingCopyId
            };
        });
    }
    static deleteRevision(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            const appId = runtime.appId || "unspecified", app = self.config.getApp(appId), revisionNumber = runtime.revision || -1, revision = self.config.getRevision(appId, revisionNumber);
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
            if (revision !== void 0) {
                // monkeyPatchConsole(!runtime.json);
                yield runtime.getClient().model().deleteWorkingCopy(revision.workingCopyId)
                    .catch((error) => {
                    if (error.name === ErrorCodes.NotFoundError) {
                        runtime.runtimeError.statusCode = error.statusCode;
                        runtime.runtimeError.name = error.error.name;
                        runtime.runtimeError.message = error.error.message;
                    }
                });
                // monkeyPatchConsole(true);
            }
            else {
                runtime.error(`No working copy found for revision ${runtime.revision} using workingCopyId ${runtime.workingCopyId}`);
            }
            self.config.deleteRevision(appId, revisionNumber);
            return {
                deleted: true,
                workingCopyId: runtime.workingCopyId,
                revision: runtime.revision
            };
        });
    }
}
Manager.homeFolder = `${require("os").homedir()}/.mxsdk`;
Manager.registryFilePath = `${Manager.homeFolder}/working-copies.registry`;
Manager.config = new Config({});
exports.Manager = Manager;
/*
* Short-hand for the Class, since most methods will be and use static methods
* Static methods were created to take advantage of async/await
* */
const self = Manager;
/*
* Let's read the config and make sure we write it when we exit.
* */
Manager.readConfig().then(() => {
    exitHook(() => __awaiter(this, void 0, void 0, function* () {
        yield Manager.saveConfig();
    }));
});
//# sourceMappingURL=manager.js.map