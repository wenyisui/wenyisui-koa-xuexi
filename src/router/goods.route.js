const Router=require('koa-router');

const { auth ,hasAdminPermission}=require('../middleware/auth.middleware');

const { upload }=require('../controller/goods.controller')

const router=new Router({prefix:'/goods'});

//上传图片
router.post('/upload', auth, hasAdminPermission, upload);

module.exports=router;