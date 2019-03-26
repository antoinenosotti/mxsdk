import * as fs from "fs";

export interface ILogicalType {
    type: string;
    name: string;
    symbols: string[] | undefined;
}

export interface IField {
    name: string;
    type: (string | ILogicalType)[];
    doc: string;
    default: any | null;
}

const sampleDomain = {
    branchName: "Edubond",
    latestRevisionNumber: 11,
    revision: {
        moduleName: "TeamWorks",
        entities: [
            {
                id: "db8523d0-5c46-4b79-a30b-8435737253b4",
                qualifiedName: "TeamWorks.AgentInfo",
                name: "AgentInfo",
                documentation: "",
                dataStorageGuid: "0280b73b-f8cd-4493-bf21-e9be2139d843",
                remoteSource: "",
                attributes: []
            },
            {
                id: "180c3717-3e28-4679-a56c-f39884c01cbd",
                qualifiedName: "TeamWorks.Skill",
                name: "Skill",
                documentation: "",
                dataStorageGuid: "804586df-34ba-4162-9934-2334168547cd",
                remoteSource: "",
                attributes: [
                    {
                        id: "33dfc459-bbf9-4eca-bbf0-c3f300a2bc84",
                        dataStorageGuid: "1c6209be-d375-4ea4-8cbe-bce26be65122",
                        documentation: "",
                        name: "Name",
                        qualifiedName: "TeamWorks.Skill.Name",
                        value: {
                            id: "ce7353e1-8605-450f-a302-bdf8f842459b",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    }
                ]
            },
            {
                id: "a1c918ee-3185-47b1-ad66-3b087b2493b3",
                qualifiedName: "TeamWorks.Brand",
                name: "Brand",
                documentation: "",
                dataStorageGuid: "71122f39-3071-4c6a-8a45-f640e75a1957",
                remoteSource: "",
                attributes: [
                    {
                        id: "5069f26e-4810-47eb-a9d1-0c39564e6c1c",
                        dataStorageGuid: "86894760-ecf8-4a5e-b50e-a515a2c4e2f1",
                        documentation: "",
                        name: "Name",
                        qualifiedName: "TeamWorks.Brand.Name",
                        value: {
                            id: "c19758d5-01f3-43b4-aa78-d8c2aae323dc",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    }
                ]
            },
            {
                id: "2a0b8734-d3c4-411c-892b-d8f40710b331",
                qualifiedName: "TeamWorks.Company",
                name: "Company",
                documentation: "",
                dataStorageGuid: "97219a28-b591-4be2-bc95-60bd03cbfaf7",
                remoteSource: "",
                attributes: []
            },
            {
                id: "6bb756ba-18cf-4aa2-add7-1d5cf8449459",
                qualifiedName: "TeamWorks.Task",
                name: "Task",
                documentation: "This is the main task item an agent will be working on",
                dataStorageGuid: "28d97e2d-af8b-4bfb-afa1-b517c62f0008",
                remoteSource: "",
                attributes: [
                    {
                        id: "a6ed89fe-fc5b-4cc8-bcc6-9576f0039d8d",
                        dataStorageGuid: "95194582-3e61-4d4d-9a04-43a075815237",
                        documentation: "The state of the Task",
                        name: "State",
                        qualifiedName: "TeamWorks.Task.State",
                        value: {
                            id: "1551e526-5208-425e-a8ee-c6e28063544d",
                            type: "stored",
                            defaultValue: "Created"
                        },
                        type: "enumeration",
                        enumeration: {
                            id: "03329dd9-415d-4233-bfa5-727b40ff77b8",
                            qualifiedName: "TeamWorks.TaskStateEnum",
                            values: [
                                {
                                    id: "ef562f06-3dff-452a-b23e-b936d161d943",
                                    name: "Created"
                                },
                                {
                                    id: "bd4a2b9d-0209-4149-a988-dada938ac703",
                                    name: "Working"
                                },
                                {
                                    id: "1a1a4249-6ed5-4df4-9e88-718e3aa9a411",
                                    name: "Paused"
                                },
                                {
                                    id: "598df2a0-1336-43f5-9963-161a78abacf2",
                                    name: "Waiting"
                                },
                                {
                                    id: "daeb031d-0429-4bb7-8029-6ece34eea463",
                                    name: "Scheduled"
                                },
                                {
                                    id: "ad142f63-694e-4f36-85ba-cdf797f4524f",
                                    name: "Done"
                                },
                                {
                                    id: "13f2a95b-9aed-4274-bfc1-aa4aae27e00d",
                                    name: "Cancelled"
                                },
                                {
                                    id: "2b487983-1b35-49ae-938c-e32de970ff37",
                                    name: "Deleted"
                                }
                            ]
                        },
                        required: true,
                        requiredMessage: {
                            translations: [
                                {
                                    id: "2eb69f98-694c-5e3d-b5c9-f5b8f8bd1f3e",
                                    type: "translation",
                                    languageCode: "en_US",
                                    text: "Required"
                                }
                            ]
                        }
                    },
                    {
                        id: "38586b9b-9a7e-4363-8c0f-28ecd6c09363",
                        dataStorageGuid: "353376ef-9935-4eaf-9a0c-bf19c0c805e0",
                        documentation: "Priority determines how high up the queue this is",
                        name: "Priority",
                        qualifiedName: "TeamWorks.Task.Priority",
                        value: {
                            id: "98481f0e-6119-44b9-9261-f11fe1e6a1ff",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "decimal",
                        required: false
                    },
                    {
                        id: "8e2e3e4e-eece-4680-b724-4b83629343dc",
                        dataStorageGuid: "5e291164-d728-42f6-b913-213777b36f7e",
                        documentation: "",
                        name: "StartDate",
                        qualifiedName: "TeamWorks.Task.StartDate",
                        value: {
                            id: "73fe8300-b83a-4ed3-9512-c9e1a44521e8",
                            type: "stored",
                            defaultValue: "[%CurrentDateTime%]"
                        },
                        type: "datetime",
                        required: false
                    },
                    {
                        id: "e94bddc4-9779-4271-87d1-e9dfeb8ea497",
                        dataStorageGuid: "8c8729dd-6802-4cb9-bc09-2ce5702d64e0",
                        documentation: "",
                        name: "EndDate",
                        qualifiedName: "TeamWorks.Task.EndDate",
                        value: {
                            id: "1f50ecea-1cf3-41ea-a3ef-dc58d51e70e3",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "datetime",
                        required: false
                    },
                    {
                        id: "968d0a4b-642c-41d9-8b44-f2da616ce155",
                        dataStorageGuid: "8836630d-e9b2-4bb9-ab74-a33d9526cbda",
                        documentation: "",
                        name: "WorkTime",
                        qualifiedName: "TeamWorks.Task.WorkTime",
                        value: {
                            id: "db8b3c3e-85e6-42b3-b7b1-4c3bcebc7632",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "long",
                        required: false
                    },
                    {
                        id: "983a1fb7-a61b-473c-8fb1-1f5166c79c98",
                        dataStorageGuid: "35bfb916-7185-4a73-b143-7d2cecfb5913",
                        documentation: "",
                        name: "WaitTime",
                        qualifiedName: "TeamWorks.Task.WaitTime",
                        value: {
                            id: "c4c0b2ea-dc9d-4358-87f1-eb92340b4674",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "long",
                        required: false
                    },
                    {
                        id: "db54ff21-e40b-4878-9272-08695c099f5f",
                        dataStorageGuid: "4ada3edf-6def-4448-8b72-8f3f33560cef",
                        documentation: "",
                        name: "Closed",
                        qualifiedName: "TeamWorks.Task.Closed",
                        value: {
                            id: "c3c78ad8-397a-45a5-bfb9-aa6f556bf52d",
                            type: "stored",
                            defaultValue: "false"
                        },
                        type: "boolean",
                        required: false
                    },
                    {
                        id: "facad64c-7f5d-4f57-91b9-9507d6414040",
                        dataStorageGuid: "c4cf6a6e-993c-40a5-851f-0a0e3594710d",
                        documentation: "",
                        name: "BrandId",
                        qualifiedName: "TeamWorks.Task.BrandId",
                        value: {
                            id: "57acf6d4-7e8c-4827-b9ad-5995fcdc1f64",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "integer",
                        required: false
                    },
                    {
                        id: "7d00ed51-f699-4ff5-9f87-e82ca2cc263d",
                        dataStorageGuid: "97b06790-2112-471e-8fa6-0fa04ab796e5",
                        documentation: "",
                        name: "ErrorMessage",
                        qualifiedName: "TaskManager.Task.ErrorMessage",
                        value: {
                            id: "29b0e642-0a98-4be6-9fc8-0c4a1d5c3a83",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "7dbd89cf-a3c1-4f2b-9157-77f6c1bd24bf",
                        dataStorageGuid: "8278a37e-12f2-4f3f-a963-9f1637487258",
                        documentation: "",
                        name: "TaskStatus",
                        qualifiedName: "TaskManager.Task.TaskStatus",
                        value: {
                            id: "39687dcf-cfb0-4139-9563-a9d671bbeb50",
                            type: "stored",
                            defaultValue: "To_Do"
                        },
                        type: "enumeration",
                        enumeration: {
                            id: "99b725ae-0511-4498-88f2-29cd76d843c0",
                            qualifiedName: "TaskManager.TaskStatusEnum",
                            values: [
                                {
                                    id: "86a818a2-641c-47b2-8c1d-aa90a4d1591f",
                                    name: "To_Do"
                                },
                                {
                                    id: "6e97d133-9ade-4e7f-8624-4eb5f8c0f6e9",
                                    name: "In_Progress"
                                },
                                {
                                    id: "ec8e2bdb-c020-4b3c-a3af-149b1a0a59a2",
                                    name: "Done"
                                },
                                {
                                    id: "14ef2226-14cc-4c83-820a-72a4b60e5753",
                                    name: "Skip"
                                },
                                {
                                    id: "7c8d0b22-b1f6-4556-af76-ad4026576cba",
                                    name: "Error"
                                }
                            ]
                        },
                        required: false
                    },
                    {
                        id: "598f4362-72a6-452c-9f96-69fedd8c03e2",
                        dataStorageGuid: "7d355e6a-6fac-4c68-ae95-cded673b642e",
                        documentation: "",
                        name: "ExpiryDate",
                        qualifiedName: "TaskManager.Task.ExpiryDate",
                        value: {
                            id: "6450cffc-3978-4497-9e80-20005d4fd195",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "datetime",
                        required: false
                    },
                    {
                        id: "c0176448-40d2-426a-bd2e-c718c3454985",
                        dataStorageGuid: "2c0c5c6a-1b4a-4889-9b54-27c8bc46467d",
                        documentation: "",
                        name: "Stop",
                        qualifiedName: "TaskManager.Task.Stop",
                        value: {
                            id: "c4ddd048-5634-4d17-88f2-8e719b6aece0",
                            type: "stored",
                            defaultValue: "false"
                        },
                        type: "boolean",
                        required: false
                    },
                    {
                        id: "7ffa6a8d-c9ef-4502-a7e1-e579aa0e2471",
                        dataStorageGuid: "12c91416-0c44-4504-995f-17bcf090a7dc",
                        documentation: "",
                        name: "StopReason",
                        qualifiedName: "TaskManager.Task.StopReason",
                        value: {
                            id: "2938a372-3cf1-4d6a-ba66-e8e2e1453ff3",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "93b8813e-ed04-42bf-a04e-8aa5ef301db5",
                        dataStorageGuid: "5adda8d7-328d-453d-b2ad-4961eeb52e61",
                        documentation: "",
                        name: "TaskId",
                        qualifiedName: "TaskManager.Task.TaskId",
                        value: {
                            id: "eebb659d-6634-41e8-8a43-adfeb342b65c",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "long",
                        required: false
                    },
                    {
                        id: "16ab6514-dde5-4ab0-82f2-989d76e2f631",
                        dataStorageGuid: "bc3774ea-103c-4bb4-ba07-253434297cfa",
                        documentation: "",
                        name: "ActionNumber",
                        qualifiedName: "ProcessQueue.QueuedAction.ActionNumber",
                        value: {
                            id: "6b61ed8b-c6a4-4ea7-bab2-f66f483259a5",
                            type: "stored",
                            defaultValue: "1"
                        },
                        type: "autonumber",
                        required: false
                    },
                    {
                        id: "cf796e07-50cf-4cf7-a368-36d209ce0370",
                        dataStorageGuid: "442dcbcb-d34b-4ce5-8092-724c5a83f8a7",
                        documentation: "",
                        name: "QueueNumber",
                        qualifiedName: "ProcessQueue.QueuedAction.QueueNumber",
                        value: {
                            id: "3b1c65fb-4620-4412-ab25-a366814d1342",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "integer",
                        required: false
                    },
                    {
                        id: "b02a66b7-8d4e-46cf-9841-45444486c0d5",
                        dataStorageGuid: "e56ed96d-b521-4a7c-8039-ccf2fd4eb977",
                        documentation: "",
                        name: "Phase",
                        qualifiedName: "ProcessQueue.QueuedAction.Phase",
                        value: {
                            id: "63e74977-3b95-4018-ab85-b934d1a3fb3a",
                            type: "stored",
                            defaultValue: "Unqueued"
                        },
                        type: "enumeration",
                        enumeration: {
                            id: "e392ef4e-faf0-4316-bfa4-74bee2cf153a",
                            qualifiedName: "ProcessQueue.ActionStatus",
                            values: [
                                {
                                    id: "9da68a95-3d9f-4677-acde-bd2356324c7b",
                                    name: "Unqueued"
                                },
                                {
                                    id: "34f218e9-a9ea-471d-b9ac-17eb48deb1c1",
                                    name: "Queued"
                                },
                                {
                                    id: "541598ba-a35f-46b0-9670-a50a957a3e9d",
                                    name: "Running"
                                },
                                {
                                    id: "443c711e-813e-4d1b-a34d-237524efa123",
                                    name: "Finished"
                                },
                                {
                                    id: "1300e8cc-e153-4d44-b744-3a6e60511a42",
                                    name: "Cancelled"
                                }
                            ]
                        },
                        required: false
                    },
                    {
                        id: "73ada371-efa1-4d06-86de-0e8645a66199",
                        dataStorageGuid: "758e8272-7db9-4f79-b202-a517defe686a",
                        documentation: "",
                        name: "Status",
                        qualifiedName: "ProcessQueue.QueuedAction.Status",
                        value: {
                            id: "4bff4109-6de6-4424-864f-a3bf35bb6a65",
                            type: "stored",
                            defaultValue: "NotExecuted"
                        },
                        type: "enumeration",
                        enumeration: {
                            id: "2c1fc119-4077-45cb-bc42-90be7d1ca6b6",
                            qualifiedName: "ProcessQueue.LogExecutionStatus",
                            values: [
                                {
                                    id: "b328aef1-e7be-4dc0-a6fa-89cd12f1a386",
                                    name: "NotExecuted"
                                },
                                {
                                    id: "fcd7c8dd-8b05-4fa9-a1b6-7e14378446cf",
                                    name: "SuccesExecuted"
                                },
                                {
                                    id: "25081cc9-fcfc-410e-aade-993a5d098aa7",
                                    name: "FailedExecuted"
                                },
                                {
                                    id: "7f625615-497d-4428-b624-dbff9284f743",
                                    name: "SuccesWithErrorsExecuted"
                                },
                                {
                                    id: "c7d0c267-328b-4d9a-8a1e-2b92b4f0d9f4",
                                    name: "While_Executing"
                                },
                                {
                                    id: "6977a60d-238b-4b56-8c70-6585eaf64c4c",
                                    name: "Skipped"
                                }
                            ]
                        },
                        required: false
                    },
                    {
                        id: "b49d7b0f-76d3-40ac-b4b5-ed9c43faff65",
                        dataStorageGuid: "f2d567c2-287d-4b5e-85c8-c72c29e08794",
                        documentation: "",
                        name: "StartTime",
                        qualifiedName: "ProcessQueue.QueuedAction.StartTime",
                        value: {
                            id: "109abc03-0532-4753-bc48-4243df68f3be",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "datetime",
                        required: false
                    },
                    {
                        id: "84a63f62-8081-49d6-89c3-92fd981ff317",
                        dataStorageGuid: "e8f3790a-fd9e-434d-aa07-72227de32500",
                        documentation: "",
                        name: "FinishTime",
                        qualifiedName: "ProcessQueue.QueuedAction.FinishTime",
                        value: {
                            id: "54746f72-d6b4-410d-bf90-a6972ef703e3",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "datetime",
                        required: false
                    },
                    {
                        id: "0b20967f-f883-46d7-8db9-e64ea619d586",
                        dataStorageGuid: "88085046-ea3d-4e99-818d-c9c34355f5b2",
                        documentation: "",
                        name: "ReferenceText",
                        qualifiedName: "ProcessQueue.QueuedAction.ReferenceText",
                        value: {
                            id: "cf6003de-d31b-4f06-803f-9c3b2291bde1",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    }
                ],
                generalization: {
                    id: "e8b55c62-6672-4aa3-9ff6-50faeeec8b15",
                    qualifiedName: "TaskManager.Task",
                    type: "generalization"
                }
            },
            {
                id: "95af695c-8509-4c2e-89ee-9c5c06af8636",
                qualifiedName: "TeamWorks.Job",
                name: "Job",
                documentation: "",
                dataStorageGuid: "792276d9-59e3-4842-af9a-063668216e74",
                remoteSource: "",
                attributes: []
            },
            {
                id: "bb8435c7-7cd3-478f-b9ec-9784172c441a",
                qualifiedName: "TeamWorks.Response",
                name: "Response",
                documentation: "",
                dataStorageGuid: "af1fe442-5d81-4ee8-bda0-c38511bd6764",
                remoteSource: "",
                attributes: [
                    {
                        id: "f434c6b5-66be-483e-b38d-a642114beffc",
                        dataStorageGuid: "dbe19f31-0088-42d4-aa58-a98ce4ec76d1",
                        documentation: "",
                        name: "ErrorCode",
                        qualifiedName: "TeamWorks.Response.ErrorCode",
                        value: {
                            id: "8f091922-9c07-49aa-b311-d4d495ad3e84",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "integer",
                        required: false
                    },
                    {
                        id: "421b26ba-a8d5-4e0a-9e88-41ccc4859509",
                        dataStorageGuid: "16a87301-3395-4be1-baaf-754843cd09dc",
                        documentation: "",
                        name: "Message",
                        qualifiedName: "TeamWorks.Response.Message",
                        value: {
                            id: "6f0066d6-5b8c-4cf7-b6c9-6daffd8b71a8",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    }
                ]
            }
        ],
        number: 11
    },
    timeStamp: 1553579405873,
    took: 5032
};

function main() {
    const reverseDomain = `ca.bdc`;
    const appName = `cls`;

    enum DataTypeMapping {
        DomainModels$StringAttributeType = "string",
        DomainModels$EnumerationAttributeType = "enum",
        DomainModels$IntegerAttributeType = "int",
        DomainModels$LongAttributeType = "long",
        DomainModels$DateTimeAttributeType = "long",
        DomainModels$BooleanAttributeType = "boolean",
        DomainModels$DecimalAttributeType = "bytes",
    }

    const logicalTypes = {
        datetime: {
            type: ["null", "long"],
            logicalType: "timestamp-millis"
        },
        decimal: {
            type: ["null", "bytes"],
            logicalType: "decimal",
            precision: 4,
            scale: 2
        },
        enumeration: {
            type: ["null", {
                type: "enum",
                name: "",
                symbols: []
            }]
        },
        string: {
            type: ["null", "string"]
        },
        integer: {
            type: ["null", "int"]
        },
        long: {
            type: ["null", "long"]
        },
        autonumber: {
            type: ["null", "long"]
        },
        boolean: {
            type: ["null", "boolean"]
        },
        keys() {
            return Object.keys(this);
        },
        hasType(key: string): boolean {
            return Object.keys(this).indexOf(key) > -1;
        },
        get(key: string): any {
            return (this as any)[key];
        }
    };

    const basePath = "/Users/hgeldenhuys/Documents/Mendix/TeamWorks-Edubond/resources/AvroSchemas";
    if (!fs.existsSync(`${basePath}/${sampleDomain.revision.moduleName}`)) {
        fs.mkdirSync(`${basePath}/${sampleDomain.revision.moduleName}`);
    }

    sampleDomain.revision.entities.forEach((entity: any) => {
        const fields = entity.attributes.map((attribute: any) => {
            const
                moduleName = attribute.qualifiedName.split(".")[0],
                enumName = attribute.enumeration ? attribute.enumeration.qualifiedName.split(".")[1] : "?";
            const field: IField = {
                name: `${attribute.name}`,
                type: [DataTypeMapping[<any>attribute.type] || attribute.type],
                doc: attribute.documentation,
                default: null as any
            };

            if (logicalTypes.hasType(attribute.type)) {
                const logicalType = logicalTypes.get(attribute.type);
                for (const propName in logicalType) {
                    (field as any)[propName] = JSON.parse(JSON.stringify(logicalType[propName]));
                }
            }
            if (!field.type[1]) {
                throw new Error(`Missing configuration for ${attribute.type}: ${JSON.stringify(field)}`);
            }
            const type = field.type[1] as ILogicalType;
            if (type.type && (type.type === "enum") && attribute.enumeration) {
                type.symbols = attribute.enumeration.values.map((value: any) => value.name);
                type.name = `${reverseDomain}.${appName}.${moduleName}.${enumName}`;
            }
            if (attribute.required) {
                field.type.shift();
                field.default = field.default !== null ? field.default : undefined;
            }
            return field;
        });
        const
            avroTemplate = {
            type: "record",
            namespace: `${reverseDomain.toLowerCase()}.${appName.toLowerCase()}.${sampleDomain.revision.moduleName}`,
            name: `${entity.name}`,
            doc: entity.documentation,
            fields
        };
        console.log(JSON.stringify(avroTemplate, undefined, 2));

        fs.writeFileSync(`${basePath}/${sampleDomain.revision.moduleName}/${entity.qualifiedName}.avsc`, JSON.stringify(avroTemplate, undefined, 2));
    });
}

main();