# 一，项目的初始化

## 1，npm的初始化

     npm init -y

生成package.json文件

   :记录项目的依赖

## 2，git初始化

    git init

生成'.git'隐藏文件夹，git本地仓库

## 3，创建readMe文件

# 二.搭建项目

## 1，安装koa框架

    npm install koa

## 2，编写最基础的app

 创建src/main.js

    const Koa=require('koa');
    
    const app=new Koa();
    
    app.use((ctx,next)=>{   //中间件
       ctx.body='hello world'
    })
    
    app.listen(3000,()=>{
        console.log('server is running on http://localhost:3000');
    })

## 3，测试

在终端，使用node src/main.js

# 三.项目的基本优化

## 1，自动重启服务

安装nodemon工具

    npm i nodemon -D

编写package.json脚本

    "scripts": {
        "dev":"nodemon ./src/main.js",
        "test": "echo \"Error: no test specified\" && exit 1"
      },

执行npm run dev启动服务

## 2，读取配置文件

安装dotenv,读取跟目录中的.env文件，将配置写到process.env中

    npm i dotenv

创建.env文件

APP_PORT=8000

创建src/config/config.default.js

    const dotenv=require('dotenv');
    
    dotenv.config();
    
    // console.log(process.env.APP_PORT);
    
    module.exports=process.env    //导出进程env

改写main.js

    const Koa=require('koa');
    
    const {APP_PORT}=require('./config/config.default');
    
    const app=new Koa();
    
    app.use((ctx,next)=>{   //中间件
       ctx.body='hello api'
    })
    
    app.listen(APP_PORT,()=>{
        console.log(`server is running on http://localhost:${APP_PORT}`);
    })

# 四.添加路由

路由：根据不同的URL，调用对应的处理函数

## 1，安装koa-router

    npm i koa-router

步骤：

  1，导入包

  2，实例化对象

  3，编写路由

  4，注册中间件

## 2，编写路由

创建src/router目录，编写user.route.js

    const Router=require('koa-router');
    
    const router=new Router({prefix:'/users'});
    
    
    // GET /users/
    router.get('/',(ctx,body)=>{
        ctx.body='hello users'
    })
    
    
    module.exports=router;

## 3，改写main.js

    const Koa=require('koa');
    
    const {APP_PORT}=require('./config/config.default');
    
    const userRouter=require('./router/user.route')
    
    const app=new Koa();
    
    app.use(userRouter.routes());
    
    app.listen(APP_PORT,()=>{
        console.log(`server is running on http://localhost:${APP_PORT}`);
    })

# 五.目录结构优化

## 1，将http服务和app业务拆分

创建src/app/index.js

    const Koa=require('koa');
    
    const userRouter=require('../router/user.route')
    
    const app=new Koa();
    
    app.use(userRouter.routes());
    
    
    module.exports=app;

改写main.js

    const {APP_PORT}=require('./config/config.default');
    
    const app=require('./app')
    
    app.listen(APP_PORT,()=>{
        console.log(`server is running on http://localhost:${APP_PORT}`);
    })

## 2，将路由和控制器拆分

路由：解析URL，分布给控制器对应的方法

控制器：处理不同的业务

改写user.route.js

    const Router=require('koa-router');
    
    const {register,login}=require('../controller/user.controller')
    
    const router=new Router({prefix:'/users'});
    
    //注册接口
    router.post('/register',register)
    //登录接口
    router.post('/login',login);
    
    module.exports=router;

创建controller/user.controller.js

    class UserController{
        async register(ctx,next){
             ctx.body='用户注册成功'
        }
        async login(ctx,next){
            ctx.body='登录成功'
        }
    }
    
    module.exports=new UserController();

# 六，解析body

## 1，安装koa-body

    npm install koa-body

## 2，注册中间件

改写app/index.js

![](C:\Users\86184\Desktop\Snipaste_2022-12-14_22-07-39.png)

## 3，解析请求的数据

改写user.controller.js文件

```js
const {createUser}=require('../service/user.service')
class UserController{
    async register(ctx,next){
        // 获取数据
        // console.log(ctx.request.body);
        const {user_name,password}=ctx.request.body;
        //操作数据库
        const res=await createUser(user_name,password);
        console.log(res);
        //返回结果
        ctx.body=ctx.request.body;
    }
    async login(ctx,next){
        ctx.body='登录成功'
    }
}



module.exports=new UserController();
```

## 4，拆分service层

service层主要是做数据库的处理

创建src/service/user.service.js

```js
class UserService{
    async createUser(user_name,password){
        //todo：写入数据库
        return '写入数据库成功'
    }
}

module.exports=new UserService();
```

# 七，数据库操作

sequelize ORM数据库工具

ORM：对象关系映射

   ·数据表映射(对应)一个类

   ·数据表中的数据行(记录)对应一个对象

  ·数据表字段对应对象的属性

  ·数据表的操作对应对象的方法

## 1，安装sequelize

    npm i sequelize mysql2

## 2，连接数据库

src/db/seq.js

```js
const { Sequelize } = require('sequelize');

const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PWD,
    MYSQL_DB
} = require('../config/config.default')

const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
    host: MYSQL_HOST,
    dialect: 'mysql',
});

seq.authenticate().then(()=>{
    console.log('数据库连接成功');
}).catch((err)=>{
    console.log('数据库连接失败',err);
})

module.exports = seq;
```

## 3，编写配置文件

.nav

```js
APP_PORT =8000

MYSQL_HOST =localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PWD=root
MYSQL_DB=zdsc
```

# 八，创建User模型

## 1，拆分Model层

创建src/model/user.model.js

```js
const { DataTypes } = require('sequelize');

const seq = require('../db/seq');


//创建模型(Model zd_user ->zd_users)
const User = seq.define('zd_user', {
    // id会被sequelize自动创建，管理
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '用户名，唯一',
    },
    password: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        comment: '密码'
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment:'是否为管理员,0:不是管理员(默认);1:是管理员',
    }
})
//强制同步数据库(创建数据表)
// User.sync({force:true})

module.exports=User;
```

# 九，添加用户入库

```js
const User=require('../model/user.model')
class UserService{
    async createUser(user_name,password){
        //插入数据
        // const res= User.create({
        //     //表的字段
        //     user_name:user_name,
        //     password:password
        // })
        // console.log(res);
        //await 表达式：promise对象的值
       const res= await User.create({user_name,password})
    //    console.log(res);


       return res.dataValues;
    }
}

module.exports=new UserService();
```

# 十，错误处理

在控制器中，对不同的错误进行处理，返回不同的提示错误提示，提高代码质量

```js
const {createUser,getUserInfo}=require('../service/user.service')
class UserController{
    async register(ctx,next){
        // 获取数据
        // console.log(ctx.request.body);
        const {user_name,password}=ctx.request.body;
        //合法性
        if(!user_name||!password){
            console.error('用户名或密码为空',ctx.request.body)
            ctx.status=400;
            ctx.body={
                code:'10001',
                message:'用户名或密码为空',
                result:'',
            }
            return;
        }
        //合理性
        if(getUserInfo(user_name)){
            ctx.status=409;
            ctx.body={
                code:'10002',
                message:'用户已经存在',
                result:'',
            }
            return;
        }
        //操作数据库
        const res=await createUser(user_name,password);
        console.log(res);
        //返回结果
        ctx.body={
            code:0,
            message:'用户注册成功',
            result:{
                id:res.id,
                user_name:res.user_name,
            }
        };
    }
    async login(ctx,next){
        ctx.body='登录成功'
    }
}

module.exports=new UserController();
```

在service中封装函数

```js
const User=require('../model/user.model')
class UserService{
    async createUser(user_name,password){
        //插入数据
        //await 表达式：promise对象的值
       const res= await User.create({user_name,password})
    //    console.log(res);


       return res.dataValues;
    }

    async getUserInfo({id,user_name,password,is_admin}){
        const whereOpt={}

        id&&Object.assign(whereOpt,{id})
        user_name&&Object.assign(whereOpt,{user_name})
        password&&Object.assign(whereOpt,{password})
        is_admin&&Object.assign(whereOpt,{is_admin})

        const res=await User.findOne({
            attributes:['id','user_name','password','is_admin'],
            where:whereOpt,
        })

        return res?res.dataValues:null;
    }
}

module.exports=new UserService();
```

# 十一，拆分中间件

为了使代码的逻辑更加清晰，我们可以拆分一个中间件层，封装多个中间件函数

![](C:\Users\86184\Desktop\Snipaste_2022-12-15_02-13-03.png)

## 1，拆分中间件

添加src/middleware/user.middleware.js

```js
const {getUserInfo}=require('../service/user.service')
const {userFormateError,userAlreadyExited,userRegisterError}=require('../constant/err.type')
const useValidator=async(ctx,next)=>{
    const {user_name,password}=ctx.request.body;
    //合法性
    if(!user_name||!password){
        console.error('用户名或密码为空',ctx.request.body)
        ctx.app.emit('error',userFormateError,ctx);
        return;
    }
    await next();
}
const verifyUser=async(ctx,next)=>{
    const {user_name,password}=ctx.request.body;
    //合理性
    // if(await getUserInfo(user_name)){
    //     ctx.app.emit('error',userAlreadyExited,ctx);
    //     return;
    // }
    try {
        const res=await getUserInfo({user_name});
        if(res){
            console.error('用户名已经存在', {user_name});
            ctx.app.emit('error',userAlreadyExited,ctx);
            return;
        }
    } catch (err) {
        console.error('获取用户信息错误', err);
        ctx.app.emit('error',userRegisterError,ctx);
        return;
    }
    await next();
}
module.exports={
    useValidator,
    verifyUser
}
```

## 2，拆分中间件

  ·在出错的地方使用ctx.app.emit提交错误

  ·在app中通过app.on监听

编写统一的错误定义文件

src/constant/err.type.js

```js
module.exports={
    userFormateError:{
        code:'10001',
        message:'用户名或密码为空',
        result:''
    },
    userAlreadyExited:{
        code:'10002',
        message:'用户已经存在',
        result:''
    },
    userRegisterError:{
        code:'10003',
        message:'用户注册错误',
        result:''
    }
}
```

## 3，错误处理函数

```js
module.exports=(err,ctx)=>{
    let status=500;
    switch(err.code){
        case '10001':
          status=400
          break
        case '10002':
          status=400
          break
        default:
          status=500
    }
    ctx.status=status
    ctx.body=err;
}
```

改写app/index.js

```js
const errHandler=require('./errHandler')
//进行统一的错误处理
app.on('error',errHandler)
```

# 十二，加密

在将密码保存到数据库之前，要对密码进行加密处理

123123abc(加盐)加盐加密

## 1，安装bcryptjs

    npm i bcryptjs

## 2，编写加密中间件

```js
const crpyPassword=async(ctx,next)=>{
    const {password}=ctx.request.body;
    const salt = bcrypt.genSaltSync(10);  //加盐
    //hash保存的使 密文
    const hash = bcrypt.hashSync(password, salt);

    ctx.request.body.password=hash;

    await next();
}
module.exports={
    useValidator,
    verifyUser,
    crpyPassword
}
```

## 3，在router中使用

```js
const Router=require('koa-router');

const {useValidator,verifyUser,crpyPassword}=require('../middleware/user.middleware')
const {register,login}=require('../controller/user.controller')

const router=new Router({prefix:'/users'});

//注册接口
router.post('/register',useValidator,verifyUser,crpyPassword,register)
//登录接口
router.post('/login',login);

module.exports=router;
```

# 十三，用户登录验证

1，判断用户是否存在2，密码是否匹配

src/constant/err.type.js

```js
module.exports={
    userFormateError:{
        code:'10001',
        message:'用户名或密码为空',
        result:''
    },
    userAlreadyExited:{
        code:'10002',
        message:'用户已经存在',
        result:''
    },
    userRegisterError:{
        code:'10003',
        message:'用户注册错误',
        result:''
    },
    userDoesNotExist:{
        code:'10004',
        message:'用户不存在',
        result:''
    },
    useLoginError:{
        code:'10005',
        message:'用户登录失败',
        result:''
    },
    invalidPassword:{
        code:'10006',
        message:'密码不匹配',
        result:''
    }
}
```

中间件

```js
const verifyLogin = async (ctx, next) => {
    //1，判断用户是否存在(不存在：报错)
    const { user_name, password } = ctx.request.body;

    try {
        const res = await getUserInfo({ user_name });

        if (!res) {
            console.error('用户名不存在', { user_name });
            ctx.app.emit('error', userDoesNotExist, ctx);
            return;
        }
        //2，密码是否匹配(不匹配：报错)
        if (!bcrypt.compareSync(password, res.password)) {
            ctx.app.emit('error', invalidPassword, ctx);
            return;
        }
    } catch (err) {
        console.error(err);
        ctx.app.emit('error', useLoginError, ctx);
        return;
    }

    await next();
}
```

改写路由

```js
//登录接口
router.post('/login',useValidator,verifyLogin,login);
```

# 十四，用户的认证与授权

登录成功后，给用户颁发一个令牌token，用户在以后的每一次请求中携带这个令牌

jwt: jsonwebtoken

 ·header:头部

·payload:载荷

·signature:签名

1，安装jsonwentoken

    npm i jsonwebtoken

控制器

```js
 async login(ctx, next) {
        const { user_name }=ctx.request.body;

        // 1，获取用户信息(在token的payload,记录id,user_name,is_admin)
        try {
            // 从返回结果对象中剔除password属性，将剩下的属性放到res新的对象
            const {password,...res}= await getUserInfo({user_name});

            ctx.body={
                code:0,
                message:'用户登录成功',
                result:{
                    token:jwt.sign(res,JWT_SECRET,{expiresIn:'1d'}),
                }
            }
        } catch (err) {
            console.error('用户登录失败',err);
        }
    }
```

# 十五，修改密码跑通

src/middleware/auth.middleware.js

遇到的bug,注意

    const token = authorization.replace('Bearer ', '');不要写成const token = authorization.replace('Bearer', '');

```js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.default')

const { tokenExpiredError, invalidToken } = require('../constant/err.type')
const auth = async (ctx, next) => {
    const { authorization } = ctx.request.header;
    const token = authorization.replace('Bearer ', '');
    console.log(token);

    try {
        // user中包含了payload的信息(id,user_name,is_admin)
        const user = jwt.verify(token, JWT_SECRET);
        ctx.state.user = user;
    } catch (err) {
        switch (err.name) {
            case 'TokenExpiredError':
                console.error('token已过期', err);
                ctx.app.emit('error', tokenExpiredError, ctx);
                return;
            case 'JsonWebTokenError':
                console.error('无效的token', err);
                ctx.app.emit('error', invalidToken, ctx);
                return
        }
    }
    await next();
}

module.exports = {
    auth
}
```

service层

```js
async updateById({id,user_name,password,is_admin}){
        const whereOpt={id};
        const newUser={};

        user_name&&Object.assign(newUser,{user_name});
        password&&Object.assign(newUser,{password});
        is_admin&&Object.assign(newUser,{is_admin});

        const res=await User.update(newUser,{where:whereOpt});
        // console.log(res);
        return res[0]>0?true:false;
    }
```

controller层

```js
async changePassword(ctx,next){
        //1，获取数据
        const id=ctx.state.user.id;
        const password=ctx.request.body.password;
        // console.log(id,password);
        //2，操作数据库
        if(await updateById({id,password})){
            ctx.body={
                code:0,
                message:'修改密码成功',
                result:''
            }
        }else{
            ctx.body={
                code:'10007',
                message:'修改密码失败',
                result:''
            }
        }
        //3，返回结果
    }
```

路由

```js
//修改密码接口
router.patch('/', auth, crpyPassword,changePassword);
```

# 十六，路由文件实现自动加载

需要加其他路由直接在router里加文件就可以

读取当前文件下所有的路由文件脚本

## 1,在router下创建index.js

```js
const fs=require('fs');

const Router=require('koa-router');
const router=new Router();

fs.readdirSync(__dirname).forEach(file=>{
    // console.log(file);
    if(file!=='index.js'){
       let r= require('./'+file)
       router.use(r.routes())
    }
})

module.exports=router;
```

## 2,更改app/index.js里面代码

```js
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
```

# 十七，封装管理员权限

1，判断是否登录2，判断是否有管理员权限

中间件层

```js
const hasAdminPermission=async(ctx,next)=>{
    const {is_admin}=ctx.state.user;

    if(!is_admin){
        console.error('该用户没有管理员的权限',ctx.state.user);
        return ctx.app.emit('error',hasNotAdminPermission,ctx);
    }
    await next();
}

module.exports = {
    auth,
    hasAdminPermission
}
```

错误处理

```js
hasNotAdminPermission:{
        code:'10103',
        message:'没有管理员权限',
        result:''
    }
```

路由router/goods.route.js

```js
//上传图片
router.post('/upload', auth, hasAdminPermission, upload);
```

# 十八，商品图片上传

## 1，文件上传

1，前端选择一个文件发送请求

2，后端把文件读取出来复制到对应的文件目录下面，然后给前端返回

### 1,路由层src/router/goods.route.js

```js
const Router=require('koa-router');

const { auth ,hasAdminPermission}=require('../middleware/auth.middleware');

const { upload }=require('../controller/goods.controller')

const router=new Router({prefix:'/goods'});

//上传图片
router.post('/upload', auth, hasAdminPermission, upload);

module.exports=router;
```

### 2,app/index.js中koa-body配置以及静态资源配置

```js
const KoaStatic = require('koa-static');
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
```

### 3，控制层src/controller/goods.controller.js

```js
const path=require('path');

const {fileUploadError}=require('../constant/err.type')
class GoodsController{
    async upload(ctx,next){
        // console.log(ctx.request.files.file);
        const {file}=ctx.request.files;
        if(file){
            ctx.body={
                code:0,
                message:'商品图片上传成功',
                result:{
                    goods_img:path.basename(file.filepath)
                }
            }
        }else{
           return ctx.app.emit('error',fileUploadError,ctx)
        }
    }
}


module.exports=new GoodsController();
```

# 十九，上传图片类型判断

goods控制层

```js
