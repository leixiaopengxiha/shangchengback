var mysql = require('mysql')

var values = [
	[0, 'hu1', '2'],
	[0, 'ke1', '0'],
	[0, 'yi1', '1']
]
var connection = mysql.createConnection({  
    host: 'localhost', // 连接的服务器
    port: 3306, // mysql服务运行的端口
    database: 'ShoppingMall', // 选择的库
    user: 'root', // 用户名
    password: '123456' // 用户密码  
})
connection.connect() // 创建一个mysql的线程
var insertsql = 'insert into aaas(id,path, name) values ?'
connection.query(insertsql, [values],(err, results, fields) => { 
    if (err) { 
        console.log('INSERT ERROR - ', err.message);
        throw err
    }
    connection.destroy();
    console.log("INSERT SUCCESS");
})