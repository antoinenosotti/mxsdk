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
                this.config = JSON.parse(fs.readFileSync(self.registryFilePath).toString());
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
            return !!self.config.applications[runtime.appId].revisions[revision];
        }
        else {
            return void 0;
        }
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
                self.config.applications[runtime.appId].revisions[runtime.revision] = {
                    workingCopyId: workingCopy.id(),
                };
                return workingCopy.model();
            }
        });
    }
    static listRevisions(runtime) {
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
                        runtime.warn(`I don't know revision ${workingCopy.id}`);
                    }
                }));
                if (!runtime.json) {
                    runtime.blue(`Available revisions:`);
                    runtime.table(result);
                    runtime.timeEnd(`\x1b[32mTook\x1b[0m`);
                    return result;
                }
                else {
                    const response = {
                        revisions: result
                    };
                    console.log(JSON.stringify(response));
                    return response;
                }
            }
            catch (error) {
                const response = {
                    error: {
                        message: error.message
                    }
                };
                console.error(JSON.stringify(response));
                return response;
            }
        });
    }
    static deleteWorkingCopy(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            if (runtime.workingCopyId !== void 0) {
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
            return runtime.safeReturnOrError({
                deleted: true,
                workingCopyId: runtime.workingCopyId
            });
        });
    }
    static deleteRevision(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield runtime.getClient().model().deleteWorkingCopy(runtime.workingCopyId)
                    .catch((error) => {
                    if (error.name === ErrorCodes.NotFoundError) {
                        runtime.runtimeError.statusCode = error.statusCode;
                        runtime.runtimeError.name = error.error.name;
                        runtime.runtimeError.message = error.error.message;
                    }
                });
                monkeyPatchConsole(true);
            }
            else {
                runtime.error(`No working copy found for revision ${runtime.revision} using workingCopyId ${runtime.workingCopyId}`);
            }
            delete self.config.applications[appId].revisions[revision];
            return runtime.safeReturnOrError({
                deleted: true,
                workingCopyId: runtime.workingCopyId,
                revision: runtime.revision
            });
        });
    }
}
Manager.homeFolder = `${require("os").homedir()}/.mxsdk`;
Manager.registryFilePath = `${Manager.homeFolder}/working-copies.registry`;
Manager.config = {
    applications: {}
};
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