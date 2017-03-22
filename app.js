const Koa = require('koa');
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const router = require('koa-router')();

const app = new Koa();



// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  map: { html: 'ejs' },
  options: {
    sitename: 'ShortURL'
  }
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});


const index = require('./routes/index');

app.use(index.routes(), index.allowedMethods());

// response

app.on('error', function (err, ctx) {
  console.log(err)
  logger.error('server error', err, ctx);
});


module.exports = app;