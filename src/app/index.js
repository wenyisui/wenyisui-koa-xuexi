const Koa=require('koa');
const {koaBody}=require('koa-body');

const errHandler=require('./errHandler')

// const userRouter=require('../router/user.route')
// const goodsRouter=require('../router/goods.route')
const router=require('../router');

const app=new Koa();

app.use(koaBody());
app.use(router.routes());
// app.use(userRouter.routes());
// app.use(goodsRouter.routes());
app.use(router.allowedMethods());  //router的方法

//进行统一的错误处理
app.on('error',errHandler)
module.exports=app;