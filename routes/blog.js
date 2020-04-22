const express = require('express');
const router = express.Router();
const db = require('../db');
const Unity = require('../unity');

router.post('/', (req, res, next) => {
    
    const {
        title,
        author,
        date,
        tag,
        content,
        abstract,
        coverImage
    } = req.body;
    // 添加博文
    const sql = `INSERT INTO fengshui(title, author, date, tag, content, abstract, coverImage) VALUES('${title}', '${author}', '${date}', '${tag}', '${content}', '${abstract}', '${coverImage}')`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(200, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, 'success'));
        }
    })

});

// 博客列表
router.get('/list', (req, res, next) => {

    const sql = `SELECT * FROM fengshui`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(200, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, rows));
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
            res.send(Unity.send(200, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, rows));
        }
    })

})

module.exports = router;