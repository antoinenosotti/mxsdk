import { FetchType, Runtime } from "../../runtime";
import { loadAsPromise } from "mendixplatformsdk";
import { domainmodels } from "mendixmodelsdk";
import StoredValue = domainmodels.StoredValue;
import EnumerationAttributeType = domainmodels.EnumerationAttributeType;
import { Fetch } from "./fetch";
import { IModel } from "mendixmodelsdk/dist/gen/base-model";
import DecimalAttributeType = domainmodels.DecimalAttributeType;
import RequiredRuleInfo = domainmodels.RequiredRuleInfo;
import Generalization = domainmodels.Generalization;
import Attribute = domainmodels.Attribute;
import Entity = domainmodels.Entity;
import GeneralizationBase = domainmodels.GeneralizationBase;
import AssociationOwner = domainmodels.AssociationOwner;
import IEntity = domainmodels.IEntity;

interface IRevision {
    branchName: string;
    latestRevisionNumber: number | undefined;
    revision: { number: number | undefined; entities: any[]; moduleName: string | undefined };
}

function isPersistable(entity: domainmodels.IEntity): boolean {
    if (!entity || !entity.generalization) {
        return true;
    } // Default if somehow no info available, this happens when inheriting from entities in the System module which is currently not available in the sdk
    else if (entity.generalization instanceof domainmodels.NoGeneralization) {
        return (<domainmodels.INoGeneralization>entity.generalization).persistable;
 }
    else {
        return isPersistable((<domainmodels.IGeneralization>entity.generalization).generalization);
 }
}

export class Entities extends Fetch {
    fetchType = FetchType.Entities;

    async getResults(workingCopy: IModel, runtime: Runtime): Promise<any> {
        const domain = workingCopy.allDomainModels().find((domain) => {
            return domain.containerAsModule.name === runtime.module;
        });
        if (domain !== void 0) {
            const loadedEntities: {
                    [name: string]: Entity;
                } = {},
                associations = await Promise.all(domain.associations.map((association) => loadAsPromise(association)));
            const result: IRevision = {
                branchName: runtime.branchName,
                latestRevisionNumber: runtime.revision,
                revision: {
                    moduleName: runtime.module,
                    entities: await Promise.all(domain.entities.map(async (entity) => {
                        const
                            mxEntity = await loadAsPromise(entity);
                        let
                            attributes = mxEntity.attributes.map(attribute => attribute);
                        const generalizationBase = entity.generalization && await loadAsPromise(entity.generalization);
                        let generalization;
                        if (generalizationBase instanceof Generalization) {
                            generalization = generalizationBase as Generalization;
                        }
                        const getAttributes = async (entity: Entity, generalization: Generalization | undefined): Promise<Attribute[]> => {
                            if (!loadedEntities[entity.qualifiedName + ""]) {
                                loadedEntities[entity.qualifiedName + ""] = entity;
                            }
                            let result: Attribute[] = [];
                            if (generalization) {
                                const gEntity = await loadAsPromise(generalization.generalization);
                                if (!loadedEntities[gEntity.qualifiedName + ""]) {
                                    loadedEntities[gEntity.qualifiedName + ""] = gEntity;
                                }
                                result = gEntity.attributes.map(attribute => attribute);
                                const generalizationBase = gEntity.generalization && await loadAsPromise(gEntity.generalization);
                                if (generalizationBase instanceof Generalization) {
                                    generalization = generalizationBase as Generalization;
                                    result = result.concat(await getAttributes(gEntity, generalization));
                                }
                            }
                            return await Promise.all(result);
                        };
                        // Add generalizations to attributes list
                        attributes = attributes.concat(await getAttributes(mxEntity, generalization));
                        if (generalization) {
                            generalization = {
                                id: generalization.id,
                                qualifiedName: generalization.generalizationQualifiedName,
                                type: generalization.constructor.name.toLowerCase()
                            };
                        }
                        // Associations
                        const result: any = {
                            id: mxEntity.id,
                            qualifiedName: mxEntity.qualifiedName,
                            name: mxEntity.name,
                            documentation: mxEntity.documentation,
                            dataStorageGuid: mxEntity.dataStorageGuid,
                            remoteSource: mxEntity.remoteSource,
                            attributes: attributes.map((attribute) => {
                                let defaultValue;
                                if (attribute.value instanceof StoredValue) {
                                    defaultValue = (attribute.value as StoredValue).defaultValue;
                                }
                                const required = mxEntity.validationRules.find((rule, index) =>
                                    (rule.attributeQualifiedName === attribute.qualifiedName) && (rule.ruleInfo instanceof RequiredRuleInfo));
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
                                            const enumerationAttributeType: EnumerationAttributeType = attribute.type as EnumerationAttributeType;
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
                    })),
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
    }
}
