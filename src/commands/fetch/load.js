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
            }
            else {
                console.log(JSON.stringify(result));
                return result;
            }
        });
    }
}
exports.Load = Load;
//# sourceMappingURL=load.js.map