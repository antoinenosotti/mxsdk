import { RuntimeArguments } from "../../../runtimearguments";
import { Manager } from "../workingcopy/manager";

export class Load {
    public static async loadRevision(runtime: RuntimeArguments) {
        const revision = await Manager.getRevision(runtime);
        const result = {
            workingCopyId: revision.root.id,
            revision: runtime.revision,
            branchName: runtime.branchName,
            mendixVersion: revision.metaModelVersion
        };
        if (!runtime.json) {
            runtime.blue(`\nRevision loaded: `);
            runtime.table(result);
            runtime.timeEnd(`\x1b[32mTook\x1b[0m`);
        } else {
            console.log(JSON.stringify(result));
        }
    }
}