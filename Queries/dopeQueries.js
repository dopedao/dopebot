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