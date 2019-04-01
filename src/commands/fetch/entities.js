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
var RequiredRuleInfo = mendixmodelsdk_1.domainmodels.RequiredRuleInfo;
var Generalization = mendixmodelsdk_1.domainmodels.Generalization;
var AssociationOwner = mendixmodelsdk_1.domainmodels.AssociationOwner;
function isPersistable(entity) {
    if (!entity || !entity.generalization) {
        return true;
    } // Default if somehow no info available, this happens when inheriting from entities in the System module which is currently not available in the sdk
    else if (entity.generalization instanceof mendixmodelsdk_1.domainmodels.NoGeneralization) {
        return entity.generalization.persistable;
    }
    else {
        return isPersistable(entity.generalization.generalization);
    }
}
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
                const loadedEntities = {}, associations = yield Promise.all(domain.associations.map((association) => mendixplatformsdk_1.loadAsPromise(association)));
                const result = {
                    branchName: runtime.branchName,
                    latestRevisionNumber: runtime.revision,
                    revision: {
                        moduleName: runtime.module,
                        entities: yield Promise.all(domain.entities.map((entity) => __awaiter(this, void 0, void 0, function* () {
                            const mxEntity = yield mendixplatformsdk_1.loadAsPromise(entity);
                            let attributes = mxEntity.attributes.map(attribute => attribute);
                            const generalizationBase = entity.generalization && (yield mendixplatformsdk_1.loadAsPromise(entity.generalization));
                            let generalization;
                            if (generalizationBase instanceof Generalization) {
                                generalization = generalizationBase;
                            }
                            const getAttributes = (entity, generalization) => __awaiter(this, void 0, void 0, function* () {
                                if (!loadedEntities[entity.qualifiedName + ""]) {
                                    loadedEntities[entity.qualifiedName + ""] = entity;
                                }
                                let result = [];
                                if (generalization) {
                                    const gEntity = yield mendixplatformsdk_1.loadAsPromise(generalization.generalization);
                                    if (!loadedEntities[gEntity.qualifiedName + ""]) {
                                        loadedEntities[gEntity.qualifiedName + ""] = gEntity;
                                    }
                                    result = gEntity.attributes.map(attribute => attribute);
                                    const generalizationBase = gEntity.generalization && (yield mendixplatformsdk_1.loadAsPromise(gEntity.generalization));
                                    if (generalizationBase instanceof Generalization) {
                                        generalization = generalizationBase;
                                        result = result.concat(yield getAttributes(gEntity, generalization));
                                    }
                                }
                                return yield Promise.all(result);
                            });
                            // Add generalizations to attributes list
                            attributes = attributes.concat(yield getAttributes(mxEntity, generalization));
                            if (generalization) {
                                generalization = {
                                    id: generalization.id,
                                    qualifiedName: generalization.generalizationQualifiedName,
                                    type: generalization.constructor.name.toLowerCase()
                                };
                            }
                            // Associations
                            const result = {
                                id: mxEntity.id,
                                qualifiedName: mxEntity.qualifiedName,
                                name: mxEntity.name,
                                documentation: mxEntity.documentation,
                                dataStorageGuid: mxEntity.dataStorageGuid,
                                remoteSource: mxEntity.remoteSource,
                                attributes: attributes.map((attribute) => {
                                    let defaultValue;
                                    if (attribute.value instanceof StoredValue) {
                                        defaultValue = attribute.value.defaultValue;
                                    }
                                    const required = mxEntity.validationRules.find((rule, index) => (rule.attributeQualifiedName === attribute.qualifiedName) && (rule.ruleInfo instanceof RequiredRuleInfo));
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
                                        })(),
                                        required: !!required,
                                        requiredMessage: required && {
                                            translations: required.errorMessage.translations.map((translation) => {
                                                return {
                                                    id: translation.id,
                                                    type: translation.constructor.name.toLowerCase(),
                                                    languageCode: translation.languageCode,
                                                    text: translation.text
                                                };
                                            })
                                        }
                                    };
                                }),
                                persisted: isPersistable(mxEntity),
                                generalization,
                                associations: associations
                                    .filter(association => (association.parent.qualifiedName === mxEntity.qualifiedName)
                                    || ((association.child.qualifiedName === mxEntity.qualifiedName)
                                        && (association.owner === AssociationOwner.Both)))
                                    .map(association => ({
                                    id: association.id,
                                    name: association.name,
                                    qualifiedName: association.qualifiedName,
                                    documentation: association.documentation,
                                    dataStorageGuid: association.dataStorageGuid,
                                    type: association.type.name,
                                    owner: association.owner.name,
                                    entity: association.parent.qualifiedName === mxEntity.qualifiedName ? {
                                        id: association.child.id,
                                        qualifiedName: association.child.qualifiedName
                                    } : {
                                        id: association.parent.id,
                                        qualifiedName: association.parent.qualifiedName
                                    },
                                    parent: association.parent.qualifiedName === entity.qualifiedName,
                                    child: association.parent.qualifiedName !== entity.qualifiedName
                                }))
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