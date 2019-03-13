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
const tools_1 = require("../../sdk/tools");
const manager_1 = require("../workingcopy/manager");
class Microflows {
    static fetchMicroflows(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            const workingCopy = yield manager_1.Manager.getWorkingCopyForRevision(runtime);
            if (workingCopy !== void 0) {
                const microflows = yield Promise.all(workingCopy.allMicroflows().map((microflow) => __awaiter(this, void 0, void 0, function* () {
                    const promise = yield (new Promise((resolve, reject) => {
                        microflow.load((mf) => {
                            resolve(mf);
                            // @ts-ignore
                            mf.moduleName = mf.qualifiedName.split(".")[0];
                            // @ts-ignore
                            mf.fullPath = mf.qualifiedName;
                            mf.
                            ;
                        });
                    }));
                    return yield microflow;
                })));
                const result = {
                    branchName: runtime.branchName,
                    latestRevisionNumber: runtime.revision,
                    revision: {
                        microflows: [],
                        number: runtime.revision
                    }
                };
                if (!runtime.json) {
                    yield microflows.forEach((module) => __awaiter(this, void 0, void 0, function* () {
                        // @ts-ignore
                        result.revision.microflows.push(`${module.name}`);
                    }));
                    runtime.log(`Modules: `);
                    return result.revision.microflows;
                }
                else {
                    yield microflows.forEach((module) => __awaiter(this, void 0, void 0, function* () {
                        yield module.asLoaded();
                        const mxObject = tools_1.grabSDKObject(module, runtime);
                        // @ts-ignore
                        result.revision.microflows.push(mxObject);
                    }));
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
exports.Microflows = Microflows;
//# sourceMappingURL=microflows.js.map