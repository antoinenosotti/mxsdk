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
const typeorm_1 = require("typeorm");
const config_1 = require("./config");
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
            const workingConfig = yield Manager.messageRepository.findOne();
            if (workingConfig && workingConfig.config !== undefined) {
                Manager.config = new Config(JSON.parse(workingConfig.config));
            }
            else {
                Manager.config = new Config({});
            }
        });
    }
    static saveConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workingConfig = yield Manager.messageRepository.findOne();
                if (workingConfig && workingConfig.config !== undefined) {
                    workingConfig.config = JSON.stringify(this.config);
                    yield Manager.connection.manager.save(workingConfig);
                }
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    /*
    * Revision Helper methods, list, has and get. ToDo: Delete
    * */
    static hasRevision(runtime) {
        if (runtime.appId !== void 0) {
            const revision = runtime.revision || -1;
            return Manager.config.getRevision(runtime.appId, revision);
        }
        else {
            return void 0;
        }
    }
    static getWorkingCopyForRevision(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Manager.config) {
                yield init();
                yield Manager.readConfig();
            }
            // @ts-ignore
            if (!Manager.config.hasApp(runtime.appId)) {
                // @ts-ignore
                Manager.config.addApp(runtime.appId || "unspecified", runtime.appName || "unspecified");
                yield Manager.saveConfig();
            }
            if (this.hasRevision(runtime)) {
                // @ts-ignore
                const workingCopyId = Manager.config.getRevision(runtime.appId, runtime.revision).workingCopyId;
                runtime.log(`Opening working copy ${workingCopyId} for revision ${runtime.revision} of ${runtime.appName}`);
                monkeyPatchConsole(!runtime.json);
                const iModel = yield runtime.getClient().model().openWorkingCopy(workingCopyId)
                    .then((model) => __awaiter(this, void 0, void 0, function* () {
                    return model;
                }))
                    .catch((error) => {
                    runtime.runtimeError.statusCode = error.statusCode;
                    runtime.runtimeError.name = error.error.name;
                    runtime.runtimeError.message = error.error.message;
                });
                yield Manager.saveConfig();
                monkeyPatchConsole(true);
                return iModel;
            }
            else {
                const project = new mendixplatformsdk_1.Project(runtime.getClient(), `${runtime.appId}`, `${runtime.appName}`), branch = new mendixplatformsdk_1.Branch(project, `${runtime.branchName}`), revisionNumber = runtime.revision || -1, revision = new mendixplatformsdk_1.Revision(revisionNumber, branch);
                monkeyPatchConsole(!runtime.json);
                const workingCopy = yield runtime.getClient().platform().createOnlineWorkingCopy(project, revision);
                monkeyPatchConsole(true);
                // @ts-ignore
                Manager.config.addRevision(runtime, {
                    workingCopyId: workingCopy.id(),
                    revision: revisionNumber,
                    branchName: runtime.branchName,
                    mendixVersion: workingCopy.model().metaModelVersion.toString()
                });
                yield Manager.saveConfig();
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
                    const app = Manager.config.getApp(workingCopy.metaData.projectId);
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
                        Manager.config.addApp(workingCopy.metaData.projectId, workingCopy.metaData.name);
                        yield Manager.saveConfig();
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
                        Manager.config.addRevision(newRuntime, revision);
                        result.push(revision);
                        yield Manager.saveConfig();
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
                    yield Manager.saveConfig();
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
                Manager.config.flush();
                yield Manager.saveConfig();
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
            const appId = runtime.appId || "unspecified", app = Manager.config.getApp(appId), revisionNumber = runtime.revision || -1, revision = Manager.config.getRevision(appId, revisionNumber);
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
            Manager.config.deleteRevision(appId, revisionNumber);
            yield Manager.saveConfig();
            return {
                deleted: true,
                workingCopyId: runtime.workingCopyId,
                revision: runtime.revision
            };
        });
    }
}
Manager.homeFolder = `${require("os").homedir()}/.mxsdk`;
Manager.registryFilePath = `${Manager.homeFolder}/working-copies.registry.sqlite`;
Manager.options = {
    type: "sqlite",
    database: Manager.registryFilePath,
    entities: [config_1.WorkingConfig],
    logging: true
};
exports.Manager = Manager;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        Manager.connection = yield typeorm_1.createConnection(Manager.options);
        Manager.messageRepository = Manager.connection.getRepository(config_1.WorkingConfig);
        try {
            const count = Manager.messageRepository.count();
            console.log(`messageRepository.count()=${yield count}`);
        }
        catch (e) {
            if (e instanceof typeorm_1.QueryFailedError) {
                const metadata = Manager.connection.getMetadata(config_1.WorkingConfig);
                const newTable = typeorm_1.Table.create(metadata, Manager.connection.driver);
                const queryRunner = Manager.connection.createQueryRunner();
                yield queryRunner.createTable(newTable);
                yield queryRunner.getTable(config_1.WorkingConfig.name);
                const workingConfig = new config_1.WorkingConfig();
                workingConfig.config = JSON.stringify(Manager.config);
                workingConfig.id = 123;
                yield Manager.connection.manager.save(workingConfig);
                console.log("workingConfig has been saved. Photo id is", workingConfig.id);
            }
            else {
                throw e;
            }
        }
        const exitHook = require("exit-hook");
        /*
        * Let's read the config and make sure we write it when we exit.
        * */
        exitHook(() => __awaiter(this, void 0, void 0, function* () {
            yield Manager.connection.close();
        }));
        Manager.readConfig();
        console.log(JSON.stringify(Manager.config));
    });
}
(() => __awaiter(this, void 0, void 0, function* () {
    yield init().catch(console.error);
}))();
//# sourceMappingURL=manager.js.map