import { sfetch } from "./sfetch";
import { Constants } from "../constants";

export const getOsFloor = async (): Promise<number> => {
    try {
        const response = await sfetch(`${Constants.OS_API}/collection/${Constants.OS_SLUG}/stats`);
        return response.stats.floor_price;
    } catch (error: unknown) {
        return Promise.reject(error);
    }
}
