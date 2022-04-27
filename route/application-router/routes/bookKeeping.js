// 1.引入管理员模块
// jwt 
let md5 = require('md5-node');
let { dateFormat } = require('../../../util/dateFormat')
let userMsq = require('../../../msq/user')

let Jwt = require('../../../util/token');

// const path = require("path");
// const fs = require('fs')
// 新增记账
exports.addBookKeeping = (req, res) => {
   console.log(req.body)
}
