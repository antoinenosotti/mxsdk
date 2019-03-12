"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emoji = require("node-emoji");
const stopwatch = emoji.get(`stopwatch`);
var ConsoleColorType;
(function (ConsoleColorType) {
    ConsoleColorType["FGRed"] = "\u001B[31m";
    ConsoleColorType["FGWhite"] = "\u001B[0m";
    ConsoleColorType["Reset"] = "\u001B[0m";
    ConsoleColorType["Bright"] = "\u001B[1m";
    ConsoleColorType["Dim"] = "\u001B[2m";
    ConsoleColorType["Underscore"] = "\u001B[4m";
    ConsoleColorType["Blink"] = "\u001B[5m";
    ConsoleColorType["Reverse"] = "\u001B[7m";
    ConsoleColorType["Hidden"] = "\u001B[8m";
    // Foreground
    ConsoleColorType["FgBlack"] = "\u001B[30m";
    ConsoleColorType["FgRed"] = "\u001B[31m";
    ConsoleColorType["FgGreen"] = "\u001B[32m";
    ConsoleColorType["FgYellow"] = "\u001B[33m";
    ConsoleColorType["FgBlue"] = "\u001B[34m";
    ConsoleColorType["FgMagenta"] = "\u001B[35m";
    ConsoleColorType["FgCyan"] = "\u001B[36m";
    ConsoleColorType["FgWhite"] = "\u001B[37m";
    // Background
    ConsoleColorType["BgBlack"] = "\u001B[40m";
    ConsoleColorType["BgRed"] = "\u001B[41m";
    ConsoleColorType["BgGreen"] = "\u001B[42m";
    ConsoleColorType["BgYellow"] = "\u001B[43m";
    ConsoleColorType["BgBlue"] = "\u001B[44m";
    ConsoleColorType["BgMagenta"] = "\u001B[45m";
    ConsoleColorType["BgCyan"] = "\u001B[46m";
    ConsoleColorType["BgWhite"] = "\u001B[47m";
})(ConsoleColorType = exports.ConsoleColorType || (exports.ConsoleColorType = {}));
class RuntimeError {
    constructor() {
        this.details = [];
    }
}
exports.RuntimeError = RuntimeError;
class RuntimeBase {
    constructor(props) {
        this.runtimeError = new RuntimeError();
        this.startTime = Date.now();
        for (const propName in props) {
            // @ts-ignore
            this[propName] = props[propName];
        }
    }
    time(timer) {
        if (!this.json) {
            console.time(`${stopwatch} ${timer}`);
        }
    }
    timeEnd(timer) {
        if (!this.json) {
            console.timeEnd(`${stopwatch} ${timer}`);
        }
    }
    table(obj, color = ConsoleColorType.FGWhite) {
        console.log(color);
        if (!this.json) {
            console.table(obj);
        }
        console.log(ConsoleColorType.FGWhite);
    }
    timeStamp(label) {
        if (!this.json) {
            console.timeStamp(label);
        }
    }
    dir(obj) {
        if (!this.json) {
            console.dir(obj, {
                colors: true,
                getters: false,
                showHidden: false,
                breakLength: 3
            });
        }
    }
    log(...args) {
        if (!this.json) {
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
        if (!this.json) {
            this.red(`Error: ${message}`);
        }
        if (this.runtimeError.details) {
            if (message.error || message.message) {
                this.runtimeError.message = message.message || message.error;
                this.runtimeError.name = message.name;
                this.runtimeError.code = message.code;
            }
            else {
                this.runtimeError.details.push(message + "");
            }
        }
    }
    warn(message) {
        if (!this.json) {
            console.warn(`Error: ${message}`);
        }
    }
    hasErrors() {
        // @ts-ignore
        return !!this.runtimeError.message || !!this.runtimeError.details.length;
    }
}
exports.RuntimeBase = RuntimeBase;
//# sourceMappingURL=runtimebase.js.map