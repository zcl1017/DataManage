module.exports = (app) => {
    const BaseController = require('./base')(app);
    return class ProjectController extends BaseController {
        /**
         * 获取所有模型鱼项目的结构化数据
         */
        async getModelList(ctx) {
            const modelList = await app.service.project.getModelList();

            // 构造返回结果，只返回关键数据
            const dtoModelList = modelList.reduce((preList, item) => {
                const { model, project } = item;

                // 构造 model 关键数据
                const { key, name, desc } = model;
                const dtoModel = { key, name, desc };

                // 构造 project 关键数据
                const dtoProject = Object.keys(project).reduce((preObj, projKey) => {
                    const { key, name, desc, homePage } = project[projKey];
                    preObj[projKey] = { key, name, desc, homePage };
                    return preObj;
                }, {});

                // 整合返回结构
                preList.push({
                    model: dtoModel,
                    project: dtoProject
                });
                return preList;
            }, []);

            this.success(ctx, dtoModelList);
        }
    }
}