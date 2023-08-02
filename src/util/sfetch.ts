import fetch from 'node-fetch';

export const sfetch = async <T = any>(url: string, payload?: {}) => {
    try {
        const fetchRes = await fetch(url, payload);
        if (!fetchRes.ok) {
            throw Error(
                `Fetching ${url}: ${fetchRes.status} -> ${fetchRes.statusText}`
            );
        }

        const result = await fetchRes.json();
        if (!result) {
            throw Error(`Parsing ${url}: ${result}`);
        } else {
            return result as Promise<T>;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return Promise.reject(error.stack);
        } else {
            return Promise.reject(error);
        }
    }
};
