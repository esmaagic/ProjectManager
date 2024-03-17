


document.getElementById('managing-projects').addEventListener('click', async function(event) {
    event.preventDefault();
    await getFilters('projects');
    await fetchAndDisplayData('projects', 'all');

});
document.getElementById('all-managing-projects').addEventListener('click', async function(event) {
    event.preventDefault();
    await fetchAndDisplayData('projects', 'all');
});
document.getElementById('behind-projects').addEventListener('click', async function(event) {
    event.preventDefault();
    await fetchAndDisplayData('projects','behind');
});
document.getElementById('completed-projects').addEventListener('click', async function(event) {
    event.preventDefault();
    await fetchAndDisplayData('projects','completed');
});
document.getElementById('projects-report').addEventListener('click', async function(event) {
    event.preventDefault();
    await projectsReport()
});
document.getElementById('managing-tasks').addEventListener('click', async function(event) {
    event.preventDefault();
    await getFilters('tasks');
    await fetchAndDisplayData('tasks','all')

});
document.getElementById('all-managing-tasks').addEventListener('click', async function(event) {
    event.preventDefault();
    await fetchAndDisplayData('tasks','all')
});
document.getElementById('behind-tasks').addEventListener('click', async function(event) {
    event.preventDefault();
    await fetchAndDisplayData('tasks','behind')
});
document.getElementById('completed-tasks').addEventListener('click', async function(event) {
    event.preventDefault();
    await fetchAndDisplayData('tasks','completed')
});

document.getElementById('create-project').addEventListener('click', async function(event) {
event.preventDefault();
    await createProject()
});

document.getElementById('tasks-report').addEventListener('click', async function(event) {
    event.preventDefault();
    await tasksReport()
});


const createTask = document.querySelectorAll('.create-task');
createTask.forEach(element => {
    element.addEventListener('click', async event => {
            await createTask(event.target.id);

    });
});

const addMemberButton = document.querySelectorAll('.add-member');
addMemberButton.forEach(element => {
    element.addEventListener('click', async event => {
        event.preventDefault();
        await addMember(event.target.id)

    });
});

document.getElementById('managing-users').addEventListener('click', async function(event) {
    event.preventDefault();
    await getFilters()
    await fetchAndDisplayData('users')
});





