function generatePDF(){
    const element = document.getElementById('tabela');
    const opt = {
        margin: 10,
        filename: 'myfile.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        // Other options here to modify styling
    };
    html2pdf().from(element).set(opt).save();
}



const createProject = async () => {
    try {

        const form = document.getElementById('create-project-form');
        const formData = new FormData(form);
        console.log('za porjekat')
        console.log([...formData.entries()]);

        const response = await fetch('/project/createProject', {
            method: 'POST',
            body: formData,


        });

        if (response.ok) {
            // Redirect to a different page after successful project creation
            window.location.href = '/supervisors/getSupervisorPan';
        } else {
            throw new Error('Failed to create project');
        }
    } catch (error) {
        console.error(error);
        // Handle errors or display an error message if needed
    }
};

const deleteProject = async (id) => {

    try {
        let confirmation = confirm("Are you sure you want to delete this project?");
        if(confirmation){
            const response = await fetch(`http://localhost:3000/project/deleteProject/${id}`, {
                method: 'DELETE' // Assuming DELETE method is used for deletion
                // Additional headers or body data can be added if required
            });

            if (response.ok) {
                // Project successfully deleted, you can update the UI or take other actions as needed
                console.log(`Project with ID ${id} deleted successfully.`);
                window.location.reload();
            } else {
                // Handle error scenarios if the deletion fails
                console.error('Failed to delete the project.');
            }
        }


    } catch (error) {
        console.error('An error occurred while deleting the project:', error);
    }

}







const createTask = async (id) => {
    try {



            const el = document.getElementById(id);
            const index = id.charAt(id.length - 1)
            const projectId = el.getAttribute('data-id')



        const form = document.getElementById(`create-task-form-${index}`);
        const formData = new FormData(form);

        const response = await fetch(`/task/createTask/${projectId}`, {
            method: 'POST',
            body: formData,


        });

        if (response.ok) {
            // Redirect to a different page after successful project creation
            window.location.href = '/supervisors/getSupervisorPan';
        } else {
            throw new Error('Failed to create project');
        }


    } catch (error) {
        console.error(error);
        // Handle errors or display an error message if needed
    }
};

const  deleteTask = async (id)=>{

    try {
        let confirmation = confirm("Are you sure you want to delete this task?");
        if(confirmation){
            const response = await fetch(`http://localhost:3000/task/deleteTask/${id}`, {
                method: 'DELETE' // Assuming DELETE method is used for deletion
                // Additional headers or body data can be added if required
            });

            if (response.ok) {
                // Project successfully deleted, you can update the UI or take other actions as needed
                console.log(`Project with ID ${id} deleted successfully.`);
                window.location.reload();
            } else {
                // Handle error scenarios if the deletion fails
                console.error('Failed to delete the project.');
            }
        }


    } catch (error) {
        console.error('An error occurred while deleting the project:', error);
    }

}

const addMember = async (id) =>{
    try {
        const el = document.getElementById(id);
        const index = id.charAt(id.length - 1)
        const taskId = el.getAttribute('data-id')



        const form = document.getElementById(`add-member-form-${index}`);
        const formData = new FormData(form);
        console.log(formData)
        console.log(taskId)
        const response = await fetch(`/task/addMember/${taskId}`, {
            method: 'POST',
            body: formData,


        });

        if (response.ok) {
            // Redirect to a different page after successful project creation
            window.location.reload();
        } else {
            throw new Error('Failed to add member');
        }


    } catch (error) {
        console.error(error);
        // Handle errors or display an error message if needed
    }
}

const completeProject = async (id) =>{
    try {
        const el = document.getElementById(id);
        const projectId = el.getAttribute('id')
        console.log(projectId)

        const response = await fetch(`/project/markProjectAsCompleted/${projectId}`, {
            method: 'POST',
        });

        if (response.ok) {
            // Redirect to a different page after successful project creation
            window.location.reload();
        } else {
            throw new Error('Failed to mark project as completed');
        }


    } catch (error) {
        console.error(error);
        // Handle errors or display an error message if needed
    }
}

const completeTask = async (id) =>{
    try {
        const el = document.getElementById(id);
        const taskId = el.getAttribute('id')
        console.log(taskId)

        const response = await fetch(`/task/markTaskAsCompleted/${taskId}`, {
            method: 'POST',
        });

        if (response.ok) {
            // Redirect to a different page after successful project creation
            window.location.reload();
        } else {
            throw new Error('Failed to mark task as completed');
        }


    } catch (error) {
        console.error(error);
        // Handle errors or display an error message if needed
    }
}

const createUser = async () =>{
    try {
        const form = document.getElementById('create-user-form'); // id forme
        // ovo je da uzmes form element
        const formData = new FormData(form);


        const response = await fetch('/user/createUser', {
            method: 'POST',
            body: formData,


        });

        if (response.ok) {
            // Redirect to a different page after successful project creation
            window.location.href = '/supervisors/getSupervisorPan';
        } else {
            throw new Error('Failed to create project');
        }
    } catch (error) {
        console.error(error);
        // Handle errors or display an error message if needed
    }
}

const  deleteUser = async (username)=>{

    try {
        let confirmation = confirm("Are you sure you want to delete this member?");
        if(confirmation){
            const response = await fetch(`http://localhost:3000/user/deleteUser/${username}`, {
                method: 'DELETE' // Assuming DELETE method is used for deletion
                // Additional headers or body data can be added if required
            });

            if (response.ok) {
                // Project successfully deleted, you can update the UI or take other actions as needed
                console.log(`User with username ${username} deleted successfully.`);
                window.location.reload();
            } else {
                // Handle error scenarios if the deletion fails
                console.error('Failed to delete this user.');
            }
        }


    } catch (error) {
        console.error('An error occurred while deleting the user:', error);
    }

}


//keyWord: projects/tasks/users
const getFilters = async(filterKey) => {
    console.log(filterKey)
    const filterContainer = document.querySelector('.filter-container'); //ispraznis div sa projektima
    filterContainer.innerHTML = ''
    let filterHTML = `
        <ul class="nav justify-content-center">
            <li class="nav-item">
                <p class="nav-link pb-0 mb-0 font-weight-bold pl-2 second-header text-dark text-muted" id='all-managing-${filterKey}'>all</p>
            </li>`;

    // Check your condition here to decide whether to include the elements or not
    if (filterKey !== 'users') {
        filterHTML += `
            <li class="nav-item">
                <p class="nav-link pb-0 mb-0 second-header pl-2 text-dark text-muted" id='behind-${filterKey}'>behind</p>
            </li>
            <li class="nav-item">
                <p class="nav-link pb-0 mb-0 pl-2 second-header text-dark text-muted" id='completed-${filterKey}'>completed</p>
            </li>`;
    }
    if (filterKey === 'users') {
        filterHTML += `
            <li class="nav-item">
                <p class="nav-link pb-0 mb-0 second-header pl-2 text-dark text-muted" id='user-activity'>activity</p>
            </li>
            
            
            `;
    }

    // Add the rest of the HTML
    filterHTML += `
            <li class="nav-item">
                <p class="nav-link pb-0 mb-0 pl-2 second-header text-dark text-muted" id='${filterKey}-report'>report</p>
            </li>
        </ul>`;




    filterContainer.insertAdjacentHTML('beforeend', filterHTML);

    const navItems2 = document.querySelectorAll(".second-header");
    navItems2.forEach(item => {
        item.addEventListener("click", () => {
            // Remove 'active' class from all list items
            navItems2.forEach(navItem => navItem.classList.remove("font-weight-bold"));
            // Add 'active' class to the clicked list item
            item.classList.add("font-weight-bold");
        });
    });

}


//heading: projects/tasks/users,  sub: all/behind/completed
 const  fetchAndDisplayData =  async (heading,sub)=> {
    let route
     let style = ''
    if(heading==='projects'){
        if(sub ==='all')
            route ='/project/UserProjectsJson/1/0'
        if(sub === 'behind')
            route ='/project/getBehindProjects/1'
        if(sub === 'completed')
            route ='/project/getCompletedProjects/1'
    }
    if(heading === 'tasks'){
        if(sub ==='all')
            route = '/task/getAllManagingTasks/0'
        if(sub === 'behind')
            route ='/task/getBehindTasks/1'
        if(sub === 'completed')
            route ='/task/getCompletedTasks/1'
    }
    if (heading === 'users'){
        if(sub ==='all')
            route = '/user/getAllUsers'

    }



     if(sub === 'behind')
         style = "border-bottom border-danger"
     if(sub === 'completed')
         style = "border-bottom border-success"



    const response = await fetch(route); //get ruta

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }




    const data = await response.json();



    const projectsContainer = document.querySelector('.main-container'); //ispraznis div sa projektima
    projectsContainer.innerHTML = ''; // Clear existing projects



    if(heading === 'projects'){
        data.projects.forEach((project,index) => {
            let markAsCompletedButtonHTML = '';
            // Display the "Mark as completed" button only if the project is not already completed
            if (sub !== 'completed') {
                markAsCompletedButtonHTML = `<button type="button" id='${project._id}' class="btn complete-project-button btn-success">Mark as finished</button>`;
            }
            const dueDate = new Date(project.end_date);
            const year = dueDate.getFullYear();
            const month = String(dueDate.getMonth() + 1).padStart(2, '0');
            const day = String(dueDate.getDate()).padStart(2, '0');
            const endDate =  `${day}.${month}.${year}`

            const usersHTML = project.members.map(user => `<span class="m-0 p-0">${user.username}</span>`).join(''); // Generate <p> elements for each task
            const projectHTML = `
                <div id="${project._id}"  class="d-flex  justify-content-between project-container  mt-3 d-flex bg-white shadow-sm align-items-center px-3">
                        <div class="project-title p-2 font-weight-bold">
                            <p class="m-0 d-inline-block  text-truncate">${project.project_name}</p>
                        </div>
                   
                        <div class="due p-2 ">
                        
                        
                        
                     
                        <button type="button" class="btn" data-toggle="modal" data-target="#createTask${index}">
                            <i  class="fa-solid  text-muted fa-plus"></i>
                        </button>

                        <div class="modal fade" id="createTask${index}" tabindex="-1" aria-labelledby="createTask${index}Label" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                        
                                    <div class="modal-body">
                                        <div class="p-3 justify-content-center container">
                                            <form id="create-task-form-${index}">
                                            <label  for="">Create Task</label>
                                                <div class="form-group">
                                                    <input type="text" name="task_name" class="form-control" placeholder="Task name">
                                                </div>
                                                <div class="form-group">
                                                    <input type="text" name="description" class="form-control" placeholder="description">
                                                </div>                                    
                                                <div class="form-group">
                                                    <input type="text" name="end_date" class="form-control" placeholder="ending date YYYY-MM-DD">
                                                </div>
                                               
                        
                                                <div class="row">
                                                    <div class="col">
                                                        <button type="submit"  id="create-task-${index}" data-id="${project._id}" class="btn create-task btn-primary btn-block">Create</button>
                                                    </div>
                                                    <div class="col">
                                                        <button type="button"  class="btn btn-block btn-secondary" data-dismiss="modal">Close</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                        
                                    </div>
                        
                                </div>
                            </div>
                        </div>

                        
                        
                        
                            
                            <button onclick="deleteProject('${project._id}')" class="btn bg-white text-muted text-left" type="button">
                                <i  data-id="${project._id}" class="delete-project fa-solid py-2 fa-trash"></i>
                            </button>
                            
                            <button class="btn bg-white text-muted text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                                <i id="${project._id}" class="fa-solid delete-project fa-ellipsis py-2"></i>
                            </button>
                        </div> 
                </div>
               <div id="collapse${index}" class="collapse m-0 p-0  bg-white" aria-labelledby="heading${index}" data-parent="#accordionExample">
                     <div class="card-body border-top ">
                        <p>Project members: ${usersHTML}</p>
                        
                        
                        <p>Description: ${project.description}</p>
                        <p>Due date: ${endDate}</p>
                        ${markAsCompletedButtonHTML}
                     </div>
               </div>
            `;
            projectsContainer.insertAdjacentHTML('beforeend', projectHTML);
        });
    }

    if(heading === 'tasks'){
        data.tasks.forEach((task,index) => {
            let markAsCompletedButtonHTML = '';
            // Display the "Mark as completed" button only if the project is not already completed
            if (sub !== 'completed') {
                markAsCompletedButtonHTML = `<button type="button" id='${task._id}' class="btn complete-task-button btn-success">Mark as finished</button>`;
            }
            const dueDate = new Date(task.end_date);
            const year = dueDate.getFullYear();
            const month = String(dueDate.getMonth() + 1).padStart(2, '0');
            const day = String(dueDate.getDate()).padStart(2, '0');
            const endDate =  `${day}.${month}.${year}`

            const usersHTML = task.members.map(user => `<span class="m-0 p-0">${user.username}</span>`).join(''); // Generate <p> elements for each task
            const projectHTML = `
                
                
                <div id="${task._id}"  class="d-flex  justify-content-between project-container  mt-3 d-flex bg-white shadow-sm align-items-center px-3">
                        <div class="project-title p-2 font-weight-bold">
                            <p class="m-0 d-inline-block  text-truncate">${task.task_name}</p>
                        </div>
                   
                        <div class="p-2 text-muted ">
                            
                             <button type="button" class="btn" data-toggle="modal" data-target="#addMember${index}">
                                <i  class="fa-solid  text-muted fa-plus"></i>
                            </button>

                        <div class="modal fade" id="addMember${index}" tabindex="-1" aria-labelledby="addMember${index}Label" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                        
                                    <div class="modal-body">
                                        <div class="p-3 justify-content-center container">
                                            <form id="add-member-form-${index}">
                                            <label  for="">Add member to task</label>
                                                <div class="form-group">
                                                    <input type="text" name="username" class="form-control" placeholder="Username">
                                                </div>
                                                
                                               
                        
                                                <div class="row">
                                                    <div class="col">
                                                        <button type="submit"  id="add-member-${index}" data-id="${task._id}" class="btn add-member btn-primary btn-block">Add</button>
                                                    </div>
                                                    <div class="col">
                                                        <button type="button"  class="btn btn-block btn-secondary" data-dismiss="modal">Close</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                        
                                    </div>
                        
                                </div>
                            </div>
                        </div>
                            
                            

                            <button onclick="deleteTask('${task._id}')" class="btn bg-white text-muted text-left " type="button">
                                <i  data-id="${task._id}" class="delete-project fa-solid py-2 fa-trash"></i>
                            </button>
                            
                            <button class="btn bg-white text-muted text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                                <i id="${task._id}" class="fa-solid delete-project fa-ellipsis py-2"></i>
                            </button>
                            
                            
                            
                            
                        </div> 
                        
                        
                </div>
               <div id="collapse${index}" class="collapse m-0 p-0  bg-white" aria-labelledby="heading${index}" data-parent="#accordionExample">
                     <div class="card-body border-top ">
                        <p>Task members: ${usersHTML}</p>                                    
                        <p>Description: ${task.description}</p>
                        <p>Due date: ${endDate}</p>
                        ${markAsCompletedButtonHTML}
                     </div>
                     </div>
               </div>
         
            `;
            projectsContainer.insertAdjacentHTML('beforeend', projectHTML);
        });
    }

    if(heading === 'users'){


        let userHTML
        let position = data.position
        //console.log(data.allUsers[0].supervisors[0].username)

        data.allUsers.forEach((user,index) =>{
            const supervisorsHTML = user.supervisors.map(user => `<span class="m-0 p-0">${user.username}</span>`).join(''); // Generate <p> elements for each task
            const subordinatesHTML = user.subordinates.map(user => `<span class="m-0 p-0">${user.username}</span>`).join(''); // Generate <p> elements for each task
            userHTML =

                `
        <div id="${user._id}" class="d-flex justify-content-between project-container mt-3 d-flex bg-white shadow-sm align-items-center px-3">
            <div class="project-title p-2 font-weight-bold">
                <p class="m-0 d-inline-block text-truncate">${user.username}</p>
            </div>
            <div class="p-2 text-muted ">
                ${position === 1 ? `
                    <button onClick="deleteUser('${user.username}')" class="btn bg-white text-muted text-left " type="button">
                        <i  data-id="${user._id}" class="delete-project fa-solid py-2 fa-trash"></i>
                    </button>` : ''}
                <button class="btn bg-white text-muted text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                    <i id="${user._id}" class="fa-solid delete-project fa-ellipsis py-2"></i>
                </button>
            </div>
        </div>

        <div id="collapse${index}" class="collapse m-0 p-0 bg-white" aria-labelledby="heading${index}" data-parent="#accordionExample">
            <div class="card-body border-top ">
                <p>Full name: ${user.firstname} ${user.lastname}</p>
                <p>Email: ${user.email}</p>
                <p>Supervisors: ${supervisorsHTML}</p>
                <p>Subordinates: ${subordinatesHTML}</p>
                
            </div>
        </div>
        `
            projectsContainer.insertAdjacentHTML('beforeend', userHTML);
        })




    }



    if(style){
        const projectElements = document.querySelectorAll('.project-container');

        projectElements.forEach(element => {
            // Split the classes and add each separately
            style.split(' ').forEach(cls => {
                element.classList.add(cls);
            });
        });
    }

}





async function projectsReport() {

    try {
        const response = await fetch('/project/UserProjectsJson/1/1'); //get ruta, 0 -> retrieve user.projects array
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();





        const projectsContainer = document.querySelector('.main-container'); //ispraznis div sa projektima
        projectsContainer.innerHTML = ''; // Clear existing projects
        let projectHTML = `
                             <table id="tabela" class="mt-5 table-sm   border table report-project-table table-striped">
                         
                              <thead class="thead-dark">
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Project</th>
                                  <th scope="col">Project Tasks</th>
                                  <th scope="col">Time spent</th>
                                </tr>
                              </thead>
                              <tbody id="table-body"> 

                              </tbody>
                            </table>    
                            <button type="button" class="btn bg-light" onClick="generatePDF()">
                            download <span class="text-danger"><i class="fa-solid fa-xl fa-file-pdf"></i></span> 
                            </button>

                   
                            `;
        projectsContainer.insertAdjacentHTML('beforeend', projectHTML);

        const tableBody = document.querySelector('#table-body');





        for (let index = 0; index < data.projects.length; index++) {
            const project = data.projects[index];
            const resp = await fetch(`/logTime/totalTimeOnProject/1/${project._id}`);
            const time = await resp.json();

            const tasks = project.tasks;
            const tasksHTML = tasks.map(task => `<p class="m-0 p-0">${task.task_name}</p>`).join(''); // Generate <p> elements for each task
            const projectHTML2 = `  
                       <tr>
                          <th scope="row">${index+1}</th>
                          <td>${project.project_name}</td>
                          <td id="row-${index+1}">
                          ${tasksHTML}
                          </td>
                          <td>${time.hours}h ${time.minutes}min</td>
                        </tr>

            `;
            tableBody.insertAdjacentHTML('beforeend', projectHTML2);
        };

    } catch (error) {
        console.error('Fetch error:', error);
        // Handle errors, display error messages, or perform fallback actions
    }

}

async function tasksReport() {

    try {
        const response = await fetch('/task/getAllManagingTasks/1'); //get ruta, 0 -> retrieve user.projects array
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
       const projectsContainer = document.querySelector('.main-container'); //ispraznis div sa projektima
        projectsContainer.innerHTML = ''; // Clear existing projects
        let projectHTML = `
                             <table id="tabela" class="mt-5 table-sm   border table report-project-table table-striped">
                         
                              <thead class="thead-dark">
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Task</th>
                                  <!--<th scope="col">Project Tasks</th>-->
                                  <th scope="col">Time spent</th>
                                </tr>
                              </thead>
                              <tbody id="table-body"> 

                              </tbody>
                            </table> 
                             <button type="button" class="btn bg-light" onClick="generatePDF()">
                            download <span class="text-danger"><i class="fa-solid fa-xl fa-file-pdf"></i></span> 
                            </button>                        
                            `;
        projectsContainer.insertAdjacentHTML('beforeend', projectHTML);

        const tableBody = document.querySelector('#table-body');





        for (let index = 0; index < data.tasks.length; index++) {
            const resp = await fetch(`/logTime/totalTimeOnTask/1/${data.tasks[index]._id}`);
            const time = await resp.json();
            const projectHTML2 = `  
                       
                        
                         <tr>
                              <th scope="row">${index+1}</th>
                              <td>${data.tasks[index].task_name}</td>
                              <td>${time.hours}h ${time.minutes}min</td>
                            </tr>

            `;
            tableBody.insertAdjacentHTML('beforeend', projectHTML2);
        }

    } catch (error) {
        console.error('Fetch error:', error);
        // Handle errors, display error messages, or perform fallback actions
    }

}

async function usersReport() {

    try {
        const response = await fetch('/user/getAllUsers'); //get ruta

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }




        const data = await response.json();
        console.log(data)

        const projectsContainer = document.querySelector('.main-container'); //ispraznis div sa projektima
        projectsContainer.innerHTML = ''; // Clear existing projects
        let projectHTML = `
                             <table id="tabela" class="mt-5 table-sm    border table report-project-table table-striped">
                         
                              <thead class="thead-dark">
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">User</th>
                                  <th scope="col">Project</th>
                                  <th scope="col">Task</th>
                                  <th scope="col">Manager</th>
                                </tr>
                              </thead>
                              <tbody id="table-body"> 

                              </tbody>
                            </table>      
                            <button type="button" class="btn bg-light" onClick="generatePDF()">
                            download <span class="text-danger"><i class="fa-solid fa-xl fa-file-pdf"></i></span> 
                            </button>                      
                            `;
        projectsContainer.insertAdjacentHTML('beforeend', projectHTML);

        const tableBody = document.querySelector('#table-body');

        let brojac = 0
        for (let i = 0; i < data.allUsers.length; i++) {
            const user = data.allUsers[i];

            for (let j = 0; j < user.tasks.length; j++) {
                const task = user.tasks[j];

                brojac++
                const username = user.username;
                const projectName = task.project_id.project_name;
                const managerName = task.project_id.manager.username;
                const taskName = task.task_name
                const projectHTML = `
                <tr>
                    <th scope="row">${brojac}</th>
                    <td>${username}</td>
                    <td>${projectName}</td>
                    <td>${taskName}</td>
                    <td>${managerName}</td>
                </tr>
            `;

                tableBody.insertAdjacentHTML('beforeend', projectHTML);
            }
        }

    } catch (error) {
        console.error('Fetch error:', error);
        // Handle errors, display error messages, or perform fallback actions
    }

}

async function usersActivity() {

    try {
        const response = await fetch('/user/getUserActivity'); //get ruta

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }




        const data = await response.json();


        const projectsContainer = document.querySelector('.main-container'); //ispraznis div sa projektima
        projectsContainer.innerHTML = ''; // Clear existing projects
        let projectHTML = `
                             <table id="tabela" class="mt-5 table-sm    border table report-project-table table-striped">
                         
                              <thead class="thead-dark">
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">User</th>
                                  <th scope="col">Activity</th>
                                </tr>
                              </thead>
                              <tbody id="table-body"> 

                              </tbody>
                            </table>      
                            <button type="button" class="btn bg-light" onClick="generatePDF()">
                            download <span class="text-danger"><i class="fa-solid fa-xl fa-file-pdf"></i></span> 
                            </button>                      
                            `;
        projectsContainer.insertAdjacentHTML('beforeend', projectHTML);

        const tableBody = document.querySelector('#table-body');

        let brojac = 1
        for (let i = 0; i < data.allUsers.length; i++) {
            const user = data.allUsers[i];
            const username = user.username;
            const projectHTML = `
                <tr>
                    <th scope="row">${brojac}</th>
                    <td>${username}</td>
                    <td>active</td>

                </tr>
            `;

                tableBody.insertAdjacentHTML('beforeend', projectHTML);

        }

    } catch (error) {
        console.error('Fetch error:', error);
        // Handle errors, display error messages, or perform fallback actions
    }

}



const start = async()=>{
    try {
        //default Projects -> all
        await getFilters('projects')
        await fetchAndDisplayData('projects','all');

        document.addEventListener('click', async function(event) {
            const clickedElement = event.target;

            event.preventDefault();
            //main header Projects clicked
            if (clickedElement.id === 'managing-projects') {

                await getFilters('projects');
                await fetchAndDisplayData('projects','all');
                //sub header all clicked
            }
            else if (clickedElement.id === 'all-managing-projects') {

                await fetchAndDisplayData('projects','all');
                //sub header behind clicked
            }
            else if (clickedElement.id === 'behind-projects') {

                await fetchAndDisplayData('projects','behind');
                //sub header completed clicked
            }
            else if (clickedElement.id === 'completed-projects') {

                await fetchAndDisplayData('projects','completed');
                //sub header report clicked
            }
            else if (clickedElement.id === 'projects-report') {

                await projectsReport()
            }
            else if (clickedElement.id === 'managing-tasks') {

                await getFilters('tasks');
                await fetchAndDisplayData('tasks','all')
            }
            else if (clickedElement.id === 'all-managing-tasks') {

                //await getFilters('tasks');
                await fetchAndDisplayData('tasks','all')
            }
            else if (clickedElement.id === 'behind-tasks') {

                //await getFilters('tasks');
                await fetchAndDisplayData('tasks','behind')
            }
            else if (clickedElement.id === 'completed-tasks') {

                //await getFilters('tasks');
                await fetchAndDisplayData('tasks','completed')
            }
            else if (clickedElement.id === 'create-project') {

                await createProject()
            }
            else if (clickedElement.id === 'tasks-report') {
                await tasksReport()
            }
            else if (clickedElement.id === 'users-report') {
                await usersReport()
            }
            else if (clickedElement.id === 'user-activity') {
                await usersActivity()
            }
            else if (event.target.classList.contains('create-task')) {
                await createTask(clickedElement.id)
            }
            else if (event.target.classList.contains('add-member')) {
                await addMember(clickedElement.id)
            }
            else if (clickedElement.id === 'managing-users') {
                await getFilters('users')
                await fetchAndDisplayData('users', 'all')
            }
            else if (event.target.classList.contains('navL')) {
                window.location.href = clickedElement.getAttribute('href')
            }
            else if (clickedElement.id === 'create-user') {
                await createUser()
            }
            else if (clickedElement.id === 'all-managing-users') {
                await fetchAndDisplayData('users','all')
            }
            else if (event.target.classList.contains('complete-project-button')) {
                await completeProject(clickedElement.id)
            }
            else if (event.target.classList.contains('complete-task-button')) {
                await completeTask(clickedElement.id)
            }
        });




        const navItems = document.querySelectorAll(".main-header");

        navItems.forEach(item => {
            item.addEventListener("click", () => {
                navItems.forEach(navItem => navItem.classList.remove("font-weight-bold"));
                item.classList.add("font-weight-bold");


            });
        });








    }
    catch (error) {
        console.error('Fetch error:', error);
        // Handle errors, display error messages, or perform fallback actions
    }
}





document.addEventListener('DOMContentLoaded',  function() {
    start();
});