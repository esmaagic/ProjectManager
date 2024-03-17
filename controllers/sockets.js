const {Server} = require('socket.io')
const User = require('../models/User')
const Message = require("../models/Message");



function addMessageToContainer(message) {
    const messageContainer = document.getElementById('chatHistory');
    const messageDiv = document.createElement('li');
    messageDiv.textContent = `${message.sender}: ${message.message}`;
    messageContainer.appendChild(messageDiv);
}


module.exports = (server) =>{
    const io = new Server(server)

    io.on('connection', (socket) => {

        //create a message and send it live via emitting 'update-chat'
        socket.on('send-message', async({sender, receiver, message}) =>{
            const newMessage = new Message({
                sender,
                receiver,
                message
            })
            await newMessage.save()



            const updatedSender = await User.findByIdAndUpdate(
                sender,
                { $addToSet: { contacts: receiver } },
                { new: true }
            );

            // Update receiver's contacts
            const updatedReceiver = await User.findByIdAndUpdate(
                receiver,
                { $addToSet: { contacts: sender } },
                { new: true }
            );




            io.emit('update-chat', await newMessage.populate('sender receiver'));
        })

        socket.on('disconnect', () => {
            //console.log('User disconnected:', socket.id);
        });
    })
}