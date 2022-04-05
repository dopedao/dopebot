module.exports = {
    dopeInvQuery(id) {
        return JSON.stringify(
            {
                variables: {
                    where: {
                        id: id
                    }
                },
                query: `query Dopes(
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
                  }`
            })
    },
    dopeStatusQuery(id) {
        return JSON.stringify(
            {
                variables: {
                    where: {
                        id: id
                    }
                },
                query: `query Dopes(
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
                  }`
            })
    }
}