import { Runtime } from "../../runtime";
import { grabSDKObject } from "../../sdk/tools";
import { Manager } from "../workingcopy/manager";

export class Modules {
    public static async fetchModules(runtime: Runtime) {
        const workingCopy = await Manager.getRevision(runtime);
        if (workingCopy !== void 0) {
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
                    result.revision.modules.push(`${module.name}`);
                });
                runtime.log(`Modules: `);
                return result.revision.modules;
            } else {
                modules.forEach((module) => {
                    const mxObject = grabSDKObject(module, runtime);
                    // @ts-ignore
                    result.revision.modules.push(mxObject);
                });
            }
            return result;
        } else {
            runtime.error(`Could not load revision ${runtime.revision} for app ${runtime.appName}`);
            return runtime.runtimeError;
        }
    }
}
