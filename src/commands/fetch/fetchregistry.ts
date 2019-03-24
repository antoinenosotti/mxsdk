import { Modules } from "./modules";
import { FetchType, Runtime } from "../../runtime";
import { Fetch } from "./fetch";
import { Microflows } from "./microflows";
import { Entities } from "./entities";

export class UnknownFetcherError extends Error {
}

export class FetchFactory {
    private static fetchers: {id: string, fetcher: Fetch}[] = [
        {
            id: FetchType.Modules,
            fetcher: new Modules()
        },
        {
            id: FetchType.Microflows,
            fetcher: new Microflows()
        },
        {
            id: FetchType.Entities,
            fetcher: new Entities()
        }
    ];
    public static fetch(key: string, runtime: Runtime) {
        const fetcher = FetchFactory.fetchers.find((fetcher) => fetcher.id === key);
        if (fetcher) {
            return fetcher.fetcher.fetch(runtime);
        } else {
            throw new UnknownFetcherError(key);
        }
    }
}