/*
 * @Descripttion: token验证类
 * @Author: mikasa
 * @Date: 2020-07-15 17:57:37
 */
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')

// 创建 token 类
class Jwt {
    constructor(data) {
        this.data = data
    }
    //生成token
    generateToken() {
        let data = this.data
        let created = Math.floor(Date.now() / 1000)
        let cert = fs.readFileSync(path.join(__dirname, './certs/registry.key')) // 私钥
        let token = jwt.sign({
            data,
        }, cert, {
            // 过期时间
            expiresIn: "1h"
        })
        return token
    }
    // 校验token
    verifyToken() {
        let token = this.data
        let cert = fs.readFileSync(path.join(__dirname, './certs/registry.key')) // 公钥
        let res
        jwt.verify(token, cert, function (err, result) {
            if (err) {
                res = 'err'
            } else {
                res = result.data || {}
            }
        })
        return res
    }
}
module.exports = Jwt