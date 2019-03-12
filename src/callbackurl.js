"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const uuidv4 = require("uuid/v4");
class CallbackUrl {
    constructor() {
        this.callbackId = uuidv4();
    }
    callback(callbackUriOptions, requestBody, failed = false) {
        console.debug(`Sending back ${JSON.stringify(requestBody)}`);
        return new Promise((resolve, reject) => {
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
                }, (error, response, responseBody) => {
                    if (error) {
                        console.error(`CB-ERROR: ${error}`);
                        reject(error);
                    }
                    else {
                        console.debug(`CB: ${JSON.stringify(responseBody)}`);
                        if (responseBody instanceof Object) {
                            responseBody.callbackId = this.callbackId;
                        }
                        resolve(responseBody);
                    }
                });
            }
            else {
                console.warn(`Skipping callback for ${this.callbackId}`);
            }
        });
    }
}
exports.CallbackUrl = CallbackUrl;
//# sourceMappingURL=callbackurl.js.map