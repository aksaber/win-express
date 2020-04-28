var express = require('express');
var router = express.Router();
var db = require('../db');
const Unity = require('../unity');
var WechatAppletPay = require('../wxpay');

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

router.get('/wxpay', function(req, res, next) {
    
    // 微信支付
    // const userInfo = req.body;
    const userInfo = {
        bookid: '老脑充值',
        notify_url: 'http://www.weixin.qq.com/wxpay/pay.php',
        spbill_create_ip: '183.14.28.100',
        total_fee: 2,
        openid: 'oUpF8uMuAJO_M2pxb1Q9zNjWeS6o'
    }
    console.log(WechatAppletPay, 'WechatAppletPay')
    var WechatAppletPays = new WechatAppletPay(userInfo);
    WechatAppletPays.getBrandWCPayParams(userInfo, (data) => {
        console.log(data);
    })

})

module.exports = router;
