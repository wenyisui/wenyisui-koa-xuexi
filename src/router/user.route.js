const Router = require('koa-router');

const { useValidator, verifyUser, crpyPassword, verifyLogin } = require('../middleware/user.middleware')
const { auth }=require('../middleware/auth.middleware')
const { register, login ,changePassword} = require('../controller/user.controller')

const router = new Router({ prefix: '/users' });

//注册接口
router.post('/register', useValidator, verifyUser, crpyPassword, register)
//登录接口
router.post('/login', useValidator, verifyLogin, login);
//修改密码接口
router.patch('/', auth, crpyPassword,changePassword);

module.exports = router;
