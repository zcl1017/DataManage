module.exports = (app) => {
    const BaseService = require('./base')(app);
    const modelList = require('../../model/index.js')(app);
    return class ProjectService extends BaseService {
        /* 
        * 获取所有模型的结构化数据
        */
        async getModelList(ctx) {
            return modelList;
        }
    }
}