// socket.io 服务处理文件
let socketUser={}
socketServer=(io)=>{
    io.on('connection',(socket) => {
        // console.log('user connected 用户链接成功');
        // 用户登录信息
        socket.on('userInformation',(data) => {
            socketUser[data.userInformation.username] = data.userInformation
            console.log('用户登录信息',socketUser);
            socket.emit('userInformationend',{aaa:'12312312'})
        })
        // 用户退出信息
        socket.on('userUsage',(data) => {
            delete socketUser[data.userInformation.username]
            console.log('用户退出信息',socketUser);
        })
        // 向客户端发送连接成功的消息
        socket.emit('connectionSuccess');
        socket.on('joinRoom',(data)=>{
            socket.join(data.roomId);
            console.log('joinRoom-房间ID：'+data.roomId);
        })
        // 广播有人加入到房间
        socket.on('callRemote',(data)=>{
            io.to(data.roomId).emit('callRemote')
        })
        // 广播同意接听视频
        socket.on('acceptCall',(data)=>{
            io.to(data.roomId).emit('acceptCall')
        })
        // 接收offer
        socket.on('sendOffer',({offer,roomId})=>{
            io.to(roomId).emit('sendOffer',offer)
        })
        // 接收answer
        socket.on('sendAnswer',({answer,roomId})=>{
            io.to(roomId).emit('sendAnswer',answer)
        })
        // 收到candidate
        socket.on('sendCandidate',({candidate,roomId})=>{
            io.to(roomId).emit('sendCandidate',candidate)
        })
        // 挂断结束视频
        socket.on('hangUp',(data)=>{
            io.to(data.roomId).emit('hangUp')
        })
        
       
    });
}
module.exports = socketServer