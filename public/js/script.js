const socket = io()
const btnPush = document.querySelector('#push')
const counter = document.querySelector('#input-message')

const $messages = document.querySelector('#messages')
const btn_users = document.querySelector('.fa-user-friends')
const menu = document.querySelector('#menu')
const Messages = document.querySelectorAll('.Messages') 

var all_messsages = ""
var on_menu= true

const {username, room} = Qs.parse(location.search,{ ignoreQueryPrefix: true })

counter.setAttribute('placeholder','connecting...')

const autoScroll = ()=>{
    const new_message = $messages.lastElementChild

    const new_message_style = getComputedStyle(new_message)
    const new_message_margin = parseInt(new_message_style.marginBottom)
    const new_message_height = new_message.offsetHeight + new_message_margin

    const visible_height = $messages.offsetHeight
    const container_height = $messages.scrollTop + visible_height
    const scroll_off_set = $messages.scrollTop + visible_height

    if(container_height - new_message_height  <= scroll_off_set){
        $messages.scrollTop = $messages.scrollHeight

    }
}

socket.on('message',(msg)=>{
    var $aux_messages
    counter.setAttribute('placeholder',`Type a message`)
    counter.removeAttribute('disabled')
    btnPush.removeAttribute('disabled')
    if(msg.username && msg.username!="Server" ){
        $aux_messages = `
        <div class="Messages">
            <div class="username">${msg.username}</div>
            <div class="text-content">${msg.text}</div>
        </div>`

    }
    else if(msg.username=="Server"){
        $aux_messages = `<p class="server">${msg.text}</p>`

    }
    else{
        $aux_messages = `<p class="server">${msg}</p>`
        
    }

    console.log($aux_messages)
    $messages.innerHTML += $aux_messages
    autoScroll()

})

socket.emit('join',{username,room},(error)=>{
    if(error)
        location.href = "/"

})

btn_users.addEventListener('mouseover',()=>{
    btn_users.style.background = "black"

})

btn_users.addEventListener('mouseleave',()=>{
    btn_users.style.background = "none"
    if(!on_menu){
        btn_users.style.background = "red"

    }
    else{
        btn_users.style.background = "none"

    }

})

socket.on('allchats',(chats)=>{
    $messages.innerHTML = chats

})

btn_users.onclick =()=>{
    if(on_menu){
        menu.style.transform = "translateX(0rem)"
        btn_users.style.background = "red"

    }
    else{
        menu.style.transform = "translateX(21rem)"
        btn_users.style.background = "none"

    }
    on_menu = !on_menu

}
socket.on('roomData',(room,users)=>{
    const $title = document.querySelector('#in-title')
    const $users = document.querySelector('#users')
    let aux_users = ""

    $users.innerHTML = ""
    $title.textContent = room

    users.forEach(user => {
        aux_users = `<li class="user">${user.username}</li>`
        $users.innerHTML += aux_users

    });


})

btnPush.onclick = ()=>{
    all_messsages = $messages.innerHTML
    
    socket.emit('send',counter.value, all_messsages)
    counter.value = ""

}

socket.on()