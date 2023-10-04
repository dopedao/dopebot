import { sfetch } from './sfetch';
import { Constants } from '../constants';
import { IMarketStats } from '../interfaces/IMarketStats';

export const getOsFloor = async (): Promise<number> => {
    try {
        const response = await sfetch<IMarketStats>(
            `${Constants.OS_API}/collection/${Constants.DOPE_OS_SLUG}/stats`
        );
        return response!.stats.floor_price;
    } catch (error: unknown) {
        return Promise.reject(error);
    }
};
