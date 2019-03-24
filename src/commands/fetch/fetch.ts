import { IModel } from "mendixmodelsdk";
import { Runtime } from "../../runtime";
import { Manager } from "../workingcopy/manager";

export abstract class Fetch {
    abstract async getResults(workingCopy: IModel, runtime: Runtime): Promise<any>;
    abstract fetchType: string;
    public async fetch(runtime: Runtime) {
        const workingCopy = await Manager.getWorkingCopyForRevision(runtime);
        if (workingCopy !== void 0) {
            const result = await this.getResults(workingCopy, runtime);
            if (!runtime.json) {
                runtime.log(`${this.fetchType}: `);
            }
            return result;
        } else {
            runtime.error(`Could not load revision ${runtime.revision} for app ${runtime.appName}`);
            return runtime.runtimeError;
        }
    }
}