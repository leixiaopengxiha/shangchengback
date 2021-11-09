let jwt = require("jsonwebtoken");

exports.SignFun=(username)=>{
   return jwt.sign({
    username,
    }, "abcd", {
        // 过期时间
        expiresIn: "1h"
    })
}

exports.VerifyFun=(token,Callback)=>{
    jwt.verify(token, 'abcd', function (err, decode) {
        if (err) {
            Callback({
                code: 5005,
                data: "success",
                message: "登录时间已过期，请重新登录"
            })
        } else {
         console.log(decode.username)
          Callback({
            username:decode.username
          })
        }
    })
 }