
import {
    getToken,
    removeToken,
    setToken
} from '@/utils/auth'

import {
    checkObjectString
} from '@/utils/index'


import Fly from 'flyio/dist/npm/wx';

// 常见的http状态码信息
let httpCode = {
    400: '请求参数错误',
    401: '权限不足, 请重新登录',
    403: '服务器拒绝本次访问',
    404: '请求资源未找到',
    500: '内部服务器错误',
    501: '服务器不支持该请求中使用的方法',
    502: '网关错误'
}

// 引入 fly
const fly = new Fly();

// 设置请求基地址
fly.config.baseURL = process.env.VUE_APP_SERVE_URL
// 设置超时时间
fly.config.timout = 25000


// 请求拦截
fly.interceptors.request.use(request => {
    // 添加编码
    request.headers['content-type'] = 'application/json;charset=UTF-8'
    // 获取token,放入头中
    let token = getToken()
    if (token) {
        request.headers['Authorization'] = `Bearer ${token}`;
    } else {

    }
    return request;
},
    error => {
        return Promise.reject(error);
    });

// 响应拦截
fly.interceptors.response.use(
    response => {
        const res = response.data;

        if (res.code != 0) {
            const message = res.msg ? res.msg : "服务器错误";
            uni.showToast(message);
            return Promise.reject(new Error(message || "Error"));
        } else {
            return res && res.data ? res.data : res;
        }
    },
    error => {
        const data = {
            error
        };
        const value = checkObjectString(data, "error.response.data.error.message");
        const message = value ? value : data.error.message;

        //请求超时
        if (data.error.code === "ECONNABORTED") {
            uni.showToast("请求超时了！请联系管理员");
            return Promise.reject(error);
        }
        // 判断有返回才继续检测错误
        if (data.error.response) {
            switch (data.error.response.status) {
                case 401:
                    removeToken()
                    uni.redirectTo({
                        url: `/pages/login/index`,
                    })
                    uni.showToast("用户未登录");
                    break;
                case 404:
                    uni.showToast("暂无该接口，请查看");
                    break;

                default:
                    uni.showToast(message);
                    break;
            }
        } else {
            uni.showToast(message);
        }
        return Promise.reject(error);
    }
)

export default fly