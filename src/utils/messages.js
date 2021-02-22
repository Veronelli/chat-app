var Messages = []

const emtpyMessages = ()=>{
    return Messages = []

}

const generateMessage = (username,text)=>{
    return{
        username,
        text    

    }
}

const setMessages = (room,chats,user,message)=>{
    const index = Messages.findIndex(message=>message.room===room)
    console.log(chats)
    if(index===-1){
        return Messages.push({room:room,chats:chats})

    }
    
    Messages[index].chats = chats
    Messages[index].chats += `        
    <div class="Messages">
       <div class="username">${user}</div>
        <div class="text-content">${message}</div>
    </div>`
    return Messages[index].room

}

const getMessages = (room)=>{
    const findRoom = Messages.find(message=>message.room===room)
    if(findRoom){
        return findRoom.chats

    }

}


module.exports = {
    generateMessage,
    setMessages,
    getMessages,
    emtpyMessages
}