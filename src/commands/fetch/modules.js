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
class Modules {
    static fetchModules(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            const workingCopy = yield manager_1.Manager.getRevision(runtime);
            if (workingCopy !== void 0) {
                const modules = yield workingCopy.allModules();
                const result = {
                    branchName: runtime.branchName,
                    latestRevisionNumber: runtime.revision,
                    revision: {
                        modules: [],
                        number: runtime.revision
                    }
                };
                if (!runtime.json) {
                    modules.forEach((module) => {
                        // @ts-ignore
                        result.revision.modules.push(`${module.name}`);
                    });
                    runtime.blue(`Summary: `);
                    runtime.table(result);
                    runtime.blue(`Modules: `);
                    runtime.table(result.revision.modules);
                    runtime.timeEnd(`\x1b[32mTook\x1b[0m`);
                    return result;
                }
                else {
                    modules.forEach((module) => {
                        // @ts-ignore
                        const mxObject = tools_1.grabSDKObject(module, runtime);
                        // @ts-ignore
                        result.revision.modules.push(mxObject);
                    });
                    console.log(JSON.stringify(result));
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
exports.Modules = Modules;
//# sourceMappingURL=modules.js.map