const md5 = require('md5');
/* 
* API合法签名
* 
*/
module.exports = (app) => {
    return async (ctx, next) => {
        // 只对api请求做校验 对页面请求不做处理 类似 api/page1这种
        if (ctx.path.indexOf('/api') < 0) {
            return await next();
        }

        const { path, method } = ctx;
        const { headers } = ctx.request;
        const { s_sign: sSign, s_t: st } = headers;

        const signKey = 'vsivbguiagbcua';
        const signature = md5(`${signKey}_${st}`);
        app.logger.info(`[${method} ${path}] signature: ${signature}`);

        if (!sSign || !st || signature !== sSign.toLowerCase() || Date.now() - Number(st) > 600000) {
            ctx.status = 200;
            ctx.body = {
                success: false,
                message: 'signature not correct or time out',
                code: 445
            }
            return;
        }
        await next();
    }
}