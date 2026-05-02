module.exports = (app, router) => {
    const { project: projectController } = app.controller;
    // 用户输入 heep://ip:port/view/xxx 能渲染出对应页面
    router.get('/api/project/list', projectController.getList.bind(projectController));
}