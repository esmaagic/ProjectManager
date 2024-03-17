document.addEventListener('DOMContentLoaded', async function() {

    const userContainers = document.querySelectorAll('.user-container');

    userContainers.forEach((container) => {
        container.addEventListener('click', (event) => {
            const userId = container.getAttribute('id')
            window.location.href = `/inbox/chat/${userId}`

        });
    });

    const form = document.getElementById('search-chat-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const userInput = document.getElementById('userInput').value.trim();

        const response = await fetch(`/inbox/findUserByUsername/${userInput}`); //get ruta

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data)

        window.location.href = `/inbox/chat/${data.userId}`

    })



})