const { gql } = require("graphql-request")

const dopeInvQuery = gql`query Dopes(
                    $where: DopeWhereInput
                  ) {
                    dopes(
                      where: $where
                    ) {
                      edges {
                        node {
                          listings {
                            inputs {
                              amount
                            }
                          }
                          items {
                            fullname
                            type
                          }
                        }
                      }
                    }
                  }`;

const dopeStatusQuery = gql`query Dopes(
                    $where: DopeWhereInput
                  ) {
                    dopes(
                      where: $where
                    ) {
                      edges {
                        node {
                          claimed
                          opened
                        }
                      }
                    }
                  }`;

module.exports = {
  dopeInvQuery: dopeInvQuery,
  dopeStatusQuery: dopeStatusQuery
}
