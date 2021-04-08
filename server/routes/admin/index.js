module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const Category = require('../../models/Category')

    // 创建
    router.post('/categories', async (req, res) => {
        const model = await Category.create(req.body)
        res.send(model)
    })
    //更新
    router.put('/categories/:id', async (req, res) => {
        const model = await Category.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })
    // 删除
    router.delete('/categories/:id', async (req, res) => {
        const model = await Category.findByIdAndDelete(req.params.id)
        res.send({
            success:true,
        })
    })

    router.get('/categories', async (req, res) => {
        const items = await Category.find().populate('parent').limit(10)
        res.send(items)
    })
    
    router.get('/categories/:id', async (req, res) => {
        const model = await Category.findById(req.params.id)
        res.send(model)
    })


    app.use('/admin/api', router)
}