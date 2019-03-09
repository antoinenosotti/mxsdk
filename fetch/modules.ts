import {RuntimeArguments} from "../runtimearguments";
import {WorkingCopyManager} from "../workingcopymanager";
import {grabSDKObject} from "../sdk/tools";

export class Modules {
    public static async fetchModules(runtime: RuntimeArguments) {
        const workingCopy = await WorkingCopyManager.getRevision(runtime);
        const modules = await workingCopy.allModules();
        const result = {
            modules: []
        };
        modules.forEach((module) => {
            // @ts-ignore
            result.modules.push(grabSDKObject(module, runtime));
        });
        if (!runtime.json) {
            runtime.log(`Modules: `);
            runtime.table(result.modules);
        } else {
            console.log(JSON.stringify(result));
        }
    }
}