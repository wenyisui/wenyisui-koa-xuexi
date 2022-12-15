const path=require('path');

const {fileUploadError, unSupportedFileType}=require('../constant/err.type')
class GoodsController{
    async upload(ctx,next){
        // console.log(ctx.request.files.file);
        const {file}=ctx.request.files;
        const fileTypes=['image/jepg','image/png'] //图片类型判断，虽然返回了类型错误但是图片还是上传了
        if(file){
            if(!fileTypes.includes(file.mimetype)){
                return ctx.app.emit('error',unSupportedFileType,ctx)
            }
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