import { RuntimeArguments } from "../../../runtimearguments";
import { grabSDKObject } from "../../sdk/tools";
import { Manager } from "../workingcopy/manager";

export class Modules {
    public static async fetchModules(runtime: RuntimeArguments) {
        const workingCopy = await Manager.getRevision(runtime);
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
            runtime.timeEnd(`\x1b[32mTook\x1b[0m`);
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
