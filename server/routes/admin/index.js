// 通用CURD
module.exports = app => {
    const express = require('express');
    const router = express.Router({
        mergeParams: true
    });
    

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
            success:true,
        })
    })

    // 查询list
    router.get('', async (req, res) => {
        const queryOptions = {}
        if(req.Model.modelName === 'Category'){ //modelName 是Model的一个属性
            queryOptions.populate = 'parent'
        };
        const items = await req.Model.find().populate('parent').limit(10)
        res.send(items)
    })
    
    router.get('/:id', async (req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })


    app.use('/admin/api/rest/:resource', async (req, res, next) =>{
        const modelName = require('inflection').classify(req.params.resource)
        req.Model = require(`../../models/${modelName}`)
        next()
    }, router)
}