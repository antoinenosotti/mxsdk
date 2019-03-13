import { Runtime } from "../../runtime";
import { grabSDKObject } from "../../sdk/tools";
import { Manager } from "../workingcopy/manager";
import { microflows } from "mendixmodelsdk";

export class Microflows {
    public static async fetchMicroflows(runtime: Runtime) {
        const workingCopy = await Manager.getWorkingCopyForRevision(runtime);
        if (workingCopy !== void 0) {
            const microflows = await Promise.all(workingCopy.allMicroflows().map(async (microflow) => {
                const promise = await (new Promise<microflows.Microflow>((resolve, reject) => {
                    microflow.load((mf) => {
                        resolve(mf);
                        // @ts-ignore
                        mf.moduleName = mf.qualifiedName.split(".")[0];
                        // @ts-ignore
                        mf.fullPath = mf.qualifiedName;
                        mf.
                    });
                }));
                return await microflow;
            }));
            const result = {
                branchName: runtime.branchName,
                latestRevisionNumber: runtime.revision,
                revision: {
                    microflows: [],
                    number: runtime.revision
                }
            };
            if (!runtime.json) {
                await microflows.forEach(async (module) => {
                    // @ts-ignore
                    result.revision.microflows.push(`${module.name}`);
                });
                runtime.log(`Modules: `);
                return result.revision.microflows;
            } else {
                await microflows.forEach(async (module) => {
                    await module.asLoaded();
                    const mxObject = grabSDKObject(module, runtime);
                    // @ts-ignore
                    result.revision.microflows.push(mxObject);
                });
            }
            return result;
        } else {
            runtime.error(`Could not load revision ${runtime.revision} for app ${runtime.appName}`);
            return runtime.runtimeError;
        }
    }
}
