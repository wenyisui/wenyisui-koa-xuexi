const Router = require('koa-router');

const { useValidator, verifyUser, crpyPassword, verifyLogin } = require('../middleware/user.middleware')
const { auth }=require('../middleware/auth.middleware')
const { register, login } = require('../controller/user.controller')

const router = new Router({ prefix: '/users' });

//注册接口
router.post('/register', useValidator, verifyUser, crpyPassword, register)
//登录接口
router.post('/login', useValidator, verifyLogin, login);
//修改密码接口
router.patch('/',auth, (ctx, next) => {
   console.log(ctx.state.user);
   ctx.body = '修改密码成功'
})

module.exports = router;
