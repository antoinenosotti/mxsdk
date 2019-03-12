const emoji = require("node-emoji");
const stopwatch = emoji.get(`stopwatch`);

export enum ConsoleColorType {
    FGRed = "\x1b[31m",
    FGWhite = "\x1b[0m",
    Reset = "\x1b[0m",
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m",
    // Foreground
    FgBlack = "\x1b[30m",
    FgRed = "\x1b[31m",
    FgGreen = "\x1b[32m",
    FgYellow = "\x1b[33m",
    FgBlue = "\x1b[34m",
    FgMagenta = "\x1b[35m",
    FgCyan = "\x1b[36m",
    FgWhite = "\x1b[37m",
    // Background
    BgBlack = "\x1b[40m",
    BgRed = "\x1b[41m",
    BgGreen = "\x1b[42m",
    BgYellow = "\x1b[43m",
    BgBlue = "\x1b[44m",
    BgMagenta = "\x1b[45m",
    BgCyan = "\x1b[46m",
    BgWhite = "\x1b[47m"
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

export interface IRuntimeArgumentsBase {
    json: boolean | undefined;
}

export class RuntimeBase implements IRuntimeArgumentsBase {
    constructor(props: any | IRuntimeArgumentsBase) {
        for (const propName in props) {
            // @ts-ignore
            this[propName] = props[propName];
        }
    }
    time(timer: any) {
        if (!this.json) {
            console.time(`${stopwatch} ${timer}`);
        }
    }
    timeEnd(timer: any) {
        if (!this.json) {
            console.timeEnd(`${stopwatch} ${timer}`);
        }
    }
    table(obj: any, color: ConsoleColorType = ConsoleColorType.FGWhite) {
        console.log(color);
        if (!this.json) {
            console.table(obj);
        }
        console.log(ConsoleColorType.FGWhite);
    }
    timeStamp(label?: string) {
        if (!this.json) {
            console.timeStamp(label);
        }
    }
    dir(obj: any) {
        if (!this.json) {
            console.dir(obj, {
                colors: true,
                getters: false,
                showHidden: false,
                breakLength: 3
            });
        }
    }
    log(...args: any[]) {
        if (!this.json) {
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
            this.red(`Error: ${message}`);
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
    hasErrors() {
        // @ts-ignore
        return !!this.runtimeError.message || !!this.runtimeError.details.length;
    }
    runtimeError: RuntimeError = new RuntimeError();
    startTime = Date.now();

    json: boolean | undefined;
}