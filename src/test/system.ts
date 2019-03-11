import { MxSDK } from "../mxsdk";
import { DeleteType, IRuntimeArguments, RuntimeArguments } from "../runtimearguments";
import { expect } from "chai";
import "mocha";


describe(`Commands`, () => {

    it(`List Revisions`, async () => {
        try {
            const args: IRuntimeArguments = {
                apiKey: "49dd389b-5c1c-4151-b536-ecba46c73c96",
                appId: "2055bb3f-8a67-4ad3-8765-3e31432bac4f",
                appName: "Octo",
                branchName: "",
                revision: 11,
                load: false,
                verbose: true,
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
                delete: DeleteType.WorkingCopy,
                shutdownOnValidation: void 0
            };

            const run = async () => {
                const runtime = new RuntimeArguments({props: args});
                runtime.time(`\x1b[32mTook\x1b[0m`);
                runtime.about();
                const main = new MxSDK();
                await main.execute(runtime);
            };

            await run();
            expect("I'm alive").to.equal("I'm alive");
        } catch (e) {
            console.log("FAIL");
            expect("I'm dead").to.equal("I'm alive");
        }
    });
});
