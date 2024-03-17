document.addEventListener('DOMContentLoaded', async function() {

    const socket = io();
    //get previous messages

    let receiverElement = document.querySelector('#chat-container')
    let receiverId = receiverElement.dataset.id;
    let response = await fetch(`/inbox/getChatHistory/${receiverId}`)
    let chatData = await response.json()
    console.log(chatData)
    //display previous messages
    const chatContainer = document.querySelector('#chat-container'); //ispraznis div sa projektima
    chatContainer.innerHTML = ''; // Clear existing projects
    chatData.messages.forEach(message =>{
        const dueDate = new Date(message.timestamp);
        const year = dueDate.getFullYear();
        const month = String(dueDate.getMonth() + 1).padStart(2, '0');
        const day = String(dueDate.getDate()).padStart(2, '0');
        const endDate =  `${day}.${month}.${year}`
        let boja= 'bg-light text-black'
        let marg = 'mr-auto'

        if(message.receiver._id === receiverId) {
            boja = 'bg-primary text-white'
             marg = 'ml-auto'

        }
        const chatHTML = `
                    
                    <div class='d-flex m-3'>
                        <div class="${marg} p-2 px-3 border  ${boja}" style="border-radius: 15px">
                            <p class="m-0 poruka">${message.message}</p>
                            <p class=" m-0  poruka" style="font-size: 10px">${endDate}</p>
                        </div> 
                    </div>
                `
        chatContainer.insertAdjacentHTML('beforeend', chatHTML);
    })


    // listen for new messages
    response = await fetch(`/inbox/getChatUsers/${receiverId}`)
    const newMessageData =  await response.json();
    const sender = newMessageData.sender
    const receiver = newMessageData.receiver

    document.getElementById('chat-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        // Get the input value
        const messageInput = document.querySelector('input[name="message"]');
        const messageText = messageInput.value.trim(); // Trim removes extra spaces
        if (messageText !== '') {
            // Emit an event to create and send a new message
            socket.emit('send-message', {sender, receiver, message: messageText });
            // Clear the input field after sending the message
            messageInput.value = '';
        }
    });

    //send live messages
    socket.on('update-chat', (message) => {
        addMessageToContainer(message);
    });

    // Function to add messages to the HTML container
    function addMessageToContainer(message) {
        const dueDate = new Date(message.timestamp);
        const year = dueDate.getFullYear();
        const month = String(dueDate.getMonth() + 1).padStart(2, '0');
        const day = String(dueDate.getDate()).padStart(2, '0');
        const endDate =  `${day}.${month}.${year}`

        let boja= 'bg-light text-black '
        let marg = 'mr-auto'
        if(message.receiver._id === receiverId) {
            boja = 'bg-primary text-white'
            marg = 'ml-auto'

        }
        const messageHTML = `
                    <div class='d-flex m-3'>
                        <div class="${marg} p-2 px-3 border  ${boja}" style="border-radius: 15px">
                            <p class="m-0 poruka">${message.message}</p>
                            <p class=" m-0  poruka" style="font-size: 10px">${endDate}</p>
                        </div> 
                    </div>
                    
                `
        chatContainer.insertAdjacentHTML('beforeend', messageHTML);
    }





})


