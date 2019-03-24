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
const mendixmodelsdk_1 = require("mendixmodelsdk");
var StoredValue = mendixmodelsdk_1.domainmodels.StoredValue;
var EnumerationAttributeType = mendixmodelsdk_1.domainmodels.EnumerationAttributeType;
const fetch_1 = require("./fetch");
class Entities extends fetch_1.Fetch {
    constructor() {
        super(...arguments);
        this.fetchType = runtime_1.FetchType.Entities;
    }
    getResults(workingCopy, runtime) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = workingCopy.allDomainModels().find((domain) => {
                return domain.containerAsModule.name === runtime.module;
            });
            if (domain !== void 0) {
                const result = {
                    branchName: runtime.branchName,
                    latestRevisionNumber: runtime.revision,
                    revision: {
                        moduleName: runtime.module,
                        entities: yield Promise.all(domain.entities.map((entity) => __awaiter(this, void 0, void 0, function* () {
                            const mxEntity = yield mendixplatformsdk_1.loadAsPromise(entity);
                            const result = {
                                id: mxEntity.id,
                                qualifiedName: mxEntity.qualifiedName,
                                name: mxEntity.name,
                                documentation: mxEntity.documentation,
                                dataStorageGuid: mxEntity.dataStorageGuid,
                                remoteSource: mxEntity.remoteSource,
                                attributes: mxEntity.attributes.map((attribute) => {
                                    let defaultValue;
                                    if (attribute.value instanceof StoredValue) {
                                        defaultValue = attribute.value.defaultValue;
                                    }
                                    return {
                                        id: attribute.id,
                                        dataStorageGuid: attribute.dataStorageGuid,
                                        documentation: attribute.documentation,
                                        name: attribute.name,
                                        qualifiedName: attribute.qualifiedName,
                                        value: {
                                            id: attribute.value.id,
                                            type: attribute.value.constructor.name.replace("Value", "").toLocaleLowerCase(),
                                            defaultValue
                                        },
                                        type: attribute.type.constructor.name.replace("AttributeType", "").toLocaleLowerCase(),
                                        enumeration: (() => {
                                            if (attribute.type instanceof EnumerationAttributeType) {
                                                const enumerationAttributeType = attribute.type;
                                                return {
                                                    id: enumerationAttributeType.id,
                                                    qualifiedName: enumerationAttributeType.enumerationQualifiedName,
                                                    values: enumerationAttributeType.enumeration.values.map((en) => {
                                                        return {
                                                            id: en.id,
                                                            name: en.name
                                                        };
                                                    })
                                                };
                                            }
                                            return void 0;
                                        })()
                                    };
                                })
                            };
                            return result;
                        }))),
                        number: runtime.revision
                    }
                };
                if (!runtime.json) {
                    result.revision.entities.forEach((entity) => {
                        // @ts-ignore
                        const attributes = entity.attributes.map((attribute) => {
                            return attribute.name;
                        }).join(",");
                        entity.attributes = attributes.substring(0, 30) + (attributes.length > 30 ? "..." : "");
                    });
                }
                return runtime.json ? result : result.revision.entities;
            }
        });
    }
}
exports.Entities = Entities;
//# sourceMappingURL=entities.js.map