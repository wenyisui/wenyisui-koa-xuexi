一，项目的初始化

   1，npm的初始化

     npm init -y

生成package.json文件

   :记录项目的依赖

2，git初始化

    git init

生成'.git'隐藏文件夹，git本地仓库

3，创建readMe文件

二.搭建项目

 1，安装koa框架

    npm install koa

2，编写最基础的app

 创建src/main.js

    const Koa=require('koa');
    
    const app=new Koa();
    
    app.use((ctx,next)=>{   //中间件
       ctx.body='hello world'
    })
    
    app.listen(3000,()=>{
        console.log('server is running on http://localhost:3000');
    })

3，测试

在终端，使用node src/main.js
