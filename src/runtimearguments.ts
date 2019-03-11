import { MendixSdkClient } from "mendixplatformsdk";

const emoji = require("node-emoji");
const stopwatch = emoji.get(`stopwatch`);

export enum FetchType {
    Modules = "modules",
    Entities = "entities",
    Attributes = "attributes"
}
export enum DeleteType {
    WorkingCopy = "workingCopy",
    Revision = "revision"
}

export enum ConsoleColorType {
    Red = "\x1b[31m",
    White = "\x1b[0m"
}

export interface IRuntimeArguments {
    fetch: FetchType | undefined;
    module: string | undefined;
    entity: string | undefined;
    verbose: boolean | undefined;
    username: string | undefined;
    apiKey: string | undefined;
    appId: string | undefined;
    appName: string | undefined;
    branchName: string;
    revision: number | undefined;
    list: boolean | undefined;
    json: boolean | undefined;
    load: boolean | undefined;
    serve: boolean | undefined;
    host: string | undefined;
    port: number | undefined;
    delete: DeleteType | undefined;
    workingCopyId: string | undefined;
    shutdownOnValidation: boolean | undefined;
}

export interface IRuntimeError {
    name: string | undefined;
    message: string | undefined;
    code: string | number | undefined;
    statusCode: string | number | undefined;
    details: string[] | undefined;
}

export class RuntimeError implements IRuntimeError {
    code: string | number | undefined;
    details: string[] | undefined = [];
    message: string | undefined;
    name: string | undefined;
    statusCode: string | number | undefined;
}

export class RuntimeArguments implements IRuntimeArguments {
    time(timer: any) {
        if (this.verbose && !this.json) {
            console.time(`${stopwatch} ${timer}`);
        }
    }
    timeEnd(timer: any) {
        if (this.verbose && !this.json) {
            console.timeEnd(`${stopwatch} ${timer}`);
        }
    }
    table(obj: any, color: ConsoleColorType = ConsoleColorType.White) {
        console.log(color);
        if (this.verbose) {
            console.table(obj);
        }
        console.log(ConsoleColorType.White);
    }
    timeStamp(label?: string) {
        if (this.verbose && !this.json) {
            console.timeStamp(label);
        }
    }
    dir(obj: any) {
        if (this.verbose) {
            console.dir(obj, {
                colors: true,
                getters: false,
                showHidden: false,
                breakLength: 3
            });
        }
    }
    log(...args: any[]) {
        if (this.verbose) {
            console.log(args.join(``));
        }
    }
    green(...args: any[]) {
        args.unshift("\x1b[32m");
        args.push("\x1b[0m");
        this.log(args.join(""));
    }
    yellow(...args: any[]) {
        args.unshift("\x1b[33m");
        args.push("\x1b[0m");
        this.log(args.join(""));
    }
    red(...args: any[]) {
        args.unshift("\x1b[31m");
        args.push("\x1b[0m");
        this.log(args.join(""));
    }
    blue(...args: any[]) {
        args.unshift("\x1b[34m");
        args.push("\x1b[0m");
        this.log(args.join(""));
    }
    error(message: any) {
        if (!this.json) {
            console.error(`Error: ${message}`);
        }
        if (this.runtimeError.details) {
            if (message.error || message.message) {
                this.runtimeError.message = message.message || message.error;
                this.runtimeError.name = message.name;
                this.runtimeError.code = message.code;
            } else {
                this.runtimeError.details.push(message + "");
            }
        }
    }
    warn(message: any) {
        if (!this.json) {
            console.warn(`Error: ${message}`);
        }
    }
    about() {
        this.log(`
\x1b[31m ____________  _____           \x1b[34m___  ___     ___________ _   __
\x1b[31m | ___ \\  _  \\/  __ \\          \x1b[34m|  \\/  |    /  ___|  _  \\ | / /     
\x1b[31m | |_/ / | | || /  \\/  \x1b[0m______  \x1b[34m| .  . |_  _\\ \`--.| | | | |/ /    \x1b[0mMendix SDK Helper
\x1b[31m | ___ \\ | | || |     \x1b[0m|______| \x1b[34m| |\\/| \\ \\/ /\`--. \\ | | |    \\    \x1b[0mwritten by Herman Geldenhuys
\x1b[31m | |_/ / |/ / | \\__/\\          \x1b[34m| |  | |>  </\\__/ / |/ /| |\\  \\   \x1b[0mCopyright BDC 2019
\x1b[31m \\____/|___/   \\____/          \x1b[34m\\_|  |_/_/\\_\\____/|___/ \\_| \\_/\x1b[0m   ${(new Date()).toISOString()}
         
`);
        this.log(`Runtime Arguments:`);
        this.table(this);
        // this.log(`\n\nWorking Copy Registry:`);
        // this.table(WorkingCopyManager.config)
    }

    constructor(props: any | IRuntimeArguments) {
        for (const propName in props) {
            // @ts-ignore
            this[propName] = props[propName];
        }
    }

    public client: MendixSdkClient | undefined;
    getClient(): MendixSdkClient {
        const username = this.username + "";
        const apiKey = this.apiKey + "";

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
        this.verbose = false;
        this.serve = false;
        this.shutdownOnValidation = false;
        if (p !== void 0) {
            this.list = p.list;
        }
    }

    runtimeError: RuntimeError = new RuntimeError();
    startTime = Date.now();
    hasErrors() {
        // @ts-ignore
        return !!this.runtimeError.message || !!this.runtimeError.details.length;
    }

    entity: string | undefined;
    fetch: FetchType | undefined;
    module: string | undefined;
    verbose: boolean | undefined;
    apiKey: string | undefined;
    appId: string | undefined;
    appName: string | undefined;
    branchName = "";
    revision: number | undefined;
    username: string | undefined;
    list: boolean | undefined;
    json: boolean | undefined;
    load: boolean | undefined;
    host: string | undefined;
    port: number | undefined;
    serve: boolean | undefined;
    delete: DeleteType | undefined;
    workingCopyId: string | undefined;
    shutdownOnValidation: boolean | undefined;

    safeReturnOrError(result: any) {
        if (!result) {
            throw new Error(`Safe return object cannot be empty`);
        }
        if (this.hasErrors()) {
            if (!this.json) {
                this.red(`An error occurred:`);
                this.table(this.runtimeError, ConsoleColorType.Red);
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