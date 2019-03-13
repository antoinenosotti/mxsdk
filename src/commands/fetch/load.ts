import { Runtime } from "../../runtime";
import { Manager } from "../workingcopy/manager";

export class Load {
    public static async loadRevision(runtime: Runtime) {
        const revision = await Manager.getWorkingCopyForRevision(runtime);
        if (revision !== void 0) {
            return {
                workingCopyId: revision.workingCopy.id,
                revision: revision.workingCopy.metaData.teamServerBaseRevision,
                branchName: runtime.branchName,
                mendixVersion: revision.metaModelVersion
            };
        } else {
            runtime.error(`Could not load revision. Check if there are still working copies listed against this revision and delete them.`);
            runtime.runtimeError.code = `REVISION-404`;
            return runtime.runtimeError;
        }
    }
}