import { Main } from "../../mxsdk";
import { IRuntimeArguments, RuntimeArguments } from "../../runtimearguments";
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
                username: "herman.geldenhuys@bdc.cap",
                list: true,
                fetch: undefined,
                module: undefined,
                entity: undefined,
                prettyPrint: undefined,
                json: undefined
            };

            const run = async () => {
                const runtime = new RuntimeArguments({props: args});
                runtime.time(`\x1b[32mTook\x1b[0m`);
                runtime.about();
                await Main.run(runtime);
            };

            await run();
            expect("I'm alive").to.equal("I'm alive");
        } catch (e) {
            console.log("FAIL");
            expect("I'm dead").to.equal("I'm alive");
        }
    });
});
