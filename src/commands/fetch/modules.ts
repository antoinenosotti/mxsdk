import { Runtime } from "../../runtime";
import { IModel, projects } from "mendixmodelsdk";
import IModule = projects.IModule;
import { Fetch } from "./fetch";

interface IRevision {
    branchName: string;
    latestRevisionNumber: number;
    revision: { number: number; modules: IModule[] };
}

export class Modules extends Fetch {
    fetchType = "Modules";
    public async getResults(workingCopy: IModel, runtime: Runtime) {
        const modules = await workingCopy.allModules();
        const result: IRevision = {
            branchName: runtime.branchName,
            latestRevisionNumber: runtime.revision || -1,
            revision: {
                modules: [],
                number: runtime.revision || -1
            }
        };
        modules.forEach((module) => {
            // @ts-ignore
            result.revision.modules.push({
                name: module.name,
                appStoreGuid: module.appStoreGuid,
                appStoreVersion: module.appStoreVersion,
                appStoreVersionGuid: module.appStoreVersionGuid,
                fromAppStore: module.fromAppStore,
                sortIndex: module.sortIndex,
                id: module.id
            });
        });
        return runtime.json ? result : result.revision.modules;
    }
}
