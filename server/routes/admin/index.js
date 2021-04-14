

// 通用CURD
module.exports = app => {
    const express = require('express');
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')
    const AdminUser = require(`../../models/AdminUser`)
    const router = express.Router({
        mergeParams: true
    });

    // 登录校验中间件
    const authMiddleware = require('../../middleware/auth')

    // 解析URL，自动查询模型中间件
    const resourceMiddleware = require('../../middleware/resource')

    app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)

    // 命名规范
    // 模型用大写首字母命名

    // 创建
    router.post('', async (req, res) => {
        const model = await req.Model.create(req.body)
        res.send(model)
    })
    
    // 更新
    router.put('/:id', async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    // 删除
    router.delete('/:id', async (req, res) => {
        const model = await req.Model.findByIdAndDelete(req.params.id)
        res.send({
            success: true,
        })
    })

    // 资源列表
    router.get('', async (req, res) => {
        const queryOptions = {}
        if (req.Model.modelName === 'Category') { //modelName 是Model的一个属性
            queryOptions.populate = 'parent'
        };
        const items = await req.Model.find().populate('parent').limit(10)
        res.send(items)
    })

    // 资源详情
    router.get('/:id', async (req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    // 资源上传
    const multer = require('multer')
    const upload = multer({ dest: __dirname + '/../../uploads' })
    app.post('/admin/api/upload',
        authMiddleware(), //加上中间以后会提示“请先登录”
        // 图片上传和显示那两个接口都是原生的ajax请求
        // 可以试试element-ui中上传组件有一个http-request可以代替原生
        upload.single('file'),
        async (req, res) => {
            const file = req.file
            file.url = `http://localhost:3000/uploads/${file.filename}`
            res.send(file)
        })

    // 登陆验证
    app.post('/admin/api/login', async (req, res, next) => {
        const { username, password } = req.body;
        // 1.根据用户名找用户
        const user = await AdminUser.findOne({ username }).select('+password')
        assert(user, 422, '用户不存在') 
        // 2.校验密码
        const isValid = require('bcrypt').compareSync(password, user.password)
        assert(isValid, 422, '密码错误')
        // 3.返回token
        const token = jwt.sign({
            _id: user._id,
            // username: user.username,
        }, app.get('secret'))
        res.send({ token })
    })

    // 查询用户信息
    // 这里就先不要用rest风格的接口了
    app.post('/admin/api/userinfo',async (req, res, next) =>{
        const token = String(req.headers.authorization || '').split(' ').pop();
        const { _id } = jwt.verify(token, req.app.get('secret'))
        // 根据用户名找用户
        const user = await AdminUser.findById(_id)
        res.send(user);

    })


    // 错误处理函数
    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}