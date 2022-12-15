const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.default')

const { tokenExpiredError, invalidToken } = require('../constant/err.type')
const auth = async (ctx, next) => {
    const { authorization } = ctx.request.header;
    const token = authorization.replace('Bearer ', '');
    // console.log(token);

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