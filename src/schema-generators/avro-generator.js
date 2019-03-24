"use strict";
const sampleDomain = {
    branchName: "",
    latestRevisionNumber: 11,
    revision: {
        moduleName: "SampleApp",
        entities: [
            {
                id: "ee572ba3-cee0-4d36-86b1-d82872324039",
                qualifiedName: "SampleApp.SampleEntity",
                name: "SampleEntity",
                documentation: "",
                dataStorageGuid: "d48e2578-45fe-4fb6-b1dd-803ab4601e4c",
                remoteSource: "",
                attributes: [
                    {
                        id: "ba8745ab-4934-4190-b508-938fbedbce71",
                        dataStorageGuid: "bc6994e7-3347-4ff3-a7ca-7616587eec83",
                        documentation: "",
                        name: "String",
                        qualifiedName: "SampleApp.SampleEntity.String",
                        value: {
                            id: "1fc305ac-9bd2-452b-bc7e-3a3db54d8d8b",
                            type: "stored",
                            defaultValue: "Hello Bob"
                        },
                        type: "string"
                    },
                    {
                        id: "b3e2d25b-b5a7-45dd-bdd6-d39352f9bcc9",
                        dataStorageGuid: "a4c22e8e-e1dd-4a3f-8a1d-9e2410a12193",
                        documentation: "",
                        name: "Integer",
                        qualifiedName: "SampleApp.SampleEntity.Integer",
                        value: {
                            id: "62f76515-b363-4abe-9f3b-3e229b722f4d",
                            type: "stored",
                            defaultValue: "123"
                        },
                        type: "integer"
                    },
                    {
                        id: "7b0c80b8-32f8-4f0b-83fa-b8e107ba977f",
                        dataStorageGuid: "29f300a7-551e-4845-8990-6b6c2dab2ee5",
                        documentation: "",
                        name: "Long_",
                        qualifiedName: "SampleApp.SampleEntity.Long_",
                        value: {
                            id: "3249f95c-497b-4c75-a4c3-d087e66e57f3",
                            type: "stored",
                            defaultValue: "1234567"
                        },
                        type: "long"
                    },
                    {
                        id: "a3c09ec7-bc20-448f-8aa2-dc2d434b57d2",
                        dataStorageGuid: "92c51697-107d-4584-a64a-505994aca0f8",
                        documentation: "",
                        name: "Date",
                        qualifiedName: "SampleApp.SampleEntity.Date",
                        value: {
                            id: "4d26a0f7-4e90-4791-b006-cd95a768a2e2",
                            type: "stored",
                            defaultValue: "[%CurrentDateTime%]"
                        },
                        type: "datetime"
                    },
                    {
                        id: "432835ca-a01a-471f-a52e-c8fed0c0eea8",
                        dataStorageGuid: "9a6f3dd1-4045-4a93-a820-60e72e633f2d",
                        documentation: "",
                        name: "Boolean_",
                        qualifiedName: "SampleApp.SampleEntity.Boolean_",
                        value: {
                            id: "3162369d-ba6d-4048-a405-cf7d5709511d",
                            type: "stored",
                            defaultValue: "true"
                        },
                        type: "boolean"
                    },
                    {
                        id: "aa420d6f-6aab-4037-b846-86e2c8b4122e",
                        dataStorageGuid: "6893ab1a-64ea-48e0-9b60-68f6fe1a8fc2",
                        documentation: "",
                        name: "Decimal",
                        qualifiedName: "SampleApp.SampleEntity.Decimal",
                        value: {
                            id: "8f33c1fe-8de4-432a-af6d-3fe6ea1c80d5",
                            type: "stored",
                            defaultValue: "123.456"
                        },
                        type: "decimal"
                    },
                    {
                        id: "accff81f-4ae2-4503-aecd-116843a4850c",
                        dataStorageGuid: "0a171ca3-651b-4463-bf14-e5a3835632e8",
                        documentation: "",
                        name: "Enumeration",
                        qualifiedName: "SampleApp.SampleEntity.Enumeration",
                        value: {
                            id: "32b7b467-66e1-43e0-b6a9-53aa04bf6ec8",
                            type: "stored",
                            defaultValue: "Foo"
                        },
                        type: "enumeration",
                        enumeration: {
                            id: "e7ae764f-5136-4553-951b-ac4dd4e81d96",
                            qualifiedName: "SampleApp.TestEnum",
                            values: [
                                {
                                    id: "2c6a033f-a776-499f-9bdc-1266e64fa49e",
                                    name: "Foo"
                                },
                                {
                                    id: "7cd4c316-bc7b-4ca6-86e8-8a6a1fe2d77f",
                                    name: "Bar"
                                }
                            ]
                        }
                    }
                ]
            },
            {
                id: "052fcc2c-6633-4691-ba79-945dbc15cecc",
                qualifiedName: "SampleApp.GeneralEntity",
                name: "GeneralEntity",
                documentation: "",
                dataStorageGuid: "82451173-386e-4e37-99a7-37f9edb6d16a",
                remoteSource: "",
                attributes: [
                    {
                        id: "c4b9d774-9844-43ae-b66a-c8b9196c3282",
                        dataStorageGuid: "6265e957-3bc8-4912-80e0-85d0e5360db5",
                        documentation: "",
                        name: "Name",
                        qualifiedName: "SampleApp.GeneralEntity.Name",
                        value: {
                            id: "46f2788d-31f4-4c02-b6ae-78cca4de2336",
                            type: "stored",
                            defaultValue: "ABC"
                        },
                        type: "string"
                    }
                ]
            },
            {
                id: "cf384f4f-3e63-40ec-9e92-53e01cfc6626",
                qualifiedName: "SampleApp.Rest",
                name: "Rest",
                documentation: "",
                dataStorageGuid: "9fe9e9b0-8700-43c5-85ea-a8271469e8c1",
                remoteSource: "",
                attributes: [
                    {
                        id: "3e68d224-3643-4974-a26d-7e98c352af60",
                        dataStorageGuid: "6c9b119c-a95e-4092-a072-ff1dc35ef9f5",
                        documentation: "",
                        name: "Name",
                        qualifiedName: "SampleApp.Rest.Name",
                        value: {
                            id: "a4ede7bf-f666-4951-89ad-5a5fe2aec211",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string"
                    },
                    {
                        id: "4e231dc5-5bd8-4cc6-9db6-56a4b7d0aa91",
                        dataStorageGuid: "920ff02d-e3dc-45c3-80b9-5c0ddf0bcc59",
                        documentation: "",
                        name: "Method",
                        qualifiedName: "SampleApp.Rest.Method",
                        value: {
                            id: "69189fa8-8c74-448a-9569-27e147222692",
                            type: "stored",
                            defaultValue: "POST"
                        },
                        type: "enumeration",
                        enumeration: {
                            id: "b49c8747-7bd3-430d-a91f-794803d4c772",
                            qualifiedName: "SampleApp.MethodEnum",
                            values: [
                                {
                                    id: "e4adac6b-aa0b-4af8-894f-a2a121d37f20",
                                    name: "GET"
                                },
                                {
                                    id: "cb22da3e-31d4-4b01-87b3-1ab4886b1683",
                                    name: "POST"
                                },
                                {
                                    id: "95606ec8-ce01-469e-9d95-36d5f2f12c33",
                                    name: "DELETE"
                                },
                                {
                                    id: "4764fe19-7191-4bae-bdb9-bae47c23fa24",
                                    name: "PATCH"
                                },
                                {
                                    id: "3eab9453-27c1-4d54-aea8-e27e42fe1fc6",
                                    name: "PUT"
                                },
                                {
                                    id: "ce7d587d-6eaf-407b-b0aa-fdecba3d3482",
                                    name: "OPTIONS"
                                },
                                {
                                    id: "8ecdabae-41bd-420d-88ba-7b2b3a6e860a",
                                    name: "HEAD"
                                }
                            ]
                        }
                    },
                    {
                        id: "994a34df-bd7b-4cde-ba60-d5801c8fafa9",
                        dataStorageGuid: "7f01ba0c-f82c-4911-8e23-eec6cf9c380a",
                        documentation: "",
                        name: "Url",
                        qualifiedName: "SampleApp.Rest.Url",
                        value: {
                            id: "e0872329-6922-4584-8465-f04e2423b690",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string"
                    },
                    {
                        id: "79ebc069-3423-48a4-b7a7-1dc59a071db6",
                        dataStorageGuid: "dbd6facd-4ff5-4baf-9a90-c37c097ff821",
                        documentation: "",
                        name: "Json",
                        qualifiedName: "SampleApp.Rest.Json",
                        value: {
                            id: "1a0810e3-5e61-4d0d-834d-6c316311cdb7",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string"
                    },
                    {
                        id: "532b90bb-c7c9-4916-a8e0-13877a6d5b17",
                        dataStorageGuid: "836edcdc-25ad-4de5-bf9f-e20cbfd6f30c",
                        documentation: "",
                        name: "Output",
                        qualifiedName: "SampleApp.Rest.Output",
                        value: {
                            id: "7bbe3443-0a05-45b9-8253-93d22f53d2f8",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string"
                    }
                ]
            }
        ],
        number: 11
    },
    timeStamp: 1553452639681,
    took: 3936
};
function main() {
    const reverseDomain = `ca.bdc`;
    const appName = `cls`;
    let DataTypeMapping;
    (function (DataTypeMapping) {
        DataTypeMapping["DomainModels$StringAttributeType"] = "string";
        DataTypeMapping["DomainModels$EnumerationAttributeType"] = "string";
        DataTypeMapping["DomainModels$IntegerAttributeType"] = "int";
        DataTypeMapping["DomainModels$LongAttributeType"] = "long";
        DataTypeMapping["DomainModels$DateTimeAttributeType"] = "long";
        DataTypeMapping["DomainModels$BooleanAttributeType"] = "boolean";
        DataTypeMapping["DomainModels$DecimalAttributeType"] = "bytes";
    })(DataTypeMapping || (DataTypeMapping = {}));
    const logicalTypes = {
        datetime: {
            logicalType: "timestamp-millis"
        },
        decimal: {
            type: "bytes",
            logicalType: "decimal",
            precision: 4,
            scale: 2
        },
        keys() {
            return Object.keys(this);
        },
        hasType(key) {
            return Object.keys(this).indexOf(key) > -1;
        },
        get(key) {
            return this[key];
        }
    };
    sampleDomain.revision.entities.forEach((entity) => {
        const fields = entity.attributes.map((attribute) => {
            const field = {
                name: attribute.name,
                type: DataTypeMapping[attribute.type] || attribute.type,
                doc: "ToDo"
            };
            if (logicalTypes.hasType(attribute.type)) {
                const logicalType = logicalTypes.get(attribute.type);
                for (const propName in logicalType) {
                    field[propName] = logicalType[propName];
                }
            }
            return field;
        });
        const avroTemplate = {
            type: "record",
            namespace: `${reverseDomain}.${appName}.${sampleDomain.revision.moduleName}`,
            name: entity.name,
            doc: entity.documentation,
            fields
        };
        console.log(JSON.stringify(avroTemplate, undefined, 2));
    });
}
main();
//# sourceMappingURL=avro-generator.js.map