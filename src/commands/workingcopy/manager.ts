import { IRuntimeArguments, Runtime } from "../../runtime";
import { Branch, Project, Revision } from "mendixplatformsdk";
import { IModel } from "mendixmodelsdk";
import { IRuntimeArgumentsBase } from "../../runtimebase";
import { Connection, ConnectionOptions, createConnection, QueryFailedError, Repository, Table } from "typeorm";
import { WorkingConfig } from "./config";

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
    addApp(appId: string, appName: string) {
        this.applications.push({
            revisions: [],
            appId,
            appName
        });
    }
    hasRevision(appId: string, revisionNumber: number) {
        return this.getRevision(appId, revisionNumber) !== void 0;
    }
    getRevision(appId: string, revisionNumber: number): IRevision | undefined {
        const app = this.getApp(appId);
        if (app) {
            return app.revisions.find((revision) => { return revision.revision === revisionNumber; });
        }
        return void 0;
    }
    addRevision(runtime: IRuntimeArguments, revision: IRevision) {
        if (!this.hasApp(runtime.appId)) {
            this.addApp(runtime.appId || "unspecified", runtime.appName || "unspecified");
        }
        const app = this.getApp(runtime.appId || "unspecified");
        if (app) {
            if (!this.hasRevision(runtime.appId  || "unspecified", runtime.revision || -1)) {
                app.revisions.push(revision);
            }
        }
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
    flush() {
        this.applications = [];
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
    public static config: Config;
    /*
    * State management for our config registry. What we've loaded etc
    * */
    public static async readConfig() {
        /*
        * Take care of creating all the folders and writing the file if it's empty
        * */
        const workingConfig = await Manager.messageRepository.findOne();

        if (workingConfig && workingConfig.config !== undefined) {
            Manager.config = new Config(JSON.parse(workingConfig.config));
        } else {
            Manager.config = new Config({});
        }
    }
    public static async saveConfig() {
        try {
            const workingConfig = await Manager.messageRepository.findOne();
            if (workingConfig && workingConfig.config !== undefined) {
                workingConfig.config = JSON.stringify(this.config);
                await Manager.connection.manager.save(workingConfig);
            }

        } catch (e) {
            console.error(e);
        }
    }
    /*
    * Revision Helper methods, list, has and get. ToDo: Delete
    * */
    static hasRevision(runtime: Runtime) {
        if (runtime.appId !== void 0) {
            const revision = runtime.revision || -1;
            return Manager.config.getRevision(runtime.appId, revision);
        } else {
            return void 0;
        }
    }
    static async getWorkingCopyForRevision(runtime: Runtime): Promise<IModel | void> {
        if (!Manager.config) {
            await init();
            await Manager.readConfig();
        }
        // @ts-ignore
        if (!Manager.config.hasApp(runtime.appId)) {
            // @ts-ignore
            Manager.config.addApp(runtime.appId || "unspecified", runtime.appName || "unspecified");
            await Manager.saveConfig();
        }

        if (this.hasRevision(runtime)) {
            // @ts-ignore
            const workingCopyId = Manager.config.getRevision(runtime.appId, runtime.revision).workingCopyId;
            runtime.log(`Opening working copy ${workingCopyId} for revision ${runtime.revision} of ${runtime.appName}`);
            monkeyPatchConsole(!runtime.json);
            const iModel = await runtime.getClient().model().openWorkingCopy(workingCopyId)
                .then(async (model) => {
                    return model;
                })
                .catch((error) => {
                    runtime.runtimeError.statusCode = error.statusCode;
                    runtime.runtimeError.name = error.error.name;
                    runtime.runtimeError.message = error.error.message;
                });
            await Manager.saveConfig();
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
            Manager.config.addRevision(runtime, {
                workingCopyId: workingCopy.id(),
                revision: revisionNumber,
                branchName: runtime.branchName,
                mendixVersion: workingCopy.model().metaModelVersion.toString()
            });
            await Manager.saveConfig();
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
                } else {
                    runtime.warn(`I don't know working copy ${workingCopy.id}`);
                    Manager.config.addApp(workingCopy.metaData.projectId, workingCopy.metaData.name);
                    await Manager.saveConfig();
                    const newRuntime = {
                            appId: workingCopy.metaData.projectId,
                            appName: workingCopy.metaData.name,
                            revision: workingCopy.metaData.teamServerBaseRevision && workingCopy.metaData.teamServerBaseRevision.valueOf()
                        },
                        revision = {
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
                    await Manager.saveConfig();
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
            if (!Manager.config.hasApp(runtime.appId)) {
                Manager.config.addApp(runtime.appId || "unspecified", runtime.appName || "unspecified");
                await Manager.saveConfig();
            }
            runtime.blue(`Available revisions:`);
            const
                appId = runtime.appId + "",
                app = Manager.config.getApp(appId);
            if (app !== undefined) {
                if (runtime.json) {
                    return {
                        revisions: app.revisions
                    };
                } else {
                    return app.revisions;
                }
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
        if (runtime.workingCopyId === "*") {
            monkeyPatchConsole(!runtime.json);
            const workingCopies = await runtime.getClient().model().getMyWorkingCopies();
            workingCopies.forEach(async (wc) => {
                await runtime.getClient().model().deleteWorkingCopy(wc.id)
                    .catch((error) => {
                        runtime.runtimeError.statusCode = error.statusCode;
                        runtime.runtimeError.name = error.error.name;
                        runtime.runtimeError.message = error.error.message;
                    });
            });
            Manager.config.flush();
            await Manager.saveConfig();
            monkeyPatchConsole(true);
        } else if (runtime.workingCopyId !== void 0) {
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
            app = Manager.config.getApp(appId),
            revisionNumber = runtime.revision || -1,
            revision = Manager.config.getRevision(appId, revisionNumber);
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
            await runtime.getClient().model().deleteWorkingCopy(revision.workingCopyId)
                .catch((error) => {
                    if (error.name === ErrorCodes.NotFoundError) {
                        runtime.runtimeError.statusCode = error.statusCode;
                        runtime.runtimeError.name = error.error.name;
                        runtime.runtimeError.message = error.error.message;
                    }
                });
            // monkeyPatchConsole(true);
        } else {
            runtime.error(`No working copy found for revision ${runtime.revision} using workingCopyId ${runtime.workingCopyId}`);
        }
        Manager.config.deleteRevision(appId, revisionNumber);
        await Manager.saveConfig();
        return {
            deleted: true,
            workingCopyId: runtime.workingCopyId,
            revision: runtime.revision
        };
    }
    public static homeFolder = `${require("os").homedir()}/.mxsdk`;
    public static registryFilePath = `${Manager.homeFolder}/working-copies.registry.sqlite`;
    public static options: ConnectionOptions = {
        type: "sqlite",
        database: Manager.registryFilePath,
        entities: [WorkingConfig],
        logging: true
    };
    public static connection: Connection;
    public static messageRepository: Repository<WorkingConfig>;
}

async function init() {
    Manager.connection = await createConnection(Manager.options);
    Manager.messageRepository = Manager.connection.getRepository(WorkingConfig);

    try {
        const count = Manager.messageRepository.count();
        console.log(`messageRepository.count()=${await count}`);
    } catch (e) {
        if (e instanceof QueryFailedError) {
            const metadata = Manager.connection.getMetadata(WorkingConfig);
            const newTable = Table.create(metadata, Manager.connection.driver);
            const queryRunner = Manager.connection.createQueryRunner();
            await queryRunner.createTable(newTable);
            await queryRunner.getTable(WorkingConfig.name);
            const workingConfig: WorkingConfig = new WorkingConfig();
            workingConfig.config = JSON.stringify(Manager.config);
            workingConfig.id = 123;
            await Manager.connection.manager.save(workingConfig);
            console.log("workingConfig has been saved. Photo id is", workingConfig.id);
        } else {
            throw e;
        }
    }
    const exitHook = require("exit-hook");
    /*
    * Let's read the config and make sure we write it when we exit.
    * */
    exitHook(async () => {
        await Manager.connection.close();
    });
    Manager.readConfig();
    console.log(JSON.stringify(Manager.config));
}
//
// (async () => {
//     await init().catch(console.error);
// })();