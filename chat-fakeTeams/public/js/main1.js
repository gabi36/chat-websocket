const addUserlistener = document.getElementById('register-form');

const socket = io();

addUserlistener.addEventListener('submit', (e) => {
    e.preventDefault();

    let usernameRegister = e.target.elements.username_register.value;

    socket.emit('addToDatabase', usernameRegister);
    confirm("User added");

    const msgBox = document.getElementById('username_register');
    msgBox.innerHTML="";
    window = 'register.html';

    location.reload();
});

const deleteUserListener = document.getElementById('username_register_delete')

deleteUserListener.addEventListener('submit', (e) => {
    e.preventDefault();

    let usernameRegister = e.target.elements.username_register_deleted.value;

    socket.emit('deleteFromDatabase', usernameRegister);
    confirm("User deleted");

    let msgBox = document.getElementById('username_register_deleted');
    msgBox.innerHTML="";
    location.reload();
})

const updateUserListener = document.getElementById('username_register_uppdate')

updateUserListener.addEventListener('submit', (e) => {
    e.preventDefault();

    let old_username = e.target.elements.username_old_username.value;
    let new_username = e.target.elements.username_new_username.value;

    socket.emit('updateDatabase', {old_username, new_username});
    confirm("User updated");

    let msgBox = document.getElementById('username_old_username');
    msgBox.innerHTML="";

    let msgBox1 = document.getElementById('username_new_username');
    msgBox1.innerHTML="";
    location.reload();
})
