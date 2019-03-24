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
const runtime_1 = require("../../runtime");
const mendixplatformsdk_1 = require("mendixplatformsdk");
const fetch_1 = require("./fetch");
const mendixmodelsdk_1 = require("mendixmodelsdk");
var EntityType = mendixmodelsdk_1.datatypes.EntityType;
var ListType = mendixmodelsdk_1.datatypes.ListType;
class Microflows extends fetch_1.Fetch {
    constructor() {
        super(...arguments);
        this.fetchType = runtime_1.FetchType.Microflows;
    }
    getResults(workingCopy, runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = {
                branchName: runtime.branchName,
                latestRevisionNumber: runtime.revision,
                revision: {
                    moduleName: runtime.module,
                    microflows: [],
                    number: runtime.revision
                }
            };
            const microflows = workingCopy.allServerSideMicroflows().filter((microflow) => {
                if (microflow.qualifiedName !== null) {
                    return (microflow.qualifiedName.indexOf(runtime.module + "") === 0) || (runtime.module === "*");
                }
                return false;
            });
            result.revision.microflows = yield Promise.all(microflows.map((microflow) => __awaiter(this, void 0, void 0, function* () {
                const mxMicroFlow = yield mendixplatformsdk_1.loadAsPromise(microflow);
                // mxMicroFlow.objectCollection
                // mxMicroFlow.allowedModuleRolesQualifiedNames,
                const dataType = yield mendixplatformsdk_1.loadAsPromise(mxMicroFlow.microflowReturnType);
                const microflowReturnType = {
                    type: dataType.constructor.name.replace("Type", "").toLowerCase(),
                    id: dataType.id
                };
                if ((dataType instanceof EntityType) || (dataType instanceof ListType)) {
                    const entityType = dataType;
                    // @ts-ignore
                    microflowReturnType.entity = {
                        id: entityType.entity.id,
                        name: entityType.entity.name,
                        qualifiedName: entityType.entity.qualifiedName,
                        list: dataType instanceof ListType
                    };
                }
                const result = {
                    name: mxMicroFlow.name,
                    id: mxMicroFlow.id,
                    microflowReturnType,
                    qualifiedName: mxMicroFlow.qualifiedName,
                    applyEntityAccess: mxMicroFlow.applyEntityAccess,
                    documentation: mxMicroFlow.documentation,
                    excluded: mxMicroFlow.excluded,
                    markAsUsed: mxMicroFlow.markAsUsed,
                    flows: mxMicroFlow.flows.map((flow) => {
                        return {
                            id: flow.id,
                            destination: {
                                id: flow.destination.id
                            },
                            origin: {
                                id: flow.origin.id
                            }
                        };
                    }),
                    objectCollection: mxMicroFlow.objectCollection.objects.map((object) => {
                        return {
                            id: object.id,
                            type: object.constructor.name
                        };
                    })
                };
                if (!runtime.json) {
                    delete result.flows;
                    delete result.objectCollection;
                    if (result.microflowReturnType.type === "object") {
                        // @ts-ignore
                        result.microflowReturnType = result.microflowReturnType.entity.qualifiedName;
                    }
                    else if (result.microflowReturnType.type === "list") {
                        // @ts-ignore
                        result.microflowReturnType = `${result.microflowReturnType.entity.qualifiedName}[]`;
                    }
                    else {
                        // @ts-ignore
                        result.microflowReturnType = result.microflowReturnType.type;
                    }
                }
                return result;
            })));
            return runtime.json ? result : result.revision.microflows;
        });
    }
}
exports.Microflows = Microflows;
//# sourceMappingURL=microflows.js.map