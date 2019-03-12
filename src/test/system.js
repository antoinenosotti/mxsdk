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
const mxsdk_1 = require("../mxsdk");
const runtime_1 = require("../runtime");
const chai_1 = require("chai");
require("mocha");
describe(`Commands`, () => {
    it(`List Revisions`, () => __awaiter(this, void 0, void 0, function* () {
        try {
            const args = {
                apiKey: "49dd389b-5c1c-4151-b536-ecba46c73c96",
                appId: "2055bb3f-8a67-4ad3-8765-3e31432bac4f",
                appName: "Octo",
                branchName: "",
                revision: 11,
                load: false,
                username: "herman.geldenhuys@bdc.ca",
                list: true,
                fetch: undefined,
                module: undefined,
                json: undefined,
                host: void 0,
                port: void 0,
                serve: false,
                entity: void 0,
                workingCopyId: void 0,
                delete: runtime_1.DeleteType.WorkingCopy,
                shutdownOnValidation: void 0,
                callback: void 0
            };
            const run = () => __awaiter(this, void 0, void 0, function* () {
                const runtime = new runtime_1.Runtime({ props: args });
                runtime.time(`\x1b[32mTook\x1b[0m`);
                runtime.about();
                const main = new mxsdk_1.MxSDK();
                yield main.execute(runtime);
            });
            yield run();
            chai_1.expect("I'm alive").to.equal("I'm alive");
        }
        catch (e) {
            console.log("FAIL");
            chai_1.expect("I'm dead").to.equal("I'm alive");
        }
    }));
});
//# sourceMappingURL=system.js.map