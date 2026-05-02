module.exports = (app) => {
    const rawEnv = process.env._ENV;
    // 去掉所有单/双引号、前后空格
    const cleanEnv = (rawEnv || '').replace(/['"]/g, '').trim();
    return {
        // 是否本地环境
        isLocal() {
            return cleanEnv === 'local';
        },
        // 是否测试环境
        isBeta() {
            return cleanEnv === 'beta';
        },
        // 是否生产环境
        isProduction() {
            return cleanEnv === 'production';
        },
        // 获取当前环境
        get() {
            return cleanEnv ?? 'local';
        }
    }
}