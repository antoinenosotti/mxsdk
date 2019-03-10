"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mendixplatformsdk_1 = require("mendixplatformsdk");
const emoji = require("node-emoji");
const stopwatch = emoji.get(`stopwatch`);
var FetchType;
(function (FetchType) {
    FetchType["Modules"] = "modules";
    FetchType["Entities"] = "entities";
    FetchType["Attributes"] = "attributes";
})(FetchType = exports.FetchType || (exports.FetchType = {}));
class RuntimeArguments {
    constructor(parameters) {
        this.branchName = "";
        this.revision = -1;
        const props = parameters.props;
        for (const propName in props) {
            // @ts-ignore
            this[propName] = props[propName];
        }
    }
    time(timer) {
        if (this.verbose && !this.json) {
            console.time(`${stopwatch} ${timer}`);
        }
    }
    timeEnd(timer) {
        if (this.verbose && !this.json) {
            console.timeEnd(`${stopwatch} ${timer}`);
        }
    }
    table(obj) {
        if (this.verbose) {
            console.table(obj);
        }
    }
    timeStamp(label) {
        if (this.verbose && !this.json) {
            console.timeStamp(label);
        }
    }
    dir(obj) {
        if (this.verbose) {
            console.dir(obj, {
                colors: true,
                getters: false,
                showHidden: false,
                breakLength: 3
            });
        }
    }
    log(...args) {
        if (this.verbose) {
            console.log(args.join(``));
        }
    }
    green(...args) {
        args.unshift("\x1b[32m");
        args.push("\x1b[0m");
        this.log(args.join(""));
    }
    yellow(...args) {
        args.unshift("\x1b[33m");
        args.push("\x1b[0m");
        this.log(args.join(""));
    }
    red(...args) {
        args.unshift("\x1b[31m");
        args.push("\x1b[0m");
        this.log(args.join(""));
    }
    blue(...args) {
        args.unshift("\x1b[34m");
        args.push("\x1b[0m");
        this.log(args.join(""));
    }
    error(message) {
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
    getClient() {
        const username = this.username + "";
        const apiKey = this.apiKey + "";
        this.client = new mendixplatformsdk_1.MendixSdkClient(username, apiKey);
        return this.client;
    }
    assert(statement, message, logError) {
        if (logError && !statement) {
            this.error(message);
        }
    }
}
exports.RuntimeArguments = RuntimeArguments;
//# sourceMappingURL=runtimearguments.js.map