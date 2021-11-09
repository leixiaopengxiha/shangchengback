let { sqlFun } = require('./sql')
// 注册sql
exports.RegistrationMsq = async (data, Callback) => {
    let sql = 'SELECT * FROM user WHERE username=?';
    let sqlParams = [data.username];
    let doc = await sqlFun(sql, sqlParams)
    if(doc.err){
        Callback({
            code:5000,
            message:'数据操作失败请联系管理员'
        })
        return
    }
    if (doc.length !== 0) {
        Callback({
            code: 2004,
            message: '该用户已注册'
        })
        return false
    }
    data.roles = JSON.stringify(data.roles)
    // 新增数据
    let addSql = 'INSERT INTO user(id,username,password,nickname,avatar,introduction,date,operationtime,roles) VALUES(0,?,?,?,?,?,?,?,?)';
    let addSqlParams = [data.username, data.password, data.nickname, data.avatar, data.introduction,data.date, data.operationtime,data.roles];
    let addDoc = await sqlFun(addSql, addSqlParams)
    if(addDoc.affectedRows==1&&addDoc.protocol41==true){
        Callback({
            code: 2000,
            message: '注册成功'
        })
    }else{
        Callback({
            code: 2001,
            message: '数据操作失败请联系管理员'
        })
    }
}

// 修改操作时间
let UpdateUserMsqse = async (data) => {
    let sql = 'UPDATE user SET operationtime= ? WHERE username= ?';
    let sqlParams = [data.operationtime,data.username];
    let doc = await sqlFun(sql, sqlParams)
}

// 登录sql
exports.LoginMsq = async (data, Callback) => {
    let sql = 'SELECT * FROM user WHERE username=?';
    let sqlParams = [data.username];
    let doc = await sqlFun(sql, sqlParams)
    if(doc.err){
        Callback({
            code:50008,
            message:'数据操作失败请联系管理员'
        })
        return
    }
    // 判断该用户不存在
    if (doc.length == 0) {
        Callback({
            code: 2003,
            message: '该用户不存在'
        })
        return 
    }
    // 判断密码是否正确
    let docObj=doc[0]
    UpdateUserMsqse({...docObj,...data})
    if(docObj.password!=data.password){
        Callback({
            code: 2004,
            message: '密码错误'
        })
        return 
    }
    delete docObj.password
    Callback({
        data:docObj
    })
}

// 修改用户信息
exports.UpdateUserMsqs = async (data, Callback) => {
    let sql = 'UPDATE user SET nickname=?,avatar=?,introduction=? WHERE username= ?';
    let sqlParams = [data.nickname,data.avatar,data.introduction,data.username];
    let doc = await sqlFun(sql, sqlParams)
    if(doc.err){
        Callback({
            code:50008,
            message:'数据操作失败请联系管理员'
        })

    }
    Callback({
        data:doc
    })
}

// 修改用户密码
exports.UpdateUserPwdMsqs = async (data, Callback) => {
    let sql = 'UPDATE user SET password=? WHERE username= ?';
    let sqlParams = [data.password,data.username];
    let doc = await sqlFun(sql, sqlParams)
    if(doc.err){
        Callback({
            code:50008,
            message:'数据操作失败请联系管理员'
        })
    }
    Callback({
        data:doc
    })
}



// 获取当前登录用户信息sql
exports.GetInfoMsq = async (data, Callback) => {
    let sql = 'SELECT * FROM user WHERE username=?';
    let sqlParams = [data.username];
    let doc = await sqlFun(sql, sqlParams)
    if(doc.err){
        Callback({
            code:50008,
            message:'数据操作失败请联系管理员'
        })
        return
    }
    if (doc.length == 0) {
        Callback({
            code: 50008,
            message: "登录失败，无法获取用户详细信息"
        })
        return 
    }
    let docObj=doc[0]
    delete docObj.password
    delete docObj.date
    delete docObj.roles
    delete docObj.id
    Callback({
        data:docObj
    })
}



// 获取用户路由信息
exports.GetRouterMsq = async (data, Callback) => {
    let sql = 'SELECT roles FROM user WHERE username=?';
    let sqlParams = [data.username];
    let doc = await sqlFun(sql, sqlParams)
    if(doc.err){
        Callback({
            code:50008,
            message:'数据操作失败请联系管理员'
        })
        return
    }
    if (doc.length == 0) {
        Callback({
            code: 50008,
            message: "获取失败，无法获取用户信息"
        })
        return 
    }
    Callback({
        data:doc[0]
    })
}

// 获取用户列表
exports.AllUserMsq = async (data, Callback) => {
    let sqlTotal = "select count(1) as total from user where 1=1";
    let sqlDate = "select * from user where 1=1";
    let sqltArr = []
    let sqldArr = []
    if(data.username){
        sqlTotal += " and username like ?";
        sqlDate  += " and username like ?";
        sqltArr.push(`%${data.username}%`);
        sqldArr.push(`%${data.username}%`);
    }
    if(data.nickname){
        sqlTotal += " and nickname like ?";
        sqlDate += " and nickname like ?";
        sqltArr.push(`%${data.nickname}%`);
        sqldArr.push(`%${data.nickname}%`);
    }
    if(data.currentPage&&data.size){
        sqlDate += " limit ?,?";
        let start = (data.currentPage-1)*data.size
        let end = data.currentPage*data.size
        sqldArr.push(start,end);
    }
    // 合并sql 语句
    let sql = `${sqlTotal};${sqlDate}`
    // 合并查询数据
    let arrs = [...sqltArr,...sqldArr]

    let doc = await sqlFun(sql,arrs)
    if(doc.err){
        Callback({
            code:50008,
            message:'数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data:doc
    })
}
// 修改用户路由信息
exports.UpdateRouterMsq = async (data, Callback) => {
    let sql = 'UPDATE user SET roles=? WHERE username= ?';
    let sqlParams = [data.roles,data.username];
    let doc = await sqlFun(sql, sqlParams)
    if(doc.err){
        Callback({
            code:50008,
            message:'数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data:doc
    })
}

// 删除用户
exports.deleteUserMsq = async (data, Callback) => {
    let sql =  'DELETE FROM user WHERE id = ?';
    let sqlParams = [data];
    let doc = await sqlFun(sql, sqlParams)
    if(doc.err){
        Callback({
            code:50008,
            message:'数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data:doc
    })
}

// 获取路由信息
exports.GetRouterListMsq= async (data, Callback) => {
    let sql = `SELECT * FROM routerLsit WHERE id in (${data})`;
    let doc = await sqlFun(sql)
    if(doc.err){
        Callback({
            code:50008,
            message:'数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data:doc
    })
}
// 用户管理获取路由信息
exports.GetQueryRouterListMsq= async (data, Callback) => {
    let sqlTotal = "select count(1) as total from routerLsit where 1=1";
    let sqlDate = "select * from routerLsit where 1=1";
    let sqltArr = []
    let sqldArr = []
    if(data.title){
        sqlTotal += " and title like ?";
        sqlDate  += " and title like ?";
        sqltArr.push(`%${data.title}%`);
        sqldArr.push(`%${data.title}%`);
    }
    if(data.currentPage&&data.size){
        sqlDate += " limit ?,?";
        let start = (data.currentPage-1)*data.size
        let end = data.currentPage*data.size
        sqldArr.push(start,end);
    }
    // // 合并sql 语句
    let sql = `${sqlTotal};${sqlDate}`
    // // 合并查询数据
    let arrs = [...sqltArr,...sqldArr]
    let doc = await sqlFun(sql,arrs)
    if(doc.err){
        Callback({
            code:50008,
            message:'数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data:doc
    })
}

// 添加路由信息
exports.GetAddRouterMsq = async (data, Callback) => {
    data.cascader = JSON.stringify(data.cascader)
    let sql =  'INSERT INTO routerLsit(id,title,name,path,redirect,component,icon,pid,sidebar,sortid,keepAlive,cascader) VALUES(0,?,?,?,?,?,?,?,?,?,?,?)';
    let addSqlParams = [data.title, data.name, data.path,data.redirect, data.component, data.icon, data.pid,data.sidebar,data.sortid,data.keepAlive,data.cascader];
    let doc = await sqlFun(sql,addSqlParams)
    if(doc.err){
        Callback({
            code:50008,
            message:'数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data:doc
    })
}
// 删除
exports.deleteRouterListMsqs = async (data, Callback) => {
    let sql =  'DELETE FROM routerLsit WHERE id = ?';
    let addSqlParams = [data];
    let doc = await sqlFun(sql,addSqlParams)
    if(doc.err){
        Callback({
            code:50008,
            message:'数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data:doc
    })
}


// 修改用户路由信息
exports.UpdateRouterListMsq = async (data, Callback) => {
    data.cascader = JSON.stringify(data.cascader)
    let sql = 'UPDATE routerLsit SET title=?,name=?,path=?,redirect=?,component=?,icon=?,pid=?,sidebar=?,sortid=?,keepAlive=?,cascader=? WHERE id= ?';
    let sqlParams = [data.title,data.name,data.path,data.redirect,data.component,data.icon,data.pid,data.sidebar,data.sortid,data.keepAlive,data.cascader,data.id];
    let doc = await sqlFun(sql, sqlParams)
    if(doc.err){
        Callback({
            code:50008,
            message:'数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data:doc
    })
}











// // 批量添加
// let valuess= [
// 	[0, 'hu1', '2'],
// 	[0, 'ke1', '0'],
// 	[0, 'yi1', '1']
// ]
// let aGetRouterListMsqs = async (data, Callback) => {
//     let sql = `insert into aaas(id,path,name) value ?`;

//     let doc = await sqlFun(sql,data,true)
//     console.log(doc)
//     // if(doc.err){
//     //     Callback({
//     //         code:50008,
//     //         message:'数据操作失败请联系管理员'
//     //     })
//     //     return
//     // }
//     // Callback({
//     //     data:doc
//     // })
// }
// aGetRouterListMsqs(valuess)

// 批量删除
// let deleteAll = async (data, Callback) => {
//     console.log(data,'sdsdsdsd')
//     let sql = `DELETE FROM aaas WHERE id in (${data})`;
//     let doc = await sqlFun(sql)
//     console.log(doc)
    // if(doc.err){
    //     Callback({
    //         code:50008,
    //         message:'数据操作失败请联系管理员'
    //     })
    //     return
    // }
    // Callback({
    //     data:doc
    // })
// }
// deleteAll("00000000002,00000000003,00000000004")

