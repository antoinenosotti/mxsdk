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
const mxsdk_1 = require("../../mxsdk");
const runtimearguments_1 = require("../../runtimearguments");
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
                verbose: true,
                username: "herman.geldenhuys@bdc.cap",
                list: true,
                fetch: undefined,
                module: undefined,
                entity: undefined,
                prettyPrint: undefined,
                json: undefined
            };
            const run = () => __awaiter(this, void 0, void 0, function* () {
                const runtime = new runtimearguments_1.RuntimeArguments({ props: args });
                runtime.time(`\x1b[32mTook\x1b[0m`);
                runtime.about();
                yield mxsdk_1.Main.run(runtime);
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