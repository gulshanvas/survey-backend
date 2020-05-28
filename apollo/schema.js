const { gql } = require('apollo-server');

const typeDefs = gql`
  # Your schema will go here
  type Launch {
    id: ID!
    name: String
    isBooked: Boolean!
  }
  type Query {
    launch(id: ID!): Launch
  }
`;

module.exports = typeDefs;