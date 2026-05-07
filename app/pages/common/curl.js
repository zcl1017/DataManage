const md5 = require('md5');
import { ElMessage } from 'element-plus';
import axios from 'axios';
/* 
* 前端封装的curl方法
* @params options 请求参数
*/

const curl = ({
    url,
    method = 'post', // 请求方式
    query = {}, // 请求参数
    data = {},
    responseType = 'json', // responseType
    timeout = 6000, // timeout
    errorMessage = '网络异常',
    headers = {}
}) => {
    const signKey = 'vsivbguiagbcua';
    const st = Date.now();
    // 构造请求参数 (把参数转为axios 参数)
    const ajaxStting = {
        url,
        method, // 请求方式
        params: query, // 请求参数
        data,
        responseType, // responseType
        timeout,
        errorMessage,
        headers: {
            ...headers,
            s_t: st,
            s_sign: md5(`${signKey}_${st}`)
        }
    }

    return axios.request(ajaxStting).then((response) => {
        const resData = response.data || {};
        // 后端返回的api格式
        const { success } = resData;
        // 失败
        if (!success) {
            const { message, code } = resData;
            if (code === 442) {
                ElMessage.error('请求参数异常');
            } else if (code === 445) {
                ElMessage.error('请求不合理');
            } else if (code === 50000) {
                ElMessage.error(message);
            } else {
                ElMessage.error(errorMessage);

            }
            return Promise.resolve({ success, code, message })
        }

        const { data, metadata } = resData;
        return Promise.resolve({ success, data, metadata })
    }).catch((error) => {
        const { message } = error;
        if (message.match(/timeout/)) {
            return Promise.resolve({
                message: 'Request Timeout',
                code: 504
            })
        }

        return Promise.resolve(error);
    })
}

export default curl;