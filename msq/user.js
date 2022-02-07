let { sqlFun } = require('./sql')
// 注册sql
exports.RegistrationMsq = async (data, Callback) => {
    let sql = 'SELECT * FROM user WHERE username=?';
    let sqlParams = [data.username];
    let doc = await sqlFun(sql, sqlParams)
    if (doc.err) {
        Callback({
            code: 5000,
            message: '数据操作失败请联系管理员'
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
    // 新增数据
    let addSql = 'INSERT INTO user(id,username,password,nickname,avatar,introduction,date,operationtime) VALUES(0,?,?,?,?,?,?,?)';
    let addSqlParams = [data.username, data.password, data.nickname, data.avatar, data.introduction, data.date, data.operationtime];
    let addDoc = await sqlFun(addSql, addSqlParams)
    if (addDoc.affectedRows == 1 && addDoc.protocol41 == true) {
        Callback({
            code: 2000,
            message: '注册成功'
        })
    } else {
        Callback({
            code: 2001,
            message: '数据操作失败请联系管理员'
        })
    }
}

// 修改操作时间
let UpdateUserMsqse = async (data) => {
    let sql = 'UPDATE user SET operationtime= ? WHERE username= ?';
    let sqlParams = [data.operationtime, data.username];
    let doc = await sqlFun(sql, sqlParams)
}

// 登录sql
exports.LoginMsq = async (data, Callback) => {
    let sql = 'SELECT * FROM user WHERE username=?';
    let sqlParams = [data.username];
    let doc = await sqlFun(sql, sqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
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
    let docObj = doc[0]
    if (docObj.password != data.password) {
        Callback({
            code: 2004,
            message: '密码错误'
        })
        return
    }
    UpdateUserMsqse({ ...docObj, ...data })
    delete docObj.password
    Callback({
        data: docObj
    })
}

// 修改用户信息
exports.UpdateUserMsqs = async (data, Callback) => {
    let sql = 'UPDATE user SET nickname=?,avatar=?,introduction=? WHERE username= ?';
    let sqlParams = [data.nickname, data.avatar, data.introduction, data.username];
    let doc = await sqlFun(sql, sqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })

    }
    Callback({
        data: doc
    })
}

// 修改用户密码
exports.UpdateUserPwdMsqs = async (data, Callback) => {
    let sql = 'UPDATE user SET password=? WHERE username= ?';
    let sqlParams = [data.password, data.username];
    let doc = await sqlFun(sql, sqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
    }
    Callback({
        data: doc
    })
}



// 获取当前登录用户信息sql
exports.GetInfoMsq = async (data, Callback) => {
    let sql = 'SELECT * FROM user WHERE username=?';
    let sqlParams = [data.username];
    let doc = await sqlFun(sql, sqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    if (doc.length == 0) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: "登录失败，无法获取用户详细信息"
        })
        return
    }
    let docObj = doc[0]
    delete docObj.password
    delete docObj.date
    delete docObj.id
    Callback({
        data: docObj
    })
}

// 获取用户路由信息
exports.GetRouterMsq = async (data, Callback) => {
    let sql = 'SELECT roles FROM user WHERE username=?';
    let sqlParams = [data.username];
    let doc = await sqlFun(sql, sqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    if (doc.length == 0) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: "获取失败，无法获取用户信息"
        })
        return
    }
    Callback({
        data: doc[0]
    })
}

// 获取用户列表
exports.AllUserMsq = async (data, Callback) => {
    let sqlTotal = "select count(1) as total from user where 1=1";
    let sqlDate = "select * from user where 1=1";
    let sqltArr = []
    let sqldArr = []
    if (data.username) {
        sqlTotal += " and username like ?";
        sqlDate += " and username like ?";
        sqltArr.push(`%${data.username}%`);
        sqldArr.push(`%${data.username}%`);
    }
    if (data.nickname) {
        sqlTotal += " and nickname like ?";
        sqlDate += " and nickname like ?";
        sqltArr.push(`%${data.nickname}%`);
        sqldArr.push(`%${data.nickname}%`);
    }
    if (data.currentPage && data.size) {
        sqlDate += " limit ?,?";
        let start = (data.currentPage - 1) * data.size
        let end = data.currentPage * data.size
        sqldArr.push(start, end);
    }
    // 合并sql 语句
    let sql = `${sqlTotal};${sqlDate}`
    // 合并查询数据
    let arrs = [...sqltArr, ...sqldArr]

    let doc = await sqlFun(sql, arrs)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}
// // 修改用户路由信息
// exports.UpdateRouterMsq = async (data, Callback) => {
//     let sql = 'UPDATE user SET roles=? WHERE username= ?';
//     let sqlParams = [data.roles,data.username];
//     let doc = await sqlFun(sql, sqlParams)
//     if(doc.err){
//         Callback({
//             code:50008,
//             message:'数据操作失败请联系管理员'
//         })
//         return
//     }
//     Callback({
//         data:doc
//     })
// }

// 删除用户
exports.deleteUserMsq = async (data, Callback) => {
    let sql = 'DELETE FROM user WHERE id = ?';
    let sqlParams = [data];
    let doc = await sqlFun(sql, sqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}

// 获取路由信息
exports.GetRouterListMsq = async (data, Callback) => {
    let sql = `SELECT * FROM routerLsit WHERE id in (${data})`;
    let doc = await sqlFun(sql)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}
// 用户管理获取路由信息
exports.GetQueryRouterListMsq = async (data, Callback) => {
    let sqlTotal = "select count(1) as total from routerLsit where 1=1";
    let sqlDate = "select * from routerLsit where 1=1";
    let sqltArr = []
    let sqldArr = []
    if (data.title) {
        sqlTotal += " and title like ?";
        sqlDate += " and title like ?";
        sqltArr.push(`%${data.title}%`);
        sqldArr.push(`%${data.title}%`);
    }
    if (data.currentPage && data.size) {
        sqlDate += " limit ?,?";
        let start = (data.currentPage - 1) * data.size
        let end = data.currentPage * data.size
        sqldArr.push(start, end);
    }
    // // 合并sql 语句
    let sql = `${sqlTotal};${sqlDate}`
    // // 合并查询数据
    let arrs = [...sqltArr, ...sqldArr]
    let doc = await sqlFun(sql, arrs)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}

// 添加路由信息
exports.GetAddRouterMsq = async (data, Callback) => {
    data.cascader = JSON.stringify(data.cascader)
    let sql = 'INSERT INTO routerLsit(id,title,name,path,redirect,component,icon,pid,sidebar,sortid,keepAlive,cascader) VALUES(0,?,?,?,?,?,?,?,?,?,?,?)';
    let addSqlParams = [data.title, data.name, data.path, data.redirect, data.component, data.icon, data.pid, data.sidebar, data.sortid, data.keepAlive, data.cascader];
    let doc = await sqlFun(sql, addSqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}
// 删除
exports.deleteRouterListMsqs = async (data, Callback) => {
    let sql = 'DELETE FROM routerLsit WHERE id = ?';
    let addSqlParams = [data];
    let doc = await sqlFun(sql, addSqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}


// 修改用户路由信息
exports.UpdateRouterListMsq = async (data, Callback) => {
    data.cascader = JSON.stringify(data.cascader)
    let sql = 'UPDATE routerLsit SET title=?,name=?,path=?,redirect=?,component=?,icon=?,pid=?,sidebar=?,sortid=?,keepAlive=?,cascader=? WHERE id= ?';
    let sqlParams = [data.title, data.name, data.path, data.redirect, data.component, data.icon, data.pid, data.sidebar, data.sortid, data.keepAlive, data.cascader, data.id];
    let doc = await sqlFun(sql, sqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}

// 添加角色管理
exports.setAddRoleManagement = async (data, Callback) => {
    let sql = 'INSERT INTO roleManagement(id,jsmc,jszl,syzt,jslx) VALUES(0,?,?,?,?)';
    let addSqlParams = [data.jsmc, data.jszl, data.syzt, data.jslx];
    let doc = await sqlFun(sql, addSqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}

// 获取角色管理列表
exports.getAllRoleManagement = async (data, Callback) => {
    let sqlTotal = "select count(1) as total from roleManagement where 1=1";
    let sqlDate = "select * from roleManagement where 1=1";
    let sqltArr = []
    let sqldArr = []
    if (data.id) {
        sqlTotal += " and id like ?";
        sqlDate += " and id like ?";
        sqltArr.push(`%${data.id}%`);
        sqldArr.push(`%${data.id}%`);
    }
    if (data.jsmc) {
        sqlTotal += " and jsmc like ?";
        sqlDate += " and jsmc like ?";
        sqltArr.push(`%${data.jsmc}%`);
        sqldArr.push(`%${data.jsmc}%`);
    }
    if (data.syzt) {
        sqlTotal += " and syzt like ?";
        sqlDate += " and syzt like ?";
        sqltArr.push(`%${data.syzt}%`);
        sqldArr.push(`%${data.syzt}%`);
    }
    if (data.currentPage && data.size) {
        sqlDate += " limit ?,?";
        let start = (data.currentPage - 1) * data.size
        let end = data.currentPage * data.size
        sqldArr.push(start, end);
    }
    // 合并sql 语句
    let sql = `${sqlTotal};${sqlDate}`
    // 合并查询数据
    let arrs = [...sqltArr, ...sqldArr]

    let doc = await sqlFun(sql, arrs)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}
// 修改角色管理
exports.UpdateRoleManagementMsq = async (data, Callback) => {
    let sql = 'UPDATE roleManagement SET jsmc=?,jszl=?,syzt=?,jslx=? WHERE id= ?';
    let sqlParams = [data.jsmc, data.jszl, data.syzt, data.jslx, data.id];
    let doc = await sqlFun(sql, sqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}

// 添加角色人员管理
exports.setAddRolePersonnel = async (data, Callback) => {
    let sqld = 'DELETE FROM rolePersonnel WHERE roleId = ?';
    let addSqlParams = [data.roleId];
    let delets = await sqlFun(sqld, addSqlParams)
    if (delets.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    let sql = 'INSERT INTO rolePersonnel(id,userId,roleId) VALUES ?';
    let doc = await sqlFun(sql, data.sqlList, true)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}
// 获取角色管理的数据
exports.AllRoleManagementMsq = async (data, Callback) => {
    let sql = `SELECT * FROM roleManagement WHERE id in (${data})`;
    let doc = await sqlFun(sql)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}
// 获取路由信息
exports.AllRoterTapListMsq = async (data, Callback) => {
    let sql = `SELECT * FROM routerLsit WHERE id IN (SELECT
        routerId 
    FROM
        rolePermissions 
    WHERE
        roleId IN ( SELECT id FROM roleManagement WHERE id  IN( SELECT roleId FROM rolePersonnel WHERE userId = ? ) AND syzt = '1' )
    )`
    let sqlParams = [data.userId]
    let doc = await sqlFun(sql, sqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}
// 获取角色人员管理查询数据
exports.AllRolePersonnelMsq = async (data, Callback) => {
    let sql = "select * from rolePersonnel where 1=1";
    let sqlParams = [];
    if (data.roleId) {
        sql += ' and roleId like ?'
        sqlParams.push(data.roleId)
    }
    if (data.userId) {
        sql += ' and userId like ?'
        sqlParams.push(data.userId)
    }
    let doc = await sqlFun(sql, sqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}

// 添加角色路由
exports.setAddRolePermissions = async (data, Callback, isShou) => {
    if (!isShou) {
        let sqld = 'DELETE FROM rolePermissions WHERE roleId = ?';
        let addSqlParams = [data.roleId];
        let delets = await sqlFun(sqld, addSqlParams)
        if (delets.err) {
            Callback({
                code: 50008,
                error: doc.errorMsg,
                message: '数据操作失败请联系管理员'
            })
            return
        }
    }
    if (data.sqlList.length == 0) {
        Callback({
            data: []
        })
        return
    }
    let sql = 'INSERT INTO rolePermissions(id,routerId,roleId) VALUES ?';
    let doc = await sqlFun(sql, data.sqlList, true)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}

// 获取角色路由
exports.AllRolePermissionsMsq = async (data, Callback) => {
    let sql = `SELECT * FROM rolePermissions WHERE roleId in (${data})`;
    let doc = await sqlFun(sql)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}


// 删除角色路由
exports.DeleteRolePermissionsMsq = async (data, Callback) => {
    let sql = 'DELETE FROM rolePermissions WHERE routerId = ?';
    let sqlParams = [data];
    let doc = await sqlFun(sql, sqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}

// 新增表单列表
exports.AddFormListMsq = async (data, Callback) => {
    let sql = 'INSERT INTO formList(formId,formName,fontSize,sidebar) VALUES (0,?,?,?)';
    let addSqlParams = [data.formName, data.fontSize, data.sidebar];
    let doc = await sqlFun(sql, addSqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}
// 修改表单列表
exports.ModifyFormListMsq = async (data, Callback) => {
    // formList
    let sql = 'UPDATE  formList SET formName=?,fontSize=?,sidebar=? WHERE formId=?';
    let sqlParams = [data.formName, data.fontSize, data.sidebar, data.formId];
    let doc = await sqlFun(sql, sqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}

// 获取表单列表
exports.GetAllFormListMsq = async (data, Callback) => {
    let sqlTotal = "select count(1) as total from formList where 1=1";
    let sqlDate = "select * from formList where 1=1";
    let sqltArr = []
    let sqldArr = []
    if (data.formId) {
        sqlTotal += " and formId like ?";
        sqlDate += " and formId like ?";
        sqltArr.push(`%${data.formId}%`);
        sqldArr.push(`%${data.formId}%`);
    }
    if (data.formName) {
        sqlTotal += " and formName like ?";
        sqlDate += " and formName like ?";
        sqltArr.push(`%${data.formName}%`);
        sqldArr.push(`%${data.formName}%`);
    }
    // 是否有分页器
    if (data.currentPage && data.size) {
        sqlDate += " limit ?,?";
        let start = (data.currentPage - 1) * data.size
        let end = data.currentPage * data.size
        sqldArr.push(start, end);
    }
    // 合并sql 语句
    let sql = `${sqlTotal};${sqlDate}`
    // 合并查询数据
    let arrs = [...sqltArr, ...sqldArr]
    let doc = await sqlFun(sql, arrs)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}


// 新增修改表单配置列表
exports.AddFormConfigurationMsq = async (data, Callback) => {
    let deleteSql = 'DELETE FROM formConfiguration WHERE formId = ?';
    let delSqlParams = [data.formId]
    let delDoc = await sqlFun(deleteSql, delSqlParams)
    if (delDoc.err) {
        Callback({
            code: 50008,
            error: delDoc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }

    let addSqlParams = data.list.map(item => {
        return [0, item.formId, item.formModel, item.label, item.type, item.size, item.isCheck, item.editlist, item.disabled, item.isValidator, JSON.stringify(item.rules), item.btnFun, item.btnType, item.text]
    })
    let sql = `insert into formConfiguration(id, formId, formModel,label, type, size, isCheck, editlist, disabled, isValidator, rules, btnFun, btnType, text) value ?`;
    let doc = await sqlFun(sql, addSqlParams, true)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}


// 获取表单配置列表
exports.AllFormConfigurationMsq = async (data, Callback) => {
    let sql = `SELECT * FROM formConfiguration WHERE formId = ?`;
    let sqlParams = [data];
    let doc = await sqlFun(sql, sqlParams)
    if (doc.err) {
        Callback({
            code: 50008,
            error: doc.errorMsg,
            message: '数据操作失败请联系管理员'
        })
        return
    }
    Callback({
        data: doc
    })
}








// // 批量添加
// let valuess= [
// 	[0, 'hu1', '2'],
// 	[0, 'ke1', '0'],
// 	[0, 'yi1', '1']
// ]
// let aGetRouterListMsqs = async (data, Callback) => {
    // let sql = `insert into aaas(id,path,name) value ?`;

    // let doc = await sqlFun(sql,data,true)
    // console.log(doc)
    // // if(doc.err){
    // //     Callback({
    // //         code:50008,
    // //         message:'数据操作失败请联系管理员'
    // //     })
    // //     return
    // // }
    // // Callback({
    // //     data:doc
    // // })
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

