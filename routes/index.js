var express = require('express');
var router = express.Router();
var db = require('../db');
const Unity = require('../unity');

router.get('/', function(req, res, next) {

    db.query('SELECT * FROM demo', (err, rows) => {
        if (err) {
            res.send({
                code: 1,
                msg: '请求数据库错误',
                data: 'error'
            })
            res.send(Unity.send(200, 1, 'error'))
        } else {
            res.send(Unity.send(200, 0, rows));
        }
    })

});

module.exports = router;
