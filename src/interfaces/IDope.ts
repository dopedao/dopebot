interface Dope {
    dopes: {
        edges: Edges[];
    };
}

interface Edges {
    node: {
        rank: number;
        listings: Listing[];
        items: Item[];
        claimed: boolean;
        opened: boolean;
    };
}

interface Listing {
    inputs: Input[];
}

interface Input {
    amount: number;
}

interface Item {
    fullname: string;
    type: string;
    tier: string;
    count: number;
}

export { Dope as IDope };
