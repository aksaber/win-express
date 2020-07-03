const express = require('express');
const router = express.Router();
const db = require('../db');
const Unity = require('../unity');

let path = require('path');
let formidable = require('formidable');
fs = require('fs');

router.post('/', (req, res, next) => {
    
    const {
        title,
        author,
        date,
        tag,
        type,
        audio,
        content,
        coverImage
    } = req.body;
    // 添加博文
    const sql = `INSERT INTO fengshui(title, author, date, tag, content, coverImage, type, audio) VALUES('${title}', '${author}', '${date}', '${tag}', '${content}', '${coverImage}', '${type}', '${audio}')`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, 'success'));
        }
    })

});

// 博客列表 (@params ?type= )
router.get('/list', (req, res, next) => {

    let sql = null;
    if (req.query.type) {
        sql = `SELECT * FROM fengshui where type=${req.query.type}`;
    } else {
        sql = `SELECT * FROM fengshui`;
    }

    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'));
        } else {
            rows = rows.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    author: item.author,
                    date: item.date,
                    content: item.content,
                    coverImage: item.coverImage,
                    abstract: item.abstract,
                    type: item.type,
                    audio: item.audio,
                    tag: item.tag.split(',')
                }
            })
            res.send(Unity.send(200, 0, rows));
        }
    })

})

// 删除博客
router.post('/delBlog', (req, res, next) => {

    const sql = `DELETE from fengshui where id = '${req.body.id}'`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, 'success'));
        }
    })
})

// 获取博客分类
router.get('/getBlogType', (req, res, next) => {

    const sql = 'SELECT * FROM fengshui_type';
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, rows));
        }
    })
})

// 新增博客分类
router.post('/addBlogType', (req, res, next) => {

    const sql = `INSERT INTO fengshui_type(name) VALUE('${req.body.type}')`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, 'success'));
        }
    })

})

// 删除博客分类
router.post('/delBlogType', (req, res, next) => {

    const sql = `DELETE from fengshui_type where id = '${req.body.id}'`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, 'success'));
        }
    })
})


/**
 * 博客详情
 * @param = id
 */
router.get('/detail', (req, res, next) => {

    const sql = `SELECT * FROM fengshui WHERE id = '${req.query.id}'`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'));
        } else {
            rows = rows.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    author: item.author,
                    date: item.date,
                    content: item.content,
                    coverImage: item.coverImage,
                    abstract: item.abstract,
                    type: item.type,
                    audio: item.audio,
                    tag: item.tag.split(',')
                }
            })
            res.send(Unity.send(200, 0, rows));
        }
    })

})

// 上传图片
router.post('/upload', (req, res) => {
    let form = new formidable.IncomingForm();
    // form.encoding = 'utf-8';
    // 保留扩展名
    form.keepExtensions = true;
    // 文件存储路径，最后要加 '/' 否则会被存在public下
    // form.uploadDir = path.join(__dirname, '../public/images/');
    form.uploadDir = '/var/www/fsnode/static/source/';
    // 解析 formData 数据
    form.parse(req, (err, fields, files) => {
        if (err) return next(err);
        // console.log(files.file, 'files');
        // let imgPath = files.file.path;
        // let imgName = files.file.name;
        // console.log(imgName, imgPath);
        // 返回路径和文件名
        res.json({
            code: 1,
            data: {
                name: files.file.name,
                path: files.file.path
            }
        });
    })
})

module.exports = router;