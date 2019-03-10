import { MendixSdkClient } from "mendixplatformsdk";

const emoji = require("node-emoji");
const stopwatch = emoji.get(`stopwatch`);

export enum FetchType {
    Modules = "modules",
    Entities = "entities",
    Attributes = "attributes"
}

export interface IRuntimeArguments {
    fetch: FetchType | undefined;
    module: string | undefined;
    entity: string | undefined;
    prettyPrint: boolean | undefined;
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
    table(obj: any) {
        if (this.verbose) {
            console.table(obj);
        }
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
    error(message: string | Error) {
        this.hasErrors = true;
        console.error(`Error: ${message}`);
    }
    about() {
        this.log(`\x1b[31m ____________  _____           \x1b[34m___  ___     ___________ _   __
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

    constructor(parameters: { props: any | IRuntimeArguments }) {
        const props = parameters.props;
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

    hasErrors: boolean | undefined;

    entity: string | undefined;
    fetch: FetchType | undefined;
    module: string | undefined;
    prettyPrint: boolean | undefined;
    verbose: boolean | undefined;
    apiKey: string | undefined;
    appId: string | undefined;
    appName: string | undefined;
    branchName = "";
    revision = -1;
    username: string | undefined;
    list: boolean | undefined;
    json: boolean | undefined;
    load: boolean | undefined;
}