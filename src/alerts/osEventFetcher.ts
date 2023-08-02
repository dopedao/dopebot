import { Constants } from '../constants';
import { OpenSeaEvent } from '../interfaces/OpenSeaEvent';
import { sfetch } from '../util/sfetch';

async function osEventFetcher(
    eventType: string,
    occuredAfter: number,
    contract: string
): Promise<OpenSeaEvent> {
    return await sfetch<OpenSeaEvent>(
        `${Constants.OS_API}/events?` +
            new URLSearchParams({
                only_opensea: 'false',
                asset_contract_address: contract,
                event_type: eventType,
                occurred_after: occuredAfter
            } as {}),
        {
            method: 'GET',
            headers: {
                'X-API-KEY': process.env.DBOT_OS_API_KEY
            }
        }
    );
}

export default osEventFetcher;
