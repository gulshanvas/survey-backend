const express = require('express'),
  graphqlHTTP = require('express-graphql'),
  cookieParser = require('cookie-parser'),
  JWTToken = require('./auth/JWT'),
  signUpResolver = require('./resolvers/signup'),
  loginResolver = require('./resolvers/login'),
  surveyResolver = require('./resolvers/survey'),
  { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Surveys {
    key: String!
    formSchema: String!
  }

  type SurveyResponse {
    surveys: [Surveys]
    success: Boolean!
    message: String!
  }

  type Query {
   fetchSurveys: SurveyResponse
  }

  type Response {
    success: Boolean!,
    message: String!
  }

  input Survey {
    criteria: String!,
    formSchema: String!
  }

  input RespondentResponse {
    surveyId: String!,
    formResponse: String!
  }

  input CoOrdinatorResponse {
    surveyId: String!,
    userId: String!,
    response: String!
  }

  type Mutation {
    createSurvey(survey: Survey): Response
    submitResponse(response: RespondentResponse): Response
    updateResponse(response: CoOrdinatorResponse): Response
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
    gender: String!
  }

  type Response {
    success: Boolean!,
    message: String!
  }

  type Query {
    signupuser(id: ID!): String!
  }
  type Mutation {
    signup(userInfo: User): Response
  }
`);

const loggingMiddleware = (req, res, next) => {
  console.log('host :', req.headers.host);
  next();
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
    rootValue: surveyResolver,
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
