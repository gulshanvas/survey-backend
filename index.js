const express = require('express'),
  graphqlHTTP = require('express-graphql'),
  cookieParser = require('cookie-parser'),
  JWTToken = require('./auth/JWT'),
  signUpResolver = require('./resolvers/signup'),
  loginResolver = require('./resolvers/login'),
  { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello(name: String!): String
    auth(loginCookie: String!): String
  }
`);

var loginSchema = buildSchema(`
  type Response {
    success: Boolean!,
    loginCookie: String,
    message: String
  }

  type Query {
    login(email: String!, password: String!): Response
  }
`);

var signUpSchema = buildSchema(`
  input User {
    firstname: String!, 
    lastname: String!, 
    email: String!, 
    password: String!,
    type: String!, 
    age: Int!, 
    gender: String!,
  }

  type UserOutput {
    firstname: String!, 
    lastname: String!, 
    email: String!, 
    type: String!, 
    age: Int!, 
    gender: String!,
  }

  type Response {
    success: Boolean!,
    message: String!
  }

  type Query {
    getLoggedIn(id: ID!): UserOutput
  }
  type Mutation {
    signup(userInfo: User): Response
  }
`);

const loggingMiddleware = (req, res, next) => {
  console.log('host :', req.headers.host);
  next();
}

// Resolver function for API endpoint.
var root = {
  hello: ({ name, context }) => {
    return `Hello ${name}`;
  },
  auth: ({ loginCookie }, injector) => {
    console.log('request cookie : ', injector.request.headers.cookie["gulshan"]);
    console.log('process.env.jwtsecret : ', process.env.JWT_SECRET_KEY);
    const secretToken = JWTToken.generateToken("gulshan");
    const verified = JWTToken.verifyLoginCookie(injector.request.cookies["jwttoken"]);
    console.log('verified : ', verified);
    injector.response.cookie("jwttoken", secretToken);
    if (loginCookie === 'gulshan') {
      return `Authenticated`
    }
    else {
      return `rejected`;
    }
  },
}

var app = express();
app.use(loggingMiddleware);
app.use(cookieParser());

// Creates new user
app.use("/signup", graphqlHTTP((request, response) => {
  return {
    schema: signUpSchema,
    rootValue: signUpResolver,
    graphiql: true,
    context: {
      request,
      response
    }
  }
}));

// Generates login cookie for already signed up user
app.use("/login", graphqlHTTP((request, response) => {
  return {
    schema: loginSchema,
    rootValue: loginResolver,
    graphiql: true,
    context: {
      request,
      response
    }
  }
}));

// For co-ordinator and respondents related endpoints
app.use('/graphql', graphqlHTTP((request, response) => {
  return {
    schema: schema,
    rootValue: root,
    graphiql: true,
    context:
    {
      request: request,
      response: response
    }
  }
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
