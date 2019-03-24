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
const fetch_1 = require("./fetch");
class Modules extends fetch_1.Fetch {
    constructor() {
        super(...arguments);
        this.fetchType = "Modules";
    }
    getResults(workingCopy, runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            const modules = yield workingCopy.allModules();
            const result = {
                branchName: runtime.branchName,
                latestRevisionNumber: runtime.revision || -1,
                revision: {
                    modules: [],
                    number: runtime.revision || -1
                }
            };
            modules.forEach((module) => {
                // @ts-ignore
                result.revision.modules.push({
                    name: module.name,
                    appStoreGuid: module.appStoreGuid,
                    appStoreVersion: module.appStoreVersion,
                    appStoreVersionGuid: module.appStoreVersionGuid,
                    fromAppStore: module.fromAppStore,
                    sortIndex: module.sortIndex,
                    id: module.id
                });
            });
            return runtime.json ? result : result.revision.modules;
        });
    }
}
exports.Modules = Modules;
//# sourceMappingURL=modules.js.map