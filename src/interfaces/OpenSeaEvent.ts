interface OpenSeaEvent {
    asset_events: AssetEvent[];
}

interface AssetEvent {
    asset: {
        name: string;
        token_metadata: string;
        token_id: number;
        total_price: number;
    };
    transaction: {
        timestamp: string;
    };
    created_date: string;
    starting_price: number;
    payment_token: {
        eth_price: number;
        usd_price: number;
    };
    total_price: number;
}

export { OpenSeaEvent, AssetEvent };
