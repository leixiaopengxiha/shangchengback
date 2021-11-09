// 用户库
let mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'ShoppingMall',
  //这一功能打开以后，你就可以像下面的例子一样同时使用多条查询语句：
  multipleStatements: true,
});

// 链接
connection.connect();

exports.sqlFun = (sql, user, isShow,) => {
  let sqlany
  if (isShow) {
    sqlany = new Promise((resolve, reject) => {
      connection.query(sql, [user], function (err, result) {
        debugger
        if (err) {
          resolve({
            err: true
          })
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
            err: true
          })
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
            err: true
          })
          return;
        }
        resolve(result)
      });
    })
  }

  return sqlany;
}