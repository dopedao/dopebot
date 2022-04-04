module.exports = {
    hustlerQuery(id) {
        return JSON.stringify(
            {
                variables: {
                    where : {
                        id : id
                    }
                },
                query: `query Hustler($where: HustlerWhereInput) {
                    hustlers(where: $where) {
                      edges {
                        node {
                          name
                          type
                          title
                          neck {
                            fullname
                          }
                          ring {
                            fullname
                          }
                          accessory {
                            fullname
                          }
                          drug {
                            fullname
                          }
                          hand {
                            fullname
                          }
                          weapon {
                            fullname
                          }
                          clothes {
                            fullname
                          }
                          vehicle {
                            fullname
                          }
                          waist {
                            fullname
                          }
                          foot {
                            fullname
                          }
                        }
                      }
                    }
                  }`
            })
    },
    hustlerImageQuery(id) {
        return JSON.stringify(
            {
                variables: {
                    where : {
                        id : id
                    }
                },
                query: `query Hustler($where: HustlerWhereInput) {
                    hustlers(where: $where) {
                      edges {
                        node {
                          title
                          name
                          svg
                        }
                      }
                    }
                  }`
            })
    }
}