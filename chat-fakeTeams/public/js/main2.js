const listenerDelete = document.getElementById('username_register_delete')

const socket = io();

listenerDelete.addEventListener('submit', (e) => {
    e.preventDefault();

    let User = e.target.elements.username_register.value;
    usernameRegister = newUser.trim();

    if(!usernameRegister)
        return false;

    socket.emit('deleteFromDatabase', usernameRegister);
    console.log(usernameRegister);
});