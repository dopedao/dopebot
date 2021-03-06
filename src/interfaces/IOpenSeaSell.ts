interface OpenSeaSells {
    asset_events: Asset_Events[]
}

interface Asset_Events {
    asset: {
        name: string,
        token_metadata: string,
        token_id: number,
        total_price: number,
    },
    transaction: {
        timestamp: string,
    },
    payment_token: {
        eth_price: number,
        usd_price: number
    },
    total_price: number
}

export { OpenSeaSells as IOpenSeaSells };
export { Asset_Events as IAsset_Event };