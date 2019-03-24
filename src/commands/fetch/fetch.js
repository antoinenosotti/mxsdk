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
class Fetch {
    fetch(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            const workingCopy = yield manager_1.Manager.getWorkingCopyForRevision(runtime);
            if (workingCopy !== void 0) {
                const result = yield this.getResults(workingCopy, runtime);
                if (!runtime.json) {
                    runtime.log(`${this.fetchType}: `);
                }
                return result;
            }
            else {
                runtime.error(`Could not load revision ${runtime.revision} for app ${runtime.appName}`);
                return runtime.runtimeError;
            }
        });
    }
}
exports.Fetch = Fetch;
//# sourceMappingURL=Fetch.js.map