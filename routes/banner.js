const express = require('express');
const router = express.Router();
const db = require('../db');
const Unity = require('../Unity');

const request = require('request');
const iconv = require('iconv-lite');

router.post('/add', (req, res, next) => {

    // 添加banner图
    const sql = `INSERT INTO fengshui_banner(url, uid) VALUE('${req.body.url}', '${req.body.uid}')`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(200, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, 'success'));
        }
    })

})

// banner轮播图列表
router.get('/get', (req, res, next) => {

    // 获取banner图
    const sql = 'SELECT * FROM fengshui_banner';
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(200, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, rows))
        }
    })

})

// 请求排盘api
router.post('/paipan', (req, res, next) => {

    let ju = escape('拆补局');
    let D1 = escape('北京');
    let button1 = escape('排盘');
    let data = `years=2019&months=4&days=23&hours=14&mins=3&miao=13&ju=${ju}&R1=V1&D1=${D1}&T1=120&button1=${button1}`;
    // let data2 = 'years=1995&months=5&days=29&hours=1&mins=0&miao=0&ju=%B2%F0%B2%B9%BE%D6&R1=V1&D1=%C9%EE%DB%DA&T1=120&button1=%C5%C5%C5%CC'

    request({
        url: 'https://www.china95.net/paipan/qimen_show.asp',
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        encoding: null,  //让body直接是buffer
        body: data
    }, (err, res2, body) => {
        const buf = iconv.decode(body, 'gb2312');
        const reg = /公元.*十干克应/
        let bodys = buf.match(reg);
        // bodys = bodys[0].replace(/<\/font>　<font/g, '</font>&nbsp;<font');
        res.send(Unity.send(200, 1, bodys));
    })

})

module.exports = router;