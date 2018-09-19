// @flow
const https = require('https');
const fs = require('fs');
const Koa = require('koa');
const compress = require('koa-compress');
const path = require('path');
const { ApolloServer, gql, makeExecutableSchema } = require('apollo-server-koa');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const resolvers = require('./resolvers');

// instantiate our koa server
const app = new Koa();

const typeDefs = gql(fs.readFileSync(path.resolve(__dirname, 'schema.graphqls'), 'utf-8'));

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({ schema });

app.use(compress());

server.applyMiddleware({ app, playground: true });

const port = process.env.PORT || 3001;

// TODO: migrate to HTTP2 once apollo supports it
const ws = https.createServer(
  {
    allowHTTP1: true,
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
  },
  app.callback(),
);
ws.listen(port, err => {
  if (err) throw err;
  console.log('Ready on 127.0.0.1:%d', port);

  // eslint-disable-next-line no-new
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server: ws,
      path: '/graphql',
    },
  );
});
