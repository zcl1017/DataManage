const assert = require('assert');
const supertest = require('supertest');
const md5 = require('md5');
const elpisCore = require('../../elpis-core');

const signKey = 'klx05hb3n1c9ujp8uhxbs2ikkiowp212';
const st = Date.now();

describe('测试 project 相关接口', function () {
    this.timeout(60000);

    let request;

    it('启动服务', async () => {
        const app = await elpisCore.start();
        request = supertest(app.listen());
    });

    it('GET /api/project/model_list', async () => {
        let tmpRequest = request.get('/api/project/model_list');
        tmpRequest = tmpRequest.set('s_t', st);
        tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));
        const res = await tmpRequest;
        // 用来设置成功还是失败
        assert(res.body.success === true);
        console.log(JSON.stringify(res.body));
        const resData = res.body.data;
        assert(resData.length > 0);
        for (let i = 0; i < resData.length; ++i) {
            const item = resData[i];
            assert(item.model);
            assert(item.model.key);
            assert(item.model.name);
            assert(item.project);
            for (const projKey in item.project) {
                assert(item.project[projKey].key);
                assert(item.project[projKey].name);
            }
        }
        console.log(res.body);
    });
});