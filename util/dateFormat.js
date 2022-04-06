// 时间格式化
exports.dateFormat=(fmt, date)=> {
    date = new Date(date)
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

// 定时任务 使用方法
// config = {//参数的说明
//   interval: 1, //间隔天数，间隔为整数
//   runNow: true, //是否立即运行
//   time: "11:02:00" //执行的时间点 时在0~23之间
// }
// timeoutFunc(config, clearLogsFun)
exports.timeoutFunc =(func,config={
    interval: 1, //间隔天数，间隔为整数
    runNow: false, //是否立即运行
    time: "00:00:00", //执行的时间点 时在0~23之间
} )=>{
    config.runNow && func()
    const nowTime = new Date().getTime()
    const timePoints = config.time.split(':').map(i => parseInt(i))
    let recent = new Date().setHours(...timePoints)
    recent >= nowTime || (recent += 24 * 3600000)
    setTimeout(() => {
        func()
        setInterval(func, config.interval * 3600000)
    }, recent - nowTime)
}