import { FetchType, Runtime } from "../../runtime";
import { loadAsPromise } from "mendixplatformsdk";
import { Fetch } from "./fetch";
import { datatypes, IModel } from "mendixmodelsdk";
import EntityType = datatypes.EntityType;
import ListType = datatypes.ListType;

interface IRevision {
    branchName: string;
    latestRevisionNumber: number | undefined;
    revision: { number: number | undefined; microflows: any[]; moduleName: string | undefined };
}

interface IFlow {
}

interface IObjectCollection {
}

interface IMircroflowResult {
    name: string;
    id: string;
    microflowReturnType: {
        type: string,
        id: string
    };
    qualifiedName: string | null;
    applyEntityAccess: boolean;
    documentation: string;
    excluded: boolean;
    markAsUsed: boolean;
    flows: IFlow[];
    objectCollection: IObjectCollection[];
}

export class Microflows extends Fetch {
    fetchType = FetchType.Microflows;

    async getResults(workingCopy: IModel, runtime: Runtime): Promise<any> {
        const result: IRevision = {
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

        result.revision.microflows = await Promise.all(microflows.map(async (microflow) => {
            const mxMicroFlow = await loadAsPromise(microflow);
            // mxMicroFlow.objectCollection
            // mxMicroFlow.allowedModuleRolesQualifiedNames,
            const dataType = await loadAsPromise(mxMicroFlow.microflowReturnType);
            const microflowReturnType = {
                type: dataType.constructor.name.replace("Type", "").toLowerCase(),
                id: dataType.id
            };
            if ((dataType instanceof EntityType) || (dataType instanceof ListType)) {
                const entityType = dataType as EntityType;
                // @ts-ignore
                microflowReturnType.entity = {
                    id: entityType.entity.id,
                    name: entityType.entity.name,
                    qualifiedName: entityType.entity.qualifiedName,
                    list: dataType instanceof ListType
                };
            }
            const result: IMircroflowResult = {
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
                } else if (result.microflowReturnType.type === "list") {
                    // @ts-ignore
                    result.microflowReturnType = `${result.microflowReturnType.entity.qualifiedName}[]`;
                } else {
                    // @ts-ignore
                    result.microflowReturnType = result.microflowReturnType.type;
                }
            }
            return result;
        }));
        return runtime.json ? result : result.revision.microflows;
    }
}
