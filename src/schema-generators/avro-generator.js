"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const sampleDomain = {
    branchName: "Edubond",
    latestRevisionNumber: 13,
    revision: {
        moduleName: "TeamWorks",
        entities: [
            {
                id: "a1c918ee-3185-47b1-ad66-3b087b2493b3",
                qualifiedName: "TeamWorks.Brand",
                name: "Brand",
                documentation: "",
                dataStorageGuid: "71122f39-3071-4c6a-8a45-f640e75a1957",
                remoteSource: "",
                attributes: [
                    {
                        id: "3458d67e-2a56-4109-a750-a170a377cda0",
                        dataStorageGuid: "40f3383d-7a84-4496-b413-9a8c0d94abc5",
                        documentation: "",
                        name: "Name",
                        qualifiedName: "TeamWorks.Brand.Name",
                        value: {
                            id: "87851f93-769f-4d94-8748-3bff4fb9e45b",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "5069f26e-4810-47eb-a9d1-0c39564e6c1c",
                        dataStorageGuid: "86894760-ecf8-4a5e-b50e-a515a2c4e2f1",
                        documentation: "",
                        name: "Domain",
                        qualifiedName: "TeamWorks.Brand.Domain",
                        value: {
                            id: "c19758d5-01f3-43b4-aa78-d8c2aae323dc",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "80bac1dc-6ad4-4364-aa8a-6eb1087d6687",
                        dataStorageGuid: "8357ee83-cf5f-4253-998d-95a7646f1adf",
                        documentation: "",
                        name: "BrandId",
                        qualifiedName: "TeamWorks.Brand.BrandId",
                        value: {
                            id: "6d9363d0-04e0-459d-a4d7-3a3b43e61d84",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "integer",
                        required: false
                    }
                ],
                persisted: true,
                associations: [
                    {
                        id: "f7004591-cb87-4dd3-b901-8b84edc255c1",
                        name: "Brand_Company",
                        qualifiedName: "TeamWorks.Brand_Company",
                        documentation: "",
                        dataStorageGuid: "d4dfc51d-bf79-4337-894c-0babeb3e76c2",
                        type: "Reference",
                        owner: "Default",
                        entity: {
                            id: "2a0b8734-d3c4-411c-892b-d8f40710b331",
                            qualifiedName: "TeamWorks.Company"
                        },
                        parent: true,
                        child: false
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
                attributes: [
                    {
                        id: "194090ca-d892-4412-b07d-f227a6c6f89f",
                        dataStorageGuid: "ce3a5819-3ee3-4537-88e5-33a7976272f0",
                        documentation: "",
                        name: "Name",
                        qualifiedName: "TeamWorks.Company.Name",
                        value: {
                            id: "1b6f3e0e-e200-4a63-9958-f5d253dcfee0",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    }
                ],
                persisted: true,
                associations: []
            },
            {
                id: "6bb756ba-18cf-4aa2-add7-1d5cf8449459",
                qualifiedName: "TeamWorks.Job",
                name: "Job",
                documentation: "This is the main task item an agent will be working on",
                dataStorageGuid: "28d97e2d-af8b-4bfb-afa1-b517c62f0008",
                remoteSource: "",
                attributes: [
                    {
                        id: "a6ed89fe-fc5b-4cc8-bcc6-9576f0039d8d",
                        dataStorageGuid: "95194582-3e61-4d4d-9a04-43a075815237",
                        documentation: "The state of the Task",
                        name: "State",
                        qualifiedName: "TeamWorks.Job.State",
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
                        qualifiedName: "TeamWorks.Job.Priority",
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
                        qualifiedName: "TeamWorks.Job.StartDate",
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
                        qualifiedName: "TeamWorks.Job.EndDate",
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
                        qualifiedName: "TeamWorks.Job.WorkTime",
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
                        qualifiedName: "TeamWorks.Job.WaitTime",
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
                        qualifiedName: "TeamWorks.Job.Closed",
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
                        qualifiedName: "TeamWorks.Job.BrandId",
                        value: {
                            id: "57acf6d4-7e8c-4827-b9ad-5995fcdc1f64",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "integer",
                        required: false
                    },
                    {
                        id: "f4338d60-1fe1-416a-ac1c-5e3709d2a7b3",
                        dataStorageGuid: "26517771-fdc5-4692-b5c7-614bd082ee64",
                        documentation: "",
                        name: "WorkId",
                        qualifiedName: "TaskManager.Work.WorkId",
                        value: {
                            id: "966c319b-bde6-4e75-8bc1-fb21d05bb3e0",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "long",
                        required: false
                    },
                    {
                        id: "9d339685-bf2f-48d5-b60b-f102ed760b4a",
                        dataStorageGuid: "710b2786-a12b-4c1f-a62f-2fc4f79cb9d2",
                        documentation: "",
                        name: "EternalId",
                        qualifiedName: "TaskManager.Work.EternalId",
                        value: {
                            id: "86d071c5-d48d-476b-b994-63f05852d4a6",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "6e8e97a8-9b6d-4a10-ac91-1377f998cca4",
                        dataStorageGuid: "a72fd0c5-1368-4dde-8ce6-eb0c54588db1",
                        documentation: "",
                        name: "Progress",
                        qualifiedName: "TaskManager.Work.Progress",
                        value: {
                            id: "b12c0c3e-582e-48ba-b187-4b989aa39afd",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "decimal",
                        required: false
                    },
                    {
                        id: "b5ef7497-ad5c-4ec3-b3b2-769a1da52531",
                        dataStorageGuid: "dca07bfc-56c4-44d5-9a0d-8e2312a921ca",
                        documentation: "",
                        name: "ProgressMessage",
                        qualifiedName: "TaskManager.Work.ProgressMessage",
                        value: {
                            id: "25076cc0-f423-4e4e-8279-f04b53fbb351",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "83156d37-6dbe-495b-9839-0d74432c4cb8",
                        dataStorageGuid: "a435b196-91ca-46c9-84c6-b763d39c06fc",
                        documentation: "",
                        name: "Stopped",
                        qualifiedName: "TaskManager.Work.Stopped",
                        value: {
                            id: "178f45df-b632-404b-b25f-6ae3b9f1e4f2",
                            type: "stored",
                            defaultValue: "false"
                        },
                        type: "boolean",
                        required: false
                    },
                    {
                        id: "edf82a68-b569-43c9-b42a-ceb029f8dc41",
                        dataStorageGuid: "bc7b576f-d254-430d-a921-e936f2544573",
                        documentation: "",
                        name: "Status",
                        qualifiedName: "TaskManager.Work.Status",
                        value: {
                            id: "48de5dfe-66bf-4e6c-a3fd-936c7b8f2501",
                            type: "stored",
                            defaultValue: "Scheduled"
                        },
                        type: "enumeration",
                        enumeration: {
                            id: "5dda853b-d24e-41fa-acd7-f1539db372d1",
                            qualifiedName: "TaskManager.WorkStatusEnum",
                            values: [
                                {
                                    id: "e1cc1089-eb9b-4d0d-b91c-10d04c4ddc47",
                                    name: "Scheduled"
                                },
                                {
                                    id: "6cef02b8-60e1-446e-9db5-f55d1abf2138",
                                    name: "Running"
                                },
                                {
                                    id: "22698e06-ff31-450f-a2c3-b547495633d7",
                                    name: "Completed"
                                },
                                {
                                    id: "26adb049-99b2-403b-8393-5c7367583d86",
                                    name: "Error"
                                }
                            ]
                        },
                        required: false
                    },
                    {
                        id: "c0684026-052e-491d-9b47-0f11be10ff0c",
                        dataStorageGuid: "6e5e09aa-b066-44e4-b0d9-1170fb47f510",
                        documentation: "",
                        name: "ErrorMessage",
                        qualifiedName: "TaskManager.Work.ErrorMessage",
                        value: {
                            id: "6472ec3e-2cba-4950-96a1-3b21f7840358",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "0719bdc4-c443-4901-a147-de92a2c41628",
                        dataStorageGuid: "d53eca01-9f45-47ba-bc05-91af3683ea9d",
                        documentation: "",
                        name: "ExecuteOnBehalfOf",
                        qualifiedName: "TaskManager.Work.ExecuteOnBehalfOf",
                        value: {
                            id: "c1009fa3-dee7-4f64-a747-c8db867d1494",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "be95a062-ebf3-4005-8ae8-c0565ca196ec",
                        dataStorageGuid: "f0bacf05-1bb0-4698-8069-6be0b483706d",
                        documentation: "",
                        name: "ExpiryDate",
                        qualifiedName: "TaskManager.Work.ExpiryDate",
                        value: {
                            id: "3594fd20-c612-4276-bcd9-1e276f9e8770",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "datetime",
                        required: false
                    },
                    {
                        id: "731e8c58-5f1f-4fa0-bdf0-5d6981ba11f3",
                        dataStorageGuid: "4315d816-20da-48a2-bd4f-0c5067ebad81",
                        documentation: "",
                        name: "StartDateTime",
                        qualifiedName: "TaskManager.Work.StartDateTime",
                        value: {
                            id: "bce28e0a-c4ac-4fbe-a786-3dd1f8749d33",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "datetime",
                        required: false
                    },
                    {
                        id: "359d2f3e-1017-4fd0-be58-b2a6548f16c6",
                        dataStorageGuid: "31fc9390-36e0-46e3-b6a6-3c8d78ad94f7",
                        documentation: "",
                        name: "EndDateTime",
                        qualifiedName: "TaskManager.Work.EndDateTime",
                        value: {
                            id: "78f53a6f-8701-4b7e-b383-eb09c71e0e59",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "datetime",
                        required: false
                    },
                    {
                        id: "e1285b89-dc2d-4411-9cb7-5d5e8cdcf6dc",
                        dataStorageGuid: "8b6f8a5b-aec2-45f0-86b5-7cfa7a264db5",
                        documentation: "",
                        name: "ScheduleDateTime",
                        qualifiedName: "TaskManager.Work.ScheduleDateTime",
                        value: {
                            id: "68057715-279a-4a59-92e9-10147be58d9b",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "datetime",
                        required: false
                    },
                    {
                        id: "dc36aebd-334b-40a6-8bba-45004387b163",
                        dataStorageGuid: "d923e021-f010-429d-9915-08478b3308ba",
                        documentation: "",
                        name: "Label",
                        qualifiedName: "TaskManager.Work.Label",
                        value: {
                            id: "10845b50-a9bd-43a5-9442-211d06a3cf1f",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "fde10b47-2897-4b74-8286-e6764ba6f5e2",
                        dataStorageGuid: "09b8624d-23e8-4bd3-9f9a-7fba65cbf7a4",
                        documentation: "",
                        name: "Cleanup",
                        qualifiedName: "TaskManager.Work.Cleanup",
                        value: {
                            id: "b926e45d-4e44-473d-9b22-f7c7d3dec3f9",
                            type: "stored",
                            defaultValue: "false"
                        },
                        type: "boolean",
                        required: false
                    },
                    {
                        id: "dca1ec2d-cce1-40a1-baa6-8b0bd4a009c7",
                        dataStorageGuid: "295a508e-4035-496b-a9af-dee65605cfb7",
                        documentation: "",
                        name: "Index",
                        qualifiedName: "TaskManager.Movable.Index",
                        value: {
                            id: "8f908479-ff40-4648-9220-a9a230d62557",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "integer",
                        required: false
                    },
                    {
                        id: "65b41ff8-6609-40ae-9b85-da134bbb3904",
                        dataStorageGuid: "405fbb98-fc08-4680-84c0-c55255598089",
                        documentation: "",
                        name: "ParentGuid",
                        qualifiedName: "TaskManager.Movable.ParentGuid",
                        value: {
                            id: "7879cd11-5e0a-41b4-9493-241776076ecf",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "long",
                        required: false
                    },
                    {
                        id: "4103a37f-3f07-4494-a17d-b8c97eecb100",
                        dataStorageGuid: "577d47fb-d045-4ea0-8729-b98c572718f1",
                        documentation: "",
                        name: "ObjectType",
                        qualifiedName: "TaskManager.Movable.ObjectType",
                        value: {
                            id: "bf9f5440-d8c9-4e25-b5b3-e53de477d287",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "35303fce-846d-4655-8ecd-d15ca558a3b6",
                        dataStorageGuid: "187cecfb-6e5e-4a47-af3b-056af8b610a0",
                        documentation: "",
                        name: "LastItem",
                        qualifiedName: "TaskManager.Movable.LastItem",
                        value: {
                            id: "bf79be69-af5b-4b34-9134-aec9902d6095",
                            type: "stored",
                            defaultValue: "false"
                        },
                        type: "boolean",
                        required: false
                    },
                    {
                        id: "8c34bce0-c8e6-43f4-9147-58cd3e1f0aca",
                        dataStorageGuid: "e8f06ca2-37a4-41d6-a62f-7ec7f47e3918",
                        documentation: "",
                        name: "UUID",
                        qualifiedName: "TaskManager.Movable.UUID",
                        value: {
                            id: "c40b08b9-ffb8-4f2d-8f1c-d240570f2dab",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    }
                ],
                persisted: true,
                generalization: {
                    id: "94807e6e-f0be-4fb8-8d30-01495b17c3c9",
                    qualifiedName: "TaskManager.Work",
                    type: "generalization"
                },
                associations: [
                    {
                        id: "87d188aa-ff05-4aa4-9a86-637971d89ae4",
                        name: "Job_Brand",
                        qualifiedName: "TeamWorks.Job_Brand",
                        documentation: "",
                        dataStorageGuid: "a89b04ca-c4fa-4db7-a0e5-7cc5241b071a",
                        type: "Reference",
                        owner: "Default",
                        entity: {
                            id: "a1c918ee-3185-47b1-ad66-3b087b2493b3",
                            qualifiedName: "TeamWorks.Brand"
                        },
                        parent: true,
                        child: false
                    },
                    {
                        id: "a5d52897-bcbb-4e68-9e19-e2a9364697f6",
                        name: "Job_Lead",
                        qualifiedName: "TeamWorks.Job_Lead",
                        documentation: "",
                        dataStorageGuid: "4df03c35-2fdd-45bf-b2f1-c5777b490d7c",
                        type: "Reference",
                        owner: "Default",
                        entity: {
                            id: "70ece99c-4618-4a0e-935a-8261799ae65c",
                            qualifiedName: "TeamWorks.Lead"
                        },
                        parent: true,
                        child: false
                    }
                ]
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
                ],
                persisted: false,
                associations: []
            },
            {
                id: "70ece99c-4618-4a0e-935a-8261799ae65c",
                qualifiedName: "TeamWorks.Lead",
                name: "Lead",
                documentation: "Interface:TeamWorks.ILead",
                dataStorageGuid: "c5bcaa77-bfe7-4cd0-962f-05b47b3b3257",
                remoteSource: "",
                attributes: [
                    {
                        id: "6f78ef5c-db2f-439e-ab73-a070c25488e8",
                        dataStorageGuid: "cd10cc2f-d8bf-4ac6-aa87-46b22608a43d",
                        documentation: "",
                        name: "Firstname",
                        qualifiedName: "TeamWorks.Lead.Firstname",
                        value: {
                            id: "82f4bef2-e008-4a17-9f9c-076d56d9665b",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "96ff6f1e-0c7e-43f9-ae17-2aef83c9ca7e",
                        dataStorageGuid: "98b9f90a-c889-40c4-8cae-cee90653a2bc",
                        documentation: "",
                        name: "Lastname",
                        qualifiedName: "TeamWorks.Lead.Lastname",
                        value: {
                            id: "ee4ed073-5952-437b-8a9a-bec7d3260d34",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "540795c7-36c3-460e-a028-b7cf6aa3ad32",
                        dataStorageGuid: "b991aa5e-b5b2-4f4b-b8e1-86240c748dd5",
                        documentation: "",
                        name: "IDNumber",
                        qualifiedName: "TeamWorks.Lead.IDNumber",
                        value: {
                            id: "ad6fe245-f672-445a-a2c3-06569975f548",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "2ff205e7-2ed2-4996-a38e-35b8d500fa5e",
                        dataStorageGuid: "2b6f4e77-cbe9-4a5f-afe5-d35e4a144e46",
                        documentation: "",
                        name: "DOB",
                        qualifiedName: "TeamWorks.Lead.DOB",
                        value: {
                            id: "9a82ec54-995a-454c-ac48-3ba8394e4d1d",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "datetime",
                        required: false
                    },
                    {
                        id: "8ca35256-a5ba-4332-b1a2-c972d574202e",
                        dataStorageGuid: "6812776d-573a-4cbd-897f-cc8824a11cc9",
                        documentation: "",
                        name: "Gender",
                        qualifiedName: "TeamWorks.Lead.Gender",
                        value: {
                            id: "13e2730a-2a9d-4dda-90b2-3c4e80f6085f",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "enumeration",
                        enumeration: {
                            id: "34628d5f-a67a-4b70-ace2-ab2f82f04c04",
                            qualifiedName: "TeamWorks.GenderEnum",
                            values: [
                                {
                                    id: "780f4e1b-f609-4750-b1d4-6e25ee0c7057",
                                    name: "Male"
                                },
                                {
                                    id: "85ad5e46-bd51-4c4e-a409-a3edcc0213d7",
                                    name: "Female"
                                },
                                {
                                    id: "fa3c241c-4d0d-4e9f-8999-67e866ae4e33",
                                    name: "Other"
                                }
                            ]
                        },
                        required: false
                    },
                    {
                        id: "55c036d9-62d7-4d46-8b8e-5af891733e8e",
                        dataStorageGuid: "7e91d4f2-fd62-4c76-b155-151253443806",
                        documentation: "",
                        name: "Income",
                        qualifiedName: "TeamWorks.Lead.Income",
                        value: {
                            id: "8eb635a1-fb87-439e-87ca-2b5acf1b3aa8",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "decimal",
                        required: false
                    },
                    {
                        id: "a209874a-3f3f-402f-a58b-ee358fa8ea65",
                        dataStorageGuid: "a9c0a201-de41-492a-b78b-b6ccfd29d9f9",
                        documentation: "",
                        name: "Eligible",
                        qualifiedName: "TeamWorks.Lead.Eligible",
                        value: {
                            id: "fb181f07-da46-467d-bcff-18591451117f",
                            type: "stored",
                            defaultValue: "false"
                        },
                        type: "boolean",
                        required: false
                    }
                ],
                persisted: true,
                associations: []
            },
            {
                id: "d4a1e1d2-a63e-4c0e-84c5-3795719346e4",
                qualifiedName: "TeamWorks.IBrand",
                name: "IBrand",
                documentation: "",
                dataStorageGuid: "ad924b76-b59a-42b5-856b-cab1ea783def",
                remoteSource: "",
                attributes: [
                    {
                        id: "4db0b584-bcbc-4da4-a4a8-1c35a19f3576",
                        dataStorageGuid: "edabef03-a3a3-46f5-a93a-32e07028272b",
                        documentation: "",
                        name: "Name",
                        qualifiedName: "TeamWorks.IBrand.Name",
                        value: {
                            id: "f42f0836-c379-453e-adcf-7c709fb5c173",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "eabb8154-38e6-4b1e-9647-805da61962e7",
                        dataStorageGuid: "0d521d7b-8d32-4fa0-bf43-aeaecae80dd1",
                        documentation: "",
                        name: "Domain",
                        qualifiedName: "TeamWorks.IBrand.Domain",
                        value: {
                            id: "d8e9ad4f-5bf9-4764-9955-bf5eabbf3d3d",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "ef7bcc7e-b45c-4352-9709-3dc23906e8b7",
                        dataStorageGuid: "ef1168df-9947-443a-bb6f-d3fa9e28fab1",
                        documentation: "",
                        name: "BrandId",
                        qualifiedName: "TeamWorks.IBrand.BrandId",
                        value: {
                            id: "321ad18d-418c-4496-bd33-b712c63c076e",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "integer",
                        required: false
                    }
                ],
                persisted: false,
                associations: [
                    {
                        id: "ec5d574f-cfa5-4887-b0fc-ee0bb2d4ab07",
                        name: "IJob_IBrand",
                        qualifiedName: "TeamWorks.IJob_IBrand",
                        documentation: "",
                        dataStorageGuid: "ec21ddbb-f90c-40b8-a5ac-5407e9311b9c",
                        type: "Reference",
                        owner: "Both",
                        entity: {
                            id: "2801de0a-59ca-4825-9db8-64e41df9a5ed",
                            qualifiedName: "TeamWorks.IJob"
                        },
                        parent: false,
                        child: true
                    },
                    {
                        id: "67fd3c28-f08d-43a0-ae7c-6167659fa16b",
                        name: "IBrand_IJob",
                        qualifiedName: "TeamWorks.IBrand_IJob",
                        documentation: "",
                        dataStorageGuid: "3d6f1e21-3534-4822-b0b5-4b6f34897f81",
                        type: "ReferenceSet",
                        owner: "Both",
                        entity: {
                            id: "2801de0a-59ca-4825-9db8-64e41df9a5ed",
                            qualifiedName: "TeamWorks.IJob"
                        },
                        parent: true,
                        child: false
                    }
                ]
            },
            {
                id: "2801de0a-59ca-4825-9db8-64e41df9a5ed",
                qualifiedName: "TeamWorks.IJob",
                name: "IJob",
                documentation: "This is the main task item an agent will be working on",
                dataStorageGuid: "1f0c391f-8db1-4f49-be06-01da3f55857b",
                remoteSource: "",
                attributes: [
                    {
                        id: "b4ae5843-afb7-452c-9526-44eb37233dbb",
                        dataStorageGuid: "214c2a74-121a-4686-99ee-482ba0f36a1d",
                        documentation: "The state of the Task",
                        name: "State",
                        qualifiedName: "TeamWorks.IJob.State",
                        value: {
                            id: "4e26e3e8-db60-4cea-8cfc-a0ab67f4f700",
                            type: "stored",
                            defaultValue: "Created"
                        },
                        type: "enumeration",
                        enumeration: {
                            id: "3147523b-2f88-437d-951d-f99bcc6ad799",
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
                        required: false
                    },
                    {
                        id: "a68a82f1-720a-430b-aa03-e49818e2092b",
                        dataStorageGuid: "c6b96256-e60a-4e5c-8814-69dfbce43bd7",
                        documentation: "Priority determines how high up the queue this is",
                        name: "Priority",
                        qualifiedName: "TeamWorks.IJob.Priority",
                        value: {
                            id: "4a5ae4a1-9167-4471-b5d4-ffd0bec94159",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "decimal",
                        required: false
                    },
                    {
                        id: "d70868e2-3c01-4064-9a72-fd0029e0c7cc",
                        dataStorageGuid: "57099669-11c2-4c3d-b00e-c9d7aebf4692",
                        documentation: "",
                        name: "StartDate",
                        qualifiedName: "TeamWorks.IJob.StartDate",
                        value: {
                            id: "2b496111-6946-4106-9694-8b8d9007cd57",
                            type: "stored",
                            defaultValue: "[%CurrentDateTime%]"
                        },
                        type: "datetime",
                        required: false
                    },
                    {
                        id: "b06a3d72-79c4-4148-8a95-b613e1a0cfd5",
                        dataStorageGuid: "ed24c994-7b3f-428f-8447-1f52a4bda0f1",
                        documentation: "",
                        name: "EndDate",
                        qualifiedName: "TeamWorks.IJob.EndDate",
                        value: {
                            id: "76283d5e-aa10-47cc-a500-d019ebb33c74",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "datetime",
                        required: false
                    },
                    {
                        id: "fb345ba6-e4eb-4502-bc7d-b2dcbedf2027",
                        dataStorageGuid: "cc82a967-86ec-47d1-b9bd-f66f40c2e812",
                        documentation: "",
                        name: "WorkTime",
                        qualifiedName: "TeamWorks.IJob.WorkTime",
                        value: {
                            id: "e2239e9d-7259-4369-b92e-51457feacb44",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "long",
                        required: false
                    },
                    {
                        id: "67d92053-6b89-4961-9ace-7c7b057518a0",
                        dataStorageGuid: "0c9c69b8-deb1-468b-b2d2-bc41091b3aa4",
                        documentation: "",
                        name: "WaitTime",
                        qualifiedName: "TeamWorks.IJob.WaitTime",
                        value: {
                            id: "9f5c944f-f0a1-4587-a24a-58e691236a5a",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "long",
                        required: false
                    },
                    {
                        id: "f2fb2326-5cb2-481c-8c4f-499613a8cf20",
                        dataStorageGuid: "055cfcc0-c77a-4d56-b2c5-15d75e0efe25",
                        documentation: "",
                        name: "Closed",
                        qualifiedName: "TeamWorks.IJob.Closed",
                        value: {
                            id: "41eb488a-70a2-4fd0-b50f-932193b9a5c5",
                            type: "stored",
                            defaultValue: "false"
                        },
                        type: "boolean",
                        required: false
                    },
                    {
                        id: "92ad59d8-9b49-4768-bc42-3bd751e15429",
                        dataStorageGuid: "185bd8f0-a9d5-42d6-91c5-f92c81a7819c",
                        documentation: "",
                        name: "BrandId",
                        qualifiedName: "TeamWorks.IJob.BrandId",
                        value: {
                            id: "0475a6df-b27e-4c6b-82cf-aa3ec7a1deff",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "integer",
                        required: false
                    },
                    {
                        id: "3582b187-ad3a-4923-bba1-fe427beb82a9",
                        dataStorageGuid: "9d9109f7-912b-4efa-8ae7-f5c47e6671d5",
                        documentation: "",
                        name: "WorkId",
                        qualifiedName: "TeamWorks.IJob.WorkId",
                        value: {
                            id: "1c948ea9-e352-49c2-871f-0ceea2160e7d",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "long",
                        required: false
                    }
                ],
                persisted: false,
                associations: [
                    {
                        id: "ec5d574f-cfa5-4887-b0fc-ee0bb2d4ab07",
                        name: "IJob_IBrand",
                        qualifiedName: "TeamWorks.IJob_IBrand",
                        documentation: "",
                        dataStorageGuid: "ec21ddbb-f90c-40b8-a5ac-5407e9311b9c",
                        type: "Reference",
                        owner: "Both",
                        entity: {
                            id: "d4a1e1d2-a63e-4c0e-84c5-3795719346e4",
                            qualifiedName: "TeamWorks.IBrand"
                        },
                        parent: true,
                        child: false
                    },
                    {
                        id: "f5daf741-6276-4941-9fc7-837220afa48c",
                        name: "IJob_ILead",
                        qualifiedName: "TeamWorks.IJob_ILead",
                        documentation: "",
                        dataStorageGuid: "f59444b4-87bb-4f58-a14a-b94d6b309228",
                        type: "Reference",
                        owner: "Both",
                        entity: {
                            id: "895351c8-a7fa-4c22-afa8-50e54977aa9f",
                            qualifiedName: "TeamWorks.ILead"
                        },
                        parent: true,
                        child: false
                    },
                    {
                        id: "67fd3c28-f08d-43a0-ae7c-6167659fa16b",
                        name: "IBrand_IJob",
                        qualifiedName: "TeamWorks.IBrand_IJob",
                        documentation: "",
                        dataStorageGuid: "3d6f1e21-3534-4822-b0b5-4b6f34897f81",
                        type: "ReferenceSet",
                        owner: "Both",
                        entity: {
                            id: "d4a1e1d2-a63e-4c0e-84c5-3795719346e4",
                            qualifiedName: "TeamWorks.IBrand"
                        },
                        parent: false,
                        child: true
                    }
                ]
            },
            {
                id: "895351c8-a7fa-4c22-afa8-50e54977aa9f",
                qualifiedName: "TeamWorks.ILead",
                name: "ILead",
                documentation: "",
                dataStorageGuid: "b1979eb7-c05e-4080-9021-0812414e82f4",
                remoteSource: "",
                attributes: [
                    {
                        id: "9db54e8a-bf3a-4e43-b690-1219789cfd2b",
                        dataStorageGuid: "5b39c256-4faa-423c-a412-14eb4750f541",
                        documentation: "",
                        name: "Firstname",
                        qualifiedName: "TeamWorks.ILead.Firstname",
                        value: {
                            id: "8fb9ed7c-d01e-4f66-93da-b917d7996df2",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "4ef57856-072c-42cd-8073-36358c3371ee",
                        dataStorageGuid: "1dfcff1f-3c42-4603-a617-147cbfd108ac",
                        documentation: "",
                        name: "Lastname",
                        qualifiedName: "TeamWorks.ILead.Lastname",
                        value: {
                            id: "2f21119d-7043-4b3b-8e16-b54131823981",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "1a57e254-53ff-4602-af1d-5c2f1c65fd65",
                        dataStorageGuid: "7d48312d-7767-4c28-a40b-24c30fb7045e",
                        documentation: "",
                        name: "IDNumber",
                        qualifiedName: "TeamWorks.ILead.IDNumber",
                        value: {
                            id: "c8354ec0-3bc8-4695-aec4-649d938438f1",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "45fbe675-4cbb-43bc-bac5-e1ad219fb39e",
                        dataStorageGuid: "c3c217a1-68dd-482e-a64a-67a6be5e8ee1",
                        documentation: "",
                        name: "DOB",
                        qualifiedName: "TeamWorks.ILead.DOB",
                        value: {
                            id: "848ebfea-a9b7-4716-987a-427960fd03fa",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "datetime",
                        required: false
                    },
                    {
                        id: "059cd404-f5d8-43f0-b21d-6492076e20d9",
                        dataStorageGuid: "8d45529a-52e9-45d7-973c-733b4937f336",
                        documentation: "",
                        name: "Gender",
                        qualifiedName: "TeamWorks.ILead.Gender",
                        value: {
                            id: "7f81b006-8b12-4308-80af-15ad083427e5",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "enumeration",
                        enumeration: {
                            id: "b72d2013-5e11-4fad-ae94-2148b08ad51c",
                            qualifiedName: "TeamWorks.GenderEnum",
                            values: [
                                {
                                    id: "780f4e1b-f609-4750-b1d4-6e25ee0c7057",
                                    name: "Male"
                                },
                                {
                                    id: "85ad5e46-bd51-4c4e-a409-a3edcc0213d7",
                                    name: "Female"
                                },
                                {
                                    id: "fa3c241c-4d0d-4e9f-8999-67e866ae4e33",
                                    name: "Other"
                                }
                            ]
                        },
                        required: false
                    },
                    {
                        id: "ec900ae7-a32a-4910-a87b-2e8f18ce9072",
                        dataStorageGuid: "20282c6c-5973-4cc5-ae12-9a16dbb5ac1f",
                        documentation: "",
                        name: "Income",
                        qualifiedName: "TeamWorks.ILead.Income",
                        value: {
                            id: "7d194573-7564-4c31-bd77-9232d4defdd0",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "decimal",
                        required: false
                    },
                    {
                        id: "98ece1b1-e428-4abf-a194-d64c98366c11",
                        dataStorageGuid: "8631f764-c3a4-4faa-9035-22aa57845c58",
                        documentation: "",
                        name: "Eligible",
                        qualifiedName: "TeamWorks.ILead.Eligible",
                        value: {
                            id: "ac5e8f44-07fa-49f3-82bb-e6cd1aefa242",
                            type: "stored",
                            defaultValue: "false"
                        },
                        type: "boolean",
                        required: false
                    }
                ],
                persisted: false,
                associations: [
                    {
                        id: "f5daf741-6276-4941-9fc7-837220afa48c",
                        name: "IJob_ILead",
                        qualifiedName: "TeamWorks.IJob_ILead",
                        documentation: "",
                        dataStorageGuid: "f59444b4-87bb-4f58-a14a-b94d6b309228",
                        type: "Reference",
                        owner: "Both",
                        entity: {
                            id: "2801de0a-59ca-4825-9db8-64e41df9a5ed",
                            qualifiedName: "TeamWorks.IJob"
                        },
                        parent: false,
                        child: true
                    }
                ]
            },
            {
                id: "a1b3453b-268a-4ce4-b719-88149009ed48",
                qualifiedName: "TeamWorks.RecordMetadata",
                name: "RecordMetadata",
                documentation: "",
                dataStorageGuid: "4bf681c5-3f53-41ea-8593-0987d4dacd34",
                remoteSource: "",
                attributes: [
                    {
                        id: "3d3d7c0f-1f34-4c4e-a7f1-ee1926974c21",
                        dataStorageGuid: "384aa978-cfd7-45bd-9042-574bc1b2d802",
                        documentation: "",
                        name: "Timestamp",
                        qualifiedName: "TeamWorks.RecordMetadata.Timestamp",
                        value: {
                            id: "473edee8-f022-451b-b23d-d94f7dd96667",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "long",
                        required: false
                    },
                    {
                        id: "37b83dab-69e0-45ef-b20b-c7a96b1fe691",
                        dataStorageGuid: "8a44e463-2ebe-4b9e-ac73-95ff15ea1a62",
                        documentation: "",
                        name: "Topic",
                        qualifiedName: "TeamWorks.RecordMetadata.Topic",
                        value: {
                            id: "d6249a36-cc7e-4deb-8e2d-b7c194fee8f5",
                            type: "stored",
                            defaultValue: ""
                        },
                        type: "string",
                        required: false
                    },
                    {
                        id: "48c0344f-a3ad-40c9-b37e-27478aa58489",
                        dataStorageGuid: "80028f42-f700-4ab4-b842-c3d65c1a5180",
                        documentation: "",
                        name: "Offset",
                        qualifiedName: "TeamWorks.RecordMetadata.Offset",
                        value: {
                            id: "b8c646f1-7d9d-402e-8c05-7f71a0b6e326",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "long",
                        required: false
                    },
                    {
                        id: "f8220713-8038-43a7-82a4-9c2e017afeaf",
                        dataStorageGuid: "14efa918-84f0-4480-95dc-455d1adbc0dc",
                        documentation: "",
                        name: "Partition",
                        qualifiedName: "TeamWorks.RecordMetadata.Partition",
                        value: {
                            id: "f8c12938-f9e6-40d4-9e9f-4f76a6c1c000",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "integer",
                        required: false
                    }
                ],
                persisted: false,
                associations: []
            },
            {
                id: "5209e399-986f-4a2f-8b65-1f05f943fbe5",
                qualifiedName: "TeamWorks.QueueItem",
                name: "QueueItem",
                documentation: "",
                dataStorageGuid: "d4867a93-3039-438d-ad16-0142cc8292ad",
                remoteSource: "",
                attributes: [
                    {
                        id: "c0af3adf-55fb-49aa-889c-044f5f300b5d",
                        dataStorageGuid: "6f338b1b-2b07-4b75-91c1-e7122fe0d5ed",
                        documentation: "",
                        name: "WorkId",
                        qualifiedName: "TeamWorks.QueueItem.WorkId",
                        value: {
                            id: "7b3e4bf2-e410-4b7a-872b-a52cf2bc4941",
                            type: "stored",
                            defaultValue: "0"
                        },
                        type: "long",
                        required: false
                    }
                ],
                persisted: false,
                associations: [
                    {
                        id: "59a16b2f-16b2-4d38-9df6-eab58228f831",
                        name: "QueueItem_Job",
                        qualifiedName: "TeamWorks.QueueItem_Job",
                        documentation: "",
                        dataStorageGuid: "f84af58c-918f-4dc0-8a39-5767ba3ad8d6",
                        type: "Reference",
                        owner: "Default",
                        entity: {
                            id: "6bb756ba-18cf-4aa2-add7-1d5cf8449459",
                            qualifiedName: "TeamWorks.Job"
                        },
                        parent: true,
                        child: false
                    }
                ]
            }
        ],
        number: 13
    },
    timeStamp: 1554157184399,
    took: 4160
};
function main() {
    const reverseDomain = `ca.bdc`;
    const appName = `cls`;
    let DataTypeMapping;
    (function (DataTypeMapping) {
        DataTypeMapping["DomainModels$StringAttributeType"] = "string";
        DataTypeMapping["DomainModels$EnumerationAttributeType"] = "enum";
        DataTypeMapping["DomainModels$IntegerAttributeType"] = "int";
        DataTypeMapping["DomainModels$LongAttributeType"] = "long";
        DataTypeMapping["DomainModels$DateTimeAttributeType"] = "long";
        DataTypeMapping["DomainModels$BooleanAttributeType"] = "boolean";
        DataTypeMapping["DomainModels$DecimalAttributeType"] = "bytes";
    })(DataTypeMapping || (DataTypeMapping = {}));
    const logicalTypes = {
        datetime: {
            type: ["null", "long"],
            logicalType: "timestamp-millis"
        },
        decimal: {
            type: ["null", "bytes"],
            logicalType: "decimal",
            precision: 9,
            scale: 0
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
        hasType(key) {
            return Object.keys(this).indexOf(key) > -1;
        },
        get(key) {
            return this[key];
        }
    };
    const basePath = "/Users/hgeldenhuys/Documents/Mendix/TeamWorks-Edubond/resources/AvroSchemas";
    if (!fs.existsSync(`${basePath}/${sampleDomain.revision.moduleName}`)) {
        fs.mkdirSync(`${basePath}/${sampleDomain.revision.moduleName}`);
    }
    sampleDomain.revision.entities.filter(entity => !entity.persisted).forEach((entity) => {
        let fields = entity.attributes.map((attribute) => {
            const moduleName = attribute.qualifiedName.split(".")[0], enumName = attribute.enumeration ? attribute.enumeration.qualifiedName.split(".")[1] : "?";
            const field = {
                name: `${attribute.name}`,
                type: [DataTypeMapping[attribute.type] || attribute.type],
                doc: attribute.documentation,
                default: null
            };
            if (logicalTypes.hasType(attribute.type)) {
                const logicalType = logicalTypes.get(attribute.type);
                for (const propName in logicalType) {
                    field[propName] = JSON.parse(JSON.stringify(logicalType[propName]));
                }
            }
            if (!field.type[1]) {
                throw new Error(`Missing configuration for ${attribute.type}: ${JSON.stringify(field)}`);
            }
            const type = field.type[1];
            if (type.type && (type.type === "enum") && attribute.enumeration) {
                type.symbols = attribute.enumeration.values.map((value) => value.name);
                type.name = `${reverseDomain}.${appName}.${moduleName}.${enumName}`;
            }
            if (attribute.required) {
                field.type.shift();
                field.default = field.default !== null ? field.default : undefined;
            }
            return field;
        });
        fields = fields.concat(entity.associations.filter((association) => association.parent).map((association) => {
            return {
                name: association.name,
                type: [
                    "null",
                    `${reverseDomain.toLowerCase()}.${appName.toLowerCase()}.${association.entity.qualifiedName}`
                ],
            };
        }));
        const avroTemplate = {
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
//# sourceMappingURL=avro-generator.js.map