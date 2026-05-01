module.exports = (app) => {
    return class ViewController {
        async renderPage(ctx) {
            const page = ctx.params.page;
            console.log('当前请求路径:', ctx.path);
            console.log('要渲染的模板:', `output/entry.${page}`);

            try {
                await ctx.render(`output/entry.${page}`);
            } catch (err) {
                console.error('模板渲染错误:', err);
                ctx.status = 500;
                ctx.body = `模板渲染失败：${err.message}`;
            }
        }
    }
}