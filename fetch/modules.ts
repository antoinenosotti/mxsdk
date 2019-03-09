import {RuntimeArguments} from "../runtimearguments";
import {WorkingCopyManager} from "../workingcopymanager";

function grabSDKObject(model: any, runtime: any, skip: string[] = ["_properties"]) {
    const result = JSON.parse(JSON.stringify(model));
    for (const propName in model) try {
        if (
            (skip.indexOf(propName) > -1) ||
            propName.startsWith("_") ||
            propName.startsWith("$")) {
            continue;
        }
        // @ts-ignore
        runtime.yellow(`${propName} = ${model[propName]} typeof ${typeof model[propName]}`);
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
            runtime.red(model[propName].constructor.getName());
            // @ts-ignore
            result[propName] = grabSDKObject(model[propName], runtime);
        }
    } catch (e) {}
    for (const propName in result) {
        if (propName.startsWith("$")) {
            delete result[propName];
        }
    }
    return result;
}

export class Modules {
    public static async fetchModules(runtime: RuntimeArguments) {
        const workingCopy = await WorkingCopyManager.getRevision(runtime);
        const modules = await workingCopy.allModules();
        modules.forEach((module) => {
            runtime.blue(JSON.stringify(grabSDKObject(module, runtime), null, 2));
            throw new Error('123');
        });
        // runtime.table(modules);
        // runtime.log(JSON.stringify(modules, null, 2));
        // runtime.dir(modules);
        // @ts-ignore
        // runtime.red(JSON.stringify(modules, censor(modules), 2));
    }
}