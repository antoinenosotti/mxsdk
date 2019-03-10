import { RuntimeArguments } from "../runtimearguments";
import { grabSDKObject } from "../sdk/tools";
import { WorkingCopyManager } from "../workingcopymanager";

export class Modules {
    public static async fetchModules(runtime: RuntimeArguments) {
        const workingCopy = await WorkingCopyManager.getRevision(runtime);
        const modules = await workingCopy.allModules();
        const result = {
            branchName: runtime.branchName,
            latestRevisionNumber: runtime.revision,
            revision: {
                modules: [],
                number: runtime.revision
            }
        };
        if (!runtime.json) {
            modules.forEach((module) => {
                // @ts-ignore
                // const mxObject = grabSDKObject(module, runtime);
                result.revision.modules.push(`${module.name}`);
            });
            runtime.log(`Modules: `);
            runtime.table(result);
            runtime.timeEnd(`Took`);
        } else {
            modules.forEach((module) => {
                // @ts-ignore
                const mxObject = grabSDKObject(module, runtime);
                // @ts-ignore
                result.revision.modules.push(mxObject);
            });
            console.log(JSON.stringify(result));
        }
    }
}
