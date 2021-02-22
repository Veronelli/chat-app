const express = require('express')
const path = require('path')
const http = require('http')
const socket = require('socket.io')

const {generateMessage, setMessages, getMessages, emtpyMessages} = require('./utils/messages')
const {addUser, removeUser, getUser, allUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socket(server)

const port = 3000 || process.env.PORT

app.use(express.static(path.join(__dirname,('../public'))))
app.use(express.urlencoded({extended:false}))

io.on('connection',socket=>{
    console.log("New user is connected")
    
    socket.on('join',(data,err)=>{
        const {error,user} = addUser({id:socket.id, ...data})

        if(error){
            return err(error)

        }

        socket.join(user.room)
        const chats = getMessages(user.room)
        
        const users = allUsersInRoom(user.room)

        if(chats){
            socket.emit('allchats',chats)

        }
        socket.emit('message',`${user.username} has joined`)
        socket.broadcast.to(user.room).emit('message', generateMessage('Server',`${user.username} has joined`))

        io.to(user.room).emit('roomData',user.room,users)

    })
    
    socket.on('send',(message,all_messsages)=>{
        const user = getUser(socket.id)
      
        if(user && message != ""){
            setMessages(user.room,all_messsages,user.username,message)
            io.to(user.room).emit('message',generateMessage(user.username,` ${message}`))

        }

    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)  

        if(user){
            io.to(user.room).emit('message',generateMessage('Server', `${user.username} is left`))
            const users = allUsersInRoom(user.room)
            io.to(user.room).emit('roomData', user.room, users)

        }

    })

})

setInterval(()=>{
    emtpyMessages()
    io.emit('allchats','')

},1200000)

server.listen(port,()=>{
    console.log(`Server is run on: ${port}`)

})