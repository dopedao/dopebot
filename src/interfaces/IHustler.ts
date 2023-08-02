interface Hustler {
    hustlers: {
        totalCount: number;
        edges: Edge[];
    };
}

interface Edge {
    node: {
        name: string;
        type: string;
        title: string;
        svg: string;
        neck: {
            fullname: string;
        };
        ring: {
            fullname: string;
        };
        accessory: {
            fullname: string;
        };
        drug: {
            fullname: string;
        };
        hand: {
            fullname: string;
        };
        weapon: {
            fullname: string;
        };
        clothes: {
            fullname: string;
        };
        vehicle: {
            fullname: string;
        };
        waist: {
            fullname: string;
        };
        foot: {
            fullname: string;
        };
    };
}
export { Hustler as IHustler };
