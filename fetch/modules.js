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
const workingcopymanager_1 = require("../workingcopymanager");
const tools_1 = require("../sdk/tools");
class Modules {
    static fetchModules(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            const workingCopy = yield workingcopymanager_1.WorkingCopyManager.getRevision(runtime);
            const modules = yield workingCopy.allModules();
            const result = {
                modules: []
            };
            modules.forEach((module) => {
                // @ts-ignore
                result.modules.push(tools_1.grabSDKObject(module, runtime));
            });
            if (!runtime.json) {
                runtime.log(`Modules: `);
                runtime.table(result.modules);
            }
            else {
                console.log(JSON.stringify(result));
            }
        });
    }
}
exports.Modules = Modules;
//# sourceMappingURL=modules.js.map