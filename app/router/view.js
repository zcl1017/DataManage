module.exports = (app, router) => {
    const { view: ViewController } = app.controller;
    // 用户输入 heep://ip:port/view/xxx 能渲染出对应页面
    console.log(ViewController.renderPage, 'ViewController');
    router.get('/view/:page', ViewController.renderPage.bind(ViewController))
}