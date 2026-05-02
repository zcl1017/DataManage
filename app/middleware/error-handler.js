/* 
* 运行异常错误处理， 兜底所有异常
* @params {[object]} app koa 实例
*/
module.exports = (app) => {
    // next代表下一个流转传入方法 可供下层
    return async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            // 处理异常
            const { status, message, detail } = error;
            app.logger.info(JSON.stringify(error));
            app.logger.error('[-- exception --]:', error);
            app.logger.error('[-- exception --]:', status, message, detail);

            if (message && message.indexOf('template not found') > -1) {
                // 临时重定向 等后面这个页面存在时 可以跳转到正确页面上
                ctx.status = 302;
                ctx.redirect(`${app.options?.homePage}`);
                return;

            }
            const resBody = {
                success: false,
                code: 50000,
                message: '网路异常， 请稍后重试！'
            }
            ctx.status = 200;
            ctx.body = resBody;
        }
    }
}