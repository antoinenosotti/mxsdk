import { FetchType, Runtime } from "../../runtime";
import { loadAsPromise } from "mendixplatformsdk";
import { domainmodels } from "mendixmodelsdk";
import StoredValue = domainmodels.StoredValue;
import EnumerationAttributeType = domainmodels.EnumerationAttributeType;
import { Fetch } from "./fetch";
import { IModel } from "mendixmodelsdk/dist/gen/base-model";

interface IRevision {
    branchName: string;
    latestRevisionNumber: number | undefined;
    revision: { number: number | undefined; entities: any[]; moduleName: string | undefined };
}

export class Entities extends Fetch {
    fetchType = FetchType.Entities;

    async getResults(workingCopy: IModel, runtime: Runtime): Promise<any> {
        const domain = workingCopy.allDomainModels().find((domain) => {
            return domain.containerAsModule.name === runtime.module;
        });
        if (domain !== void 0) {
            const result: IRevision = {
                branchName: runtime.branchName,
                latestRevisionNumber: runtime.revision,
                revision: {
                    moduleName: runtime.module,
                    entities: await Promise.all(domain.entities.map(async (entity) => {
                        const mxEntity = await loadAsPromise(entity);
                        const result: any = {
                            id: mxEntity.id,
                            qualifiedName: mxEntity.qualifiedName,
                            name: mxEntity.name,
                            documentation: mxEntity.documentation,
                            dataStorageGuid: mxEntity.dataStorageGuid,
                            remoteSource: mxEntity.remoteSource,
                            attributes: mxEntity.attributes.map((attribute) => {
                                let defaultValue;
                                if (attribute.value instanceof StoredValue) {
                                    defaultValue = (attribute.value as StoredValue).defaultValue;
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
                                    })()
                                };
                            })
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
