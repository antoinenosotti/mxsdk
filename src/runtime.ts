import { MendixSdkClient } from "mendixplatformsdk";
import { ICallbackUriOptions } from "./callbackurl";
import { ConsoleColorType, IRuntimeArgumentsBase, RuntimeBase } from "./runtimebase";

export enum FetchType {
    Help = "help",
    Modules = "modules",
    Entities = "entities",
    Attributes = "attributes"
}
export enum DeleteType {
    Help = "help",
    WorkingCopy = "working_copy",
    Revision = "revision"
}

export interface IRuntimeArguments extends IRuntimeArgumentsBase {
    fetch: FetchType | undefined;
    module: string | undefined;
    entity: string | undefined;
    username: string | undefined;
    apiKey: string | undefined;
    appId: string | undefined;
    appName: string | undefined;
    branchName: string;
    revision: number | undefined;
    list: boolean | undefined;
    load: boolean | undefined;
    serve: boolean | undefined;
    host: string | undefined;
    port: number | undefined;
    delete: DeleteType | undefined;
    workingCopyId: string | undefined;
    shutdownOnValidation: boolean | undefined;
    callback: ICallbackUriOptions | undefined;
    shutdown: boolean | undefined;
}

export class Runtime extends RuntimeBase implements IRuntimeArguments {
    about() {
        this.log(`\x1b[31m ____________  _____           \x1b[34m___  ___     ___________ _   __
\x1b[31m | ___ \\  _  \\/  __ \\          \x1b[34m|  \\/  |    /  ___|  _  \\ | / /     
\x1b[31m | |_/ / | | || /  \\/  \x1b[0m______  \x1b[34m| .  . |_  _\\ \`--.| | | | |/ /    \x1b[0mMendix SDK Helper
\x1b[31m | ___ \\ | | || |     \x1b[0m|______| \x1b[34m| |\\/| \\ \\/ /\`--. \\ | | |    \\    \x1b[0mwritten by Herman Geldenhuys
\x1b[31m | |_/ / |/ / | \\__/\\          \x1b[34m| |  | |>  </\\__/ / |/ /| |\\  \\   \x1b[0mCopyright BDC 2019
\x1b[31m \\____/|___/   \\____/          \x1b[34m\\_|  |_/_/\\_\\____/|___/ \\_| \\_/\x1b[0m   ${(new Date()).toISOString()}`);
        this.table(this);
    }
    constructor(props: any | IRuntimeArguments) {
        super(props);
        for (const propName in props) {
            // @ts-ignore
            this[propName] = props[propName];
        }
        if (props._) {
            const commandPassed =
                props._[0] === `delete` ? this.delete = props._[0] && (props._[1] || DeleteType.Help) :
                props._[0] === `list` ? this.list = true :
                props._[0] === `load` ? this.load = true :
                props._[0] === `serve` ? this.serve = true :
                props._[0] === `shutdown` ? this.shutdown = true :
                props._[0] === `fetch` ? this.fetch = props._[0] && (props._[1] || FetchType.Help) :
                false;
            if (commandPassed && false) {
                this.log(`commandPassed=${props._[0]}`);
            }
        }
    }

    public client: MendixSdkClient | undefined;
    getClient(): MendixSdkClient {
        const username = this.username || "unspecified";
        const apiKey = this.apiKey || "unspecified";

        this.client = new MendixSdkClient(username, apiKey);
        return this.client;
    }
    assert(statement: boolean, message: string, logError?: boolean): void {
        if (logError && !statement) {
            this.error(message);
        }
    }

    setServerDefaults(p?: { list?: boolean }) {
        /*
        * Set server defaults
        * */
        this.json = true;
        this.serve = false;
        this.shutdownOnValidation = false;
        if (p !== void 0) {
            this.list = p.list;
        }
    }

    entity: string | undefined;
    fetch: FetchType | undefined;
    module: string | undefined;
    apiKey: string | undefined;
    appId: string | undefined;
    appName: string | undefined;
    branchName = "";
    revision: number | undefined;
    username: string | undefined;
    list: boolean | undefined;
    load: boolean | undefined;
    host: string | undefined;
    port: number | undefined;
    serve: boolean | undefined;
    delete: DeleteType | undefined;
    workingCopyId: string | undefined;
    shutdownOnValidation: boolean | undefined;
    callback: ICallbackUriOptions | undefined;
    shutdown: boolean | undefined;

    async safeReturnOrError(result: any) {
        result = await result;
        if (!result) {
            throw new Error(`Safe return object cannot be empty`);
        }
        if (this.hasErrors()) {
            if (!this.json) {
                this.red(`An error occurred:`);
                this.table(this.runtimeError, ConsoleColorType.FGRed);
            } else {
                console.log(JSON.stringify({
                    error: this.runtimeError,
                    timeStamp: this.startTime,
                    took: Date.now() - this.startTime
                }));
            }
            return {
                error: this.runtimeError,
                timeStamp: this.startTime,
                took: Date.now() - this.startTime
            };
        } else {
            if (this.json) {
                console.log(JSON.stringify(result));
            } else {
                this.table(result);
                this.timeEnd(`\x1b[32mTook\x1b[0m`);
            }
            result.timeStamp = this.startTime;
            result.took = Date.now() - this.startTime;
            return result;
        }
    }

}