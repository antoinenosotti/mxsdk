import {RuntimeArguments} from "../runtimearguments";
import {WorkingCopyManager} from "../workingcopymanager";

export class Load {
    public static async loadRevision(runtime: RuntimeArguments) {
        const revision = await WorkingCopyManager.getRevision(runtime);
        const result = {
            workingCopyId: revision.root.id,
            revision: runtime.revision,
            branchName: runtime.branchName,
            mendixVersion: revision.metaModelVersion
        };
        if (!runtime.json) {
            runtime.table(result);
            runtime.timeEnd(`Took`);
        } else {
            console.log(JSON.stringify(result));
        }
    }
}