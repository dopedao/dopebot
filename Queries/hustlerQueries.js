const { gql } = require("graphql-request")

const hustlerQuery = gql`query Hustler($where: HustlerWhereInput) {
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
                  }`;
const hustlerImageQuery = gql`query Hustler($where: HustlerWhereInput) {
                    hustlers(where: $where) {
                      edges {
                        node {
                          title
                          name
                          svg
                        }
                      }
                    }
                  }`;
const hustlerTotalCountQuery = gql`query Hustler {
            hustlers {
              totalCount
            }
          }`;

module.exports = {
  hustlerQuery: hustlerQuery,
  hustlerImageQuery: hustlerImageQuery,
  hustlerTotalCountQuery: hustlerTotalCountQuery
}