const dotenv = require('dotenv').config()
const io = require('socket.io')(8800,{
    cors : {
        origin : 'https://cleverhires.vercel.app'
    }
})

let activeUsers = [];

io.on('connection',(socket)=>{
    // console.log(socket);
    socket.on('new-user-add',(newUserId)=>{
        console.log(newUserId);
        if(!activeUsers.some((user)=> user.userId === newUserId))
        {
            activeUsers.push({
                userId : newUserId,
                socketId : socket.id
            })
        }

        io.emit('get-users',activeUsers);
    })

    socket.on('send-message',(data)=>{
        console.log(data);
        const {receiverId} = data;
        const user = activeUsers.find((user)=> user.userId === receiverId)
        if(user){
            io.to(user.socketId).emit('receive-message',data)
        }

    })

    socket.on('disconnect',()=>{
        activeUsers = activeUsers.filter((user)=> user.socketId !== socket.id)
        io.emit('get-users',activeUsers)
    })

})
