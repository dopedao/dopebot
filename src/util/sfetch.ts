import fetch from "node-fetch";

export const sfetch = async (url: string, payload?: {}): Promise<any> => {

    const fetchRes = await fetch(url, payload);
    const result = await fetchRes.json()

    if (!result) {
        const error = (result && result.message) || fetchRes.status;
        return Promise.reject(error)
    } else {
        return result;
    }
}