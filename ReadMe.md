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

    npm i nodemon

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

    
