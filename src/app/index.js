const path=require('path');

const Koa=require('koa');
const {koaBody}=require('koa-body');
const KoaStatic = require('koa-static');

const errHandler=require('./errHandler')

// const userRouter=require('../router/user.route')
// const goodsRouter=require('../router/goods.route')
const router=require('../router');

const app=new Koa();

app.use(koaBody({
    multipart:true,
    formidable:{
        // 在配置选项option里，不推荐使用相对路径
        //在option里的相对路径，不是相对的当前文件，相对process.cwd()
        uploadDir:path.join(__dirname,'../upload'),
        keepExtensions:true,
    }
}));
app.use(KoaStatic(path.join(__dirname,'../upload')));
app.use(router.routes());
// app.use(userRouter.routes());
// app.use(goodsRouter.routes());
app.use(router.allowedMethods());  //router的方法

//进行统一的错误处理
app.on('error',errHandler)
module.exports=app;