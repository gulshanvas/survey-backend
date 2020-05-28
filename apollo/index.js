const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
// syntax error near unexpected token `('
const server = new ApolloServer({ typeDefs });


server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});