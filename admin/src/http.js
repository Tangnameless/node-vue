import axios from 'axios'
import Vue from 'vue'
import router from './router/index'


const http = axios.create({
    baseURL: 'http://localhost:3000/admin/api'
})


// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if (localStorage.token) {
        config.headers.Authorization = 'Bearer ' + localStorage.token;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 全局捕获错误
// 使用axios 拦截器
http.interceptors.response.use(res => {
    return res
  }, err => {
    if (err.response.data.message) {
      Vue.prototype.$message({
        type: 'error',
        message: err.response.data.message
      })
      
      if (err.response.status === 401) {
        router.push('/login')
      }
    }
    return Promise.reject(err)
  })



export default http