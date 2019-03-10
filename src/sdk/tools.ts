export function grabSDKObject(model: any, runtime: any, skip: string[] = ["_properties"]): any {
    const result = JSON.parse(JSON.stringify(model));
    for (const propName in model) try {
        if (
            (skip.indexOf(propName) > -1) ||
            propName.startsWith("_") ||
            propName.startsWith("$")) {
            continue;
        }
        // @ts-ignore
        if (!(model[propName] instanceof Object)) {
            // @ts-ignore
            result[propName] = model[propName];
            //runtime.red(JSON.stringify(module, censor(module), 2));
        } else if (model[propName] instanceof Array) {
            // @ts-ignore
            const array = model[propName] as Array;
            // @ts-ignore
            result[propName] = [];
            array.forEach((element: any) => {
                // @ts-ignore
                result[propName].push(grabSDKObject(model[propName], runtime));
            });
        } else {
            // @ts-ignore
            result[propName] = grabSDKObject(model[propName], runtime);
        }
    } catch (e) {
    }
    for (const propName in result) {
        if (propName.startsWith("$")) {
            delete result[propName];
        }
    }
    return result;
}
