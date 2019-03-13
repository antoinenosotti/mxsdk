"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function grabSDKObject(model, runtime, skip = ["_properties"]) {
    const result = JSON.parse(JSON.stringify(model));
    for (const propName in model)
        try {
            if ((skip.indexOf(propName) > -1) ||
                propName.startsWith("_") ||
                propName.startsWith("$")) {
                continue;
            }
            // @ts-ignore
            if (!(model[propName] instanceof Object)) {
                // @ts-ignore
                result[propName] = model[propName];
            }
            else if (model[propName] instanceof Array) {
                // @ts-ignore
                const array = model[propName];
                // @ts-ignore
                result[propName] = [];
                array.forEach((element) => {
                    // @ts-ignore
                    result[propName].push(grabSDKObject(model[propName], runtime));
                });
            }
            else {
                // @ts-ignore
                result[propName] = grabSDKObject(model[propName], runtime);
            }
        }
        catch (e) {
        }
    for (const propName in result) {
        if (propName.startsWith("$")) {
            delete result[propName];
        }
    }
    return result;
}
exports.grabSDKObject = grabSDKObject;
//# sourceMappingURL=tools.js.map