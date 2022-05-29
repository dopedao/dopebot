import { sfetch } from "./sfetch";
import { Constants } from "../constants";

export const getOsFloor = async (): Promise<number> => {
    const response = await sfetch(`${Constants.OS_API}/collection/${Constants.OS_SLUG}/stats`)
    if (!response?.stats?.floor_price) {
        return Promise.reject(response.statusText);
    }

    return response.stats.floor_price;
}
