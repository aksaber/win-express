/**
 * 统一返回数据的工具类
 */

class Unity {
    /**
     * 统一返回参数
     * @param {object} data - 返回对象；
     * @param {number} code - 状态码，默认为 200 成功；
     * @param {number} status - 成功为1，失败为0，默认1；
     */

    send(code = 200, status = 1, data, msg = 'success') {
        return {
            code: code,
            data: data,
            msg: msg,
        }
    }
}

module.exports = new Unity();