var queryString = require('querystring');
var crypto = require('crypto');
var request = require('request');
var uuid = require('uuid');
const md5 = require('blueimp-md5')
var xml2jsparseString = require('xml2js').parseString;

// 引入项目的配置信息
const CONFIG = require('./wxConfig');
var config = CONFIG.app_info;

// wechat 支付类
class WechatAppletPay {

    constructor(userInfo) {
        this.userInfo = userInfo;
        this.order_id = '';
    }

    // 获取微信统一下单参数
    getUnifiedorderXmlParams(obj) {
        var body = '<xml> ' + 
            '<appid>' + config.appid + '</appid> ' +
            '<body>' + obj.body + '</body> ' +
            '<mch_id>' + config.mch_id + '</mch_id> ' +
            '<nonce_str>' + obj.nonce_str + '</nonce_str> ' +
            '<notify_url>' + obj.notify_url + '</notify_url> ' +
            '<openid>' + obj.openid + '</openid> ' +
            '<out_trade_no>' + obj.out_trade_no + '</out_trade_no> ' +
            '<spbill_create_ip>' + obj.spbill_create_ip + '</spbill_create_ip> ' +
            '<total_fee>' + obj.total_fee + '</total_fee> ' +
            '<trade_type>' + obj.trade_type + '</trade_type> ' +
            '<sign>' + obj.sign + '</sign> ' +
            '</xml>';
        return body;
    }

    // 获取微信统一下单的接口数据
    getPrepayId(obj) {
        let that = this;
        // 生成统一下单接口参数
        let UnifiedorderParams = {
            appid: config.appid,
            body: obj.bookid,
            mch_id: config.mch_id,
            nonce_str: this.createNonceStr(),
            notify_url: obj.notify_url,  // 微信付款后的回调地址
            // openid: this.userInfo.openid,
            openid: obj.openid,
            out_trade_no: uuid.v4().replace(/-/g, ''),  // new Date().getTime() 订单号
            spbill_create_ip: obj.spbill_create_ip,
            total_fee: obj.total_fee,
            trade_type: 'JSAPI'
        };
        that.order_id = UnifiedorderParams.out_trade_no;
        // 返回 promise 对象
        return new Promise((resolve, reject) => {
            // 获取 sign 对象
            UnifiedorderParams.sign = that.getSign(UnifiedorderParams);
            var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
            request.post({
                url: url,
                body: JSON.stringify(that.getUnifiedorderXmlParams(UnifiedorderParams))
            }, (err, res, body) => {
                // console.log(res);
                let prepay_id = '';
                if (!err && res.statusCode == 200) {
                    // 微信返回的数据为xml格式，需要转换为json数据，便于使用
                    xml2jsparseString(body, {async: true}, (err, result) => {
                        prepay_id = result.xml.prepay_id[0];
                        // 放回数组的第一个元素
                        resolve(prepay_id);
                    });
                } else {
                    reject(body);
                }
            });
        })
    }

    // 获取微信支付的签名
    getSign(signParams) {
        // 按参数名ASCII码从小到大排序
        var keys = Object.keys(signParams);
        keys = keys.sort();
        var newArgs = {};
        keys.forEach((val, key) => {
            if (signParams[val]) {
                newArgs[val] = signParams[val];
            }
        })
        // 拼接API密钥
        var string = queryString.stringify(newArgs) + '&key=' + config.wxpaykey;
        console.log(string);
        // 生成签名
        return crypto.createHash('md5').update(queryString.unescape(string), 'utf8').digest('hex').toUpperCase();
    }
    
    // 获取微信支付的签名
    getPrePaySign(appId, attach, productIntro, mchId, nonceStr, notifyUrl, openId, tradeId, ip, price) {
        var stringA = 'appid=' + appId +
            '&attach=' + attach +
            '&body=' + productIntro +
            '&mch_id=' + mchId +
            '&nonce_str=' + nonceStr +
            '&notify_url=' + notifyUrl +
            '&openid=' + openId +
            '&out_trade_no=' + tradeId +
            '&spbill_create_ip=' + ip +
            '&total_fee=' + price +
            '&trade_type=JSAPI'
        var stringSignTemp = stringA + '&key=' + PAY_API_KEY
        var sign = md5(stringSignTemp).toUpperCase()
        return sign
    }

    // 微信支付的所有参数
    getBrandWCPayParams(obj, callback) {
        let that = this;
        let prepay_id_promise = that.getPrepayId(obj);
        prepay_id_promise.then((prepay_id) => {
            let wcPayParams = {
                'appId': config.appid,
                'timeStamp': parseInt(new Date().getTime() / 1000).toString(),
                'nonceStr': that.createNonceStr(), // 随机串
                'package': 'prepay_id=' + prepay_id,
                'singType': 'MD5'
            };
            wcPayParams.paySign = that.getSign(wcPayParams);  // 微信支付签名
            wcPayParams.order_id = that.order_id;  // 微信支付订单号
            callback(wcPayParams);
        }, (err) => {
            callback(err);
        })
    }

    // 获取随机的NonceStr
    createNonceStr() {
        return Math.random().toString(36).substr(2, 15);
    }

}

module.exports = WechatAppletPay