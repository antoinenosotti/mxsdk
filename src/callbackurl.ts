import { Response } from "request";

const request = require("request");
const uuidv4 = require("uuid/v4");

export interface ICallbackUriOptions {
    method: string;
    successUri: string;
    failUri: string;
    error: any;
}

export class CallbackUrl {
    public callbackId = uuidv4();
    callback(callbackUriOptions: ICallbackUriOptions | undefined, requestBody: any, failed = false): Promise<any> {
        console.debug(`Sending back ${JSON.stringify(requestBody)}`);
        return new Promise<any>((resolve, reject) => {
            if (callbackUriOptions) {
                const uri = !failed ? callbackUriOptions.successUri : callbackUriOptions.failUri;
                return request(uri, {
                    method: callbackUriOptions.method,
                    headers: {
                        "User-Agent": "request",
                        "Content-Type": "application/json"
                    },
                    json: {
                        "content-type": "application/json",
                        "body": requestBody
                    }
                }, (error: any, response: Response, responseBody: any) => {
                    if (error) {
                        console.error(`CB-ERROR: ${error}`);
                        reject(error);
                    } else {
                        console.debug(`CB: ${JSON.stringify(responseBody)}`);
                        if (responseBody instanceof Object) {
                            responseBody.callbackId = this.callbackId;
                        }
                        resolve(responseBody);
                    }
                });
            } else {
                console.warn(`Skipping callback for ${this.callbackId}`);
            }
        });
    }
}