const express = require('express');
const router = express.Router();
const db = require('../db');
const Unity = require('../unity');

router.post('/', (req, res, next) => {
    
    const { p1, p2, p3, p4 } = req.body;
    // 添加博文
    const sql = `INSERT INTO employee(p1, p2, p3, p4) VALUES('${p1}', '${p2}', '${p3}', '${p4}')`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send({
                code: 1,
                msg: err,
                data: '添加错误'
            })
            res.send(Unity.send(200, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, 'success'));
        }
    })

});

router.get('/get', (req, res, next) => {

    const sql = `SELECT * FROM employee WHERE p1='1'`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send({
                code: 1,
                msg: err,
                data: '查询错误'
            })
            res.send(Unity.send(200, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, rows));
        }
    })

})

module.exports = router;