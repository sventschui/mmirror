// @flow
const http2 = require('http2');
const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');
const compress = require('koa-compress');
const { parse } = require('url');
const next = require('next');
const routes = require('./routes');

// instantiate next.js
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = routes.getRequestHandler(nextApp);

// instantiate our koa server
const app = new Koa();
const router = new Router();

router.get('*', async ctx => {
  // Be sure to pass `true` as the second argument to `url.parse`.
  // This tells it to parse the query portion of the URL.
  const parsedUrl = parse(ctx.req.url, true);

  await handle(ctx.req, ctx.res, parsedUrl);
  ctx.respond = false;
});

app.use(compress());
app.use(router.allowedMethods());
app.use(router.routes());

const port = process.env.PORT || 3000;

// bootstrap next.js
nextApp
  .prepare()
  .then(() => {
    http2
      .createSecureServer(
        {
          allowHTTP1: true,
          key: fs.readFileSync('server.key'),
          cert: fs.readFileSync('server.crt')
        },
        app.callback()
      )
      .listen(port, err => {
        if (err) throw err;
        console.log('Ready on 127.0.0.1:%d', port);
      });
  })
  .catch(error => {
    console.error('Failed to start server', error);
  });
