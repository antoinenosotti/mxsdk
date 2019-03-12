import { RuntimeArguments } from "../../runtimearguments";
import { grabSDKObject } from "../../sdk/tools";
import { Manager } from "../workingcopy/manager";

export class Modules {
    public static async fetchModules(runtime: RuntimeArguments) {
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
                runtime.blue(`Summary: `);
                runtime.table(result);
                runtime.blue(`Modules: `);
                runtime.table(result.revision.modules);
                runtime.timeEnd(`\x1b[32mTook\x1b[0m`);
                return result;
            } else {
                modules.forEach((module) => {
                    const mxObject = grabSDKObject(module, runtime);
                    // @ts-ignore
                    result.revision.modules.push(mxObject);
                });
                console.log(JSON.stringify(result));
            }
            return result;
        } else {
            runtime.error(`Could not load revision ${runtime.revision} for app ${runtime.appName}`);
            return runtime.runtimeError;
        }
    }
}
