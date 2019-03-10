import { RuntimeArguments } from "../../runtimearguments";
import { Manager } from "../workingcopy/manager";

export class Load {
    public static async loadRevision(runtime: RuntimeArguments) {
        const revision = await Manager.getRevision(runtime);
        const result = {
            workingCopyId: revision.root.id,
            revision: revision.workingCopy.metaData.teamServerBaseRevision,
            branchName: runtime.branchName,
            mendixVersion: revision.metaModelVersion
        };
        if (!runtime.json) {
            runtime.blue(`\nRevision loaded: `);
            runtime.table(result);
            runtime.timeEnd(`\x1b[32mTook\x1b[0m`);
            return result;
        } else {
            console.log(JSON.stringify(result));
            return result;
        }
    }
}