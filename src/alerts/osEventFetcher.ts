import { Constants } from "../constants";
import { sfetch } from "../util/sfetch";

async function osEventFetcher<T>(eventType: string, occuredAfter: number): Promise<T> {
    return await sfetch<T>(`${Constants.OS_API}/events?` + new URLSearchParams({
        only_opensea: "false",
        asset_contract_address: Constants.DOPE_CONTRACT,
        event_type: eventType,
        occurred_after: occuredAfter
    } as {}), {
        method: 'GET',
        headers: {
            'X-API-KEY': process.env.DBOT_OS_API_KEY,
        }
    });
}

export default osEventFetcher;