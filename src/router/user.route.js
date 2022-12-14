const Router=require('koa-router');

const router=new Router({prefix:'/users'});



// GET /users/
router.get('/',(ctx,body)=>{
    ctx.body='hello users'
})


module.exports=router;
