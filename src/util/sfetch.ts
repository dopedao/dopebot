import axios from 'axios';

export const sfetch = async <T = any>(url: string, payload?: {}) => {
    try {
        const fetchRes = await axios.get(url, {
            params: payload
        });
        return fetchRes.data as T;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return Promise.reject(error.stack);
        } else {
            return Promise.reject(error);
        }
    }
};
