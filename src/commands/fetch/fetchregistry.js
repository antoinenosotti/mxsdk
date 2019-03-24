"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("./modules");
const runtime_1 = require("../../runtime");
const microflows_1 = require("./microflows");
const entities_1 = require("./entities");
class UnknownFetcherError extends Error {
}
exports.UnknownFetcherError = UnknownFetcherError;
class FetchFactory {
    static fetch(key, runtime) {
        const fetcher = FetchFactory.fetchers.find((fetcher) => fetcher.id === key);
        if (fetcher) {
            return fetcher.fetcher.fetch(runtime);
        }
        else {
            throw new UnknownFetcherError(key);
        }
    }
}
FetchFactory.fetchers = [
    {
        id: runtime_1.FetchType.Modules,
        fetcher: new modules_1.Modules()
    },
    {
        id: runtime_1.FetchType.Microflows,
        fetcher: new microflows_1.Microflows()
    },
    {
        id: runtime_1.FetchType.Entities,
        fetcher: new entities_1.Entities()
    }
];
exports.FetchFactory = FetchFactory;
//# sourceMappingURL=fetchregistry.js.map