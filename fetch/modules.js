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
function grabSDKObject(model, runtime, skip = ["_properties"]) {
    const result = JSON.parse(JSON.stringify(model));
    for (const propName in model)
        try {
            if ((skip.indexOf(propName) > -1) ||
                propName.startsWith("_") ||
                propName.startsWith("$")) {
                continue;
            }
            // @ts-ignore
            runtime.yellow(`${propName} = ${model[propName]} typeof ${typeof model[propName]}`);
            if (!(model[propName] instanceof Object)) {
                // @ts-ignore
                result[propName] = model[propName];
                //runtime.red(JSON.stringify(module, censor(module), 2));
            }
            else if (model[propName] instanceof Array) {
                // @ts-ignore
                const array = model[propName];
                // @ts-ignore
                result[propName] = [];
                array.forEach((element) => {
                    // @ts-ignore
                    result[propName].push(grabSDKObject(model[propName], runtime));
                });
            }
            else {
                // @ts-ignore
                runtime.red(model[propName].constructor.getName());
                // @ts-ignore
                result[propName] = grabSDKObject(model[propName], runtime);
            }
        }
        catch (e) { }
    for (const propName in result) {
        if (propName.startsWith("$")) {
            delete result[propName];
        }
    }
    return result;
}
class Modules {
    static fetchModules(runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            const workingCopy = yield workingcopymanager_1.WorkingCopyManager.getRevision(runtime);
            const modules = yield workingCopy.allModules();
            modules.forEach((module) => {
                runtime.blue(JSON.stringify(grabSDKObject(module, runtime), null, 2));
                throw new Error('123');
            });
            // runtime.table(modules);
            // runtime.log(JSON.stringify(modules, null, 2));
            // runtime.dir(modules);
            // @ts-ignore
            // runtime.red(JSON.stringify(modules, censor(modules), 2));
        });
    }
}
exports.Modules = Modules;
//# sourceMappingURL=modules.js.map