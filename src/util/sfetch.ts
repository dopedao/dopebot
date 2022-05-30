import fetch from "node-fetch";

export const sfetch = async (url: string, payload?: {}): Promise<any> => {
    try {
        const fetchRes = await fetch(url, payload);
        if (!fetchRes.ok) {
            throw Error(`Fetching ${url}: ${fetchRes.status} -> ${fetchRes.statusText}`);
        }

        const result = await fetchRes.json();
        if (!result) {
            throw Error(`Parsing ${url}: ${result} -> ${result.message}`);
        } else {
            return Promise.resolve(result);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return Promise.reject(error.message);
        }
    }
}