import { gql } from 'graphql-request';

const dopeInvQuery = gql`
    query Dopes($where: DopeWhereInput) {
        dopes(where: $where) {
            edges {
                node {
                    rank
                    listings {
                        inputs {
                            amount
                        }
                    }
                    items {
                        fullname
                        type
                        tier
                        count
                    }
                }
            }
        }
    }
`;

const dopeStatusQuery = gql`
    query Dopes($where: DopeWhereInput) {
        dopes(where: $where) {
            edges {
                node {
                    claimed
                    opened
                }
            }
        }
    }
`;

const dopeRarityQuery = gql`
    query Dopes($where: DopeWhereInput) {
        dopes(where: $where) {
            edges {
                node {
                    items {
                        fullname
                        type
                        tier
                        greatness
                        count
                    }
                }
            }
        }
    }
`;

const dopeSellQuery = gql`
    query Dopes($where: DopeWhereInput) {
        dopes(where: $where) {
            edges {
                node {
                    claimed
                    opened
                    rank
                }
            }
        }
    }
`;

export const dopeQueries = {
    dopeInvQuery: dopeInvQuery,
    dopeStatusQuery: dopeStatusQuery,
    dopeSellQuery: dopeSellQuery
};
