// 用户库
let mysql = require('mysql');
const log4js= require('../log-config')
const errlogger = log4js.getLogger('err')
exports.sqlFun = (sql, user, isShow,) => {
  let connection = mysql.createConnection({
    host: '49.232.206.220',
    // host: 'localhost',
    user: 'root',
    password: 'xp123456',
    database: 'ShoppingMall',
    //这一功能打开以后，你就可以像下面的例子一样同时使用多条查询语句：
    multipleStatements: true,
  });
  // 链接===
  connection.connect();
  
  let sqlany
  if (isShow) {
    sqlany = new Promise((resolve, reject) => {
      connection.query(sql, [user], function (err, result) {
        if (err) {
          resolve({
            errorMsg:err,
            err: true
          })
          errlogger.error({
            sql:sql,
            user:user,
            logger:err
          });
          return;
        }
        resolve(result)
      });
    })
  } else if (user) {
    sqlany = new Promise((resolve, reject) => {
      connection.query(sql, user, function (err, result) {
        if (err) {
          resolve({
            errorMsg:err,
            err: true
          })
          errlogger.error({
            sql:sql,
            user:user,
            logger:err
          });
          return;
        }
        resolve(result)
      });
    })
  } else {
    sqlany = new Promise((resolve, reject) => {
      connection.query(sql, function (err, result) {
        if (err) {
          resolve({
            errorMsg:err,
            err: true
          })
          errlogger.error({
            sql:sql,
            user:user,
            logger:err
          });
          return;
        }
        resolve(result)
      });
    })
  }
  connection.end()
  return sqlany;
}