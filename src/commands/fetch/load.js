"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const manager_1 = require("../workingcopy/manager");
class Load {
    static loadRevision(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            const revision = yield manager_1.Manager.getRevision(runtime);
            if (revision !== void 0) {
                return {
                    workingCopyId: revision.root.id,
                    revision: revision.workingCopy.metaData.teamServerBaseRevision,
                    branchName: runtime.branchName,
                    mendixVersion: revision.metaModelVersion
                };
            }
            else {
                runtime.error(`Could not load revision. Check if there are still working copies listed against this revision and delete them.`);
                runtime.runtimeError.code = `REVISION-404`;
                return runtime.runtimeError;
            }
        });
    }
}
exports.Load = Load;
//# sourceMappingURL=load.js.map