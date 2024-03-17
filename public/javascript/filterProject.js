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



//report for projects
document.addEventListener('DOMContentLoaded', function() {
    const projectReportButton = document.getElementById('project-report'); //dugme za projekte koji kasne

    projectReportButton.addEventListener('click', async function(event) {
        event.preventDefault();

        try {
            const response = await fetch('/project/UserProjectsJson/0/1'); //get ruta, 0 -> retrieve user.projects array
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data.projects)




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
                const resp = await fetch(`/logTime/totalTimeOnProject/0/${project._id}`);
                const time = await resp.json();
                console.log(time)
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
    });
});

//report for each project tasks
document.addEventListener('DOMContentLoaded', function() {
    const projectTaskReportButton = document.getElementById('project-task-report'); //dugme za projekte koji kasne

    projectTaskReportButton.addEventListener('click', async function(event) {
        event.preventDefault();

        try {
            const element = document.querySelector('.wrapper-container'); // Select the element
            const projectId = element.getAttribute('data-id');

            const response = await fetch(`/task/getThisAllTasks/${projectId}/1`); //get ruta
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data.tasks)


            const tasksContainer = document.querySelector('.main-container'); //ispraznis div sa projektima
            tasksContainer.innerHTML = ''; // Clear existing projects
            let projectHTML = `
                                 <table id="tabela" class="mt-5 table-sm   border table report-project-table table-striped">
                             
                                  <thead class="thead-dark">
                                    <tr>
                                      <th scope="col">#</th>
                                      <th scope="col">Task</th>
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
            tasksContainer.insertAdjacentHTML('beforeend', projectHTML);

            const tableBody = document.querySelector('#table-body');





            for (let index = 0; index < data.tasks.length; index++) {
                const task = data.tasks[index];
                const resp = await fetch(`/logTime/totalTimeOnTask/0/${task._id}`);
                const time = await resp.json();

                const projectHTML2 = `  
                           <tr>
                              <th scope="row">${index+1}</th>
                              <td>${task.task_name}</td>
                              <td>${time.hours}h ${time.minutes}min</td>
                            </tr>

                `;
                tableBody.insertAdjacentHTML('beforeend', projectHTML2);
            };



        } catch (error) {
            console.error('Fetch error:', error);
            // Handle errors, display error messages, or perform fallback actions
        }
    });
});

//all projects

document.addEventListener('DOMContentLoaded', function() {
    const allProjectsButton = document.getElementById('all-projects'); //dugme za projekte koji kasne

    allProjectsButton.addEventListener('click', async function(event) {
        event.preventDefault();
        console.log('clickkk')
        try {
            const response = await fetch('/project/UserProjectsJson/0/0'); //get ruta

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const projectsContainer = document.querySelector('.main-container'); //ispraznis div sa projektima
            projectsContainer.innerHTML = ''; // Clear existing projects

            // Iterate through the fetched behind projects and append them to the container
            data.projects.forEach(project => {
                const dueDate = new Date(project.end_date);
                const year = dueDate.getFullYear();
                const month = String(dueDate.getMonth() + 1).padStart(2, '0');
                const day = String(dueDate.getDate()).padStart(2, '0');
                const res =  `${year}-${month}-${day}`
                const projectHTML = `                 
                    <div id="${project._id}" data-id="${project._id}" class="project-container row mt-3 d-flex bg-white shadow-sm align-items-center px-3">
                       <div class="d-flex ">
                        <div class="p-1">
                            <div class="project-title pb-2 font-weight-bold">
                               <p class="m-0 d-inline-block text-truncate" > ${project.project_name}</p>
                            </div>
                            <div class="text-muted members">
                                <p class="m-0">Memebers: ${project.members.length}</p>
                            </div>
                        </div>
                    </div>
                    <div class="due text-muted ml-auto ">
                        <p class="m-0 ">due: ${res}  </p>
                    </div>
                    
                    </div>
                `;
                projectsContainer.insertAdjacentHTML('beforeend', projectHTML);
                addEventListeners();
            });

        } catch (error) {
            console.error('Fetch error:', error);
            // Handle errors, display error messages, or perform fallback actions
        }
    });
});


//behind projects
document.addEventListener('DOMContentLoaded', function() {
    const behindButton = document.getElementById('behind-projects'); //dugme za projekte koji kasne

    behindButton.addEventListener('click', async function(event) {
        event.preventDefault();

        try {
            const response = await fetch('/project/getBehindProjects/0'); //get ruta

           if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const projectsContainer = document.querySelector('.main-container'); //ispraznis div sa projektima
            projectsContainer.innerHTML = ''; // Clear existing projects

            // Iterate through the fetched behind projects and append them to the container
            data.projects.forEach(project => {
                const dueDate = new Date(project.end_date);
                const year = dueDate.getFullYear();
                const month = String(dueDate.getMonth() + 1).padStart(2, '0');
                const day = String(dueDate.getDate()).padStart(2, '0');
                const res =  `${year}-${month}-${day}`
                const projectHTML = `                 
                    <div id="${project._id}" data-id="${project._id}" class="project-container row mt-3 d-flex bg-white shadow-sm align-items-center px-3">
                       <div class="d-flex ">
                        <div class="p-1">
                            <div class="project-title pb-2 font-weight-bold">
                               <p class="m-0 d-inline-block text-truncate" > ${project.project_name}</p>
                            </div>
                            <div class="text-muted members">
                                <p class="m-0">Memebers: ${project.members.length}</p>
                            </div>
                        </div>
                    </div>
                    <div class="due text-muted ml-auto ">
                        <p class="m-0 text-danger">due: ${res}  </p>
                    </div>
                    
                    </div>
                `;
                projectsContainer.insertAdjacentHTML('beforeend', projectHTML);
            });
            addEventListeners();
        } catch (error) {
            console.error('Fetch error:', error);
            // Handle errors, display error messages, or perform fallback actions
        }
    });
});

// behind tasks
document.addEventListener('DOMContentLoaded', function() {
    const behindButton = document.getElementById('behind-tasks'); //dugme za projekte koji kasne

    behindButton.addEventListener('click', async function(event) {
        event.preventDefault();

        const element = document.querySelector('.wrapper-container');

        const projectId = element.getAttribute('data-id');

        try {
            const response = await fetch(`/task/getThisBehindTasks/${projectId}`); //get ruta

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const tasksContainer = document.querySelector('.main-container'); //ispraznis div sa projektima
            tasksContainer.innerHTML = ''; // Clear existing projects
            console.log(data)

            // Iterate through the fetched behind projects and append them to the container
            data.tasks.forEach((task,index) => {
                const dueDate = new Date(task.end_date);
                const year = dueDate.getFullYear();
                const month = String(dueDate.getMonth() + 1).padStart(2, '0');
                const day = String(dueDate.getDate()).padStart(2, '0');
                const res =  `${year}-${month}-${day}`
                const projectHTML = `                 
                     <div class="shadow-sm my-3 p-0">
                <div class="card mx-0 border-0">
                    <div class="card-header py-0 d-flex align-items-center justify-content-between bg-white" id="heading${index}">
                        <div class="d-flex">
                            <div class="p-1">
                                <div class="task-title font-weight-bold">
                                    <p class="m-0">${task.task_name}</p>
                                </div>
                                <div class="text-muted members">
                                    <p class="m-0">Members: ${task.members.length}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <!-- Update data-target and aria-controls attributes -->
                            <button class="btn bg-white text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                                <i class="fa-solid fa-ellipsis p-2"></i>
                            </button>
                        </div>
                    </div>
                    <!-- Update the id attribute for the collapsible content -->
                    <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" data-parent="#accordionExample">
                        <div class="card-body">
                            <div>Task description: ${task.description}</div>
                            <div>hours spent on task:</div>
                            <div class="text-danger">
                                task due: ${res}
                            </div>


                            <div class="mt-2">
                                <form action="/logTime/${task.project_id}/${task._id}" method="post">
                                    <label for="">Log working time: </label>
                                    <div class="form-row">
                                        <div class="col">
                                            <input type="number" class="form-control p-1 py-0 " id="hours" name="hours" min="0" placeholder="hours:">
                                        </div>
                                        <div class="col">
                                            <input type="number" class="form-control p-1 py-0 " id="minutes" name="minutes" min="0"  max="59" placeholder="minutes:">
                                        </div>
                                        <button type="submit" class="btn btn-danger">Submit</button>
                                    </div>
                                </form>


                            </div>

                        </div>
                    </div>
                </div>
            </div>
                `;
                tasksContainer.insertAdjacentHTML('beforeend', projectHTML);
            });

        } catch (error) {
            console.error('Fetch error:', error);
            // Handle errors, display error messages, or perform fallback actions
        }
    });
});

//completed projects
document.addEventListener('DOMContentLoaded', function() {
    const completedButton = document.getElementById('completed-projects');

    completedButton.addEventListener('click', async function(event) {
        event.preventDefault();

        try {
            const response = await fetch('/project/getCompletedProjects/0');

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const projectsContainer = document.querySelector('.main-container');
            projectsContainer.innerHTML = ''; // Clear existing projects

            // Iterate through the fetched behind projects and append them to the container
            data.projects.forEach((project,index) => {
                const dueDate = new Date(project.end_date);
                const year = dueDate.getFullYear();
                const month = String(dueDate.getMonth() + 1).padStart(2, '0');
                const day = String(dueDate.getDate()).padStart(2, '0');
                const res =  `${year}-${month}-${day}`
                const projectHTML = `                 
                    <div id="${project._id}" data-id="${project._id}" class="project-container row mt-3 d-flex bg-white shadow-sm align-items-center px-3">
                       <div class="d-flex ">
                        <div class="p-1">
                            <div class="project-title pb-2 font-weight-bold">
                               <p class="m-0 d-inline-block text-truncate" > ${project.project_name}</p>
                            </div>
                            <div class="text-muted members">
                                <p class="m-0">Memebers: ${project.members.length}</p>
                            </div>
                        </div>
                    </div>
                    <div class="due text-muted ml-auto ">
                        <p class="m-0 text-success">due: ${res}  </p>
                    </div>
                    
                    </div>
                `;
                projectsContainer.insertAdjacentHTML('beforeend', projectHTML);

            });
            addEventListeners();

        } catch (error) {
            console.error('Fetch error:', error);
            // Handle errors, display error messages, or perform fallback actions
        }
    });
});

// completed tasks
document.addEventListener('DOMContentLoaded', function() {
    const behindButton = document.getElementById('completed-tasks'); //dugme za projekte koji kasne

    behindButton.addEventListener('click', async function(event) {
        event.preventDefault();
        const element = document.querySelector('.wrapper-container');
        const projectId = element.getAttribute('data-id');
        try {
            const response = await fetch(`/task/getThisCompletedTasks/${projectId}`); //get ruta
            console.log('radi li')
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const tasksContainer = document.querySelector('.main-container'); //ispraznis div sa projektima
            tasksContainer.innerHTML = ''; // Clear existing projects
            console.log(data)

            // Iterate through the fetched behind projects and append them to the container
            data.tasks.forEach((task,index) => {
                const dueDate = new Date(task.end_date);
                const year = dueDate.getFullYear();
                const month = String(dueDate.getMonth() + 1).padStart(2, '0');
                const day = String(dueDate.getDate()).padStart(2, '0');
                const res =  `${year}-${month}-${day}`
                const projectHTML = `                 
                     <div class="shadow-sm my-3 p-0">
                <div class="card mx-0 border-0">
                    <div class="card-header py-0 d-flex align-items-center justify-content-between bg-white" id="heading${index}">
                        <div class="d-flex">
                            <div class="p-1">
                                <div class="task-title font-weight-bold">
                                    <p class="m-0">${task.task_name}</p>
                                </div>
                                <div class="text-muted members">
                                    <p class="m-0">Members: ${task.members.length}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <!-- Update data-target and aria-controls attributes -->
                            <button class="btn bg-white text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                                <i class="fa-solid fa-ellipsis p-2"></i>
                            </button>
                        </div>
                    </div>
                    <!-- Update the id attribute for the collapsible content -->
                    <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" data-parent="#accordionExample">
                        <div class="card-body">
                            <div>Task description: ${task.description}</div>
                            <div>hours spent on task:</div>
                            <div class="text-success">
                                task due: ${res}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
                `;
                tasksContainer.insertAdjacentHTML('beforeend', projectHTML);
            });

        } catch (error) {
            console.error('Fetch error:', error);
            // Handle errors, display error messages, or perform fallback actions
        }
    });
});

// when project is clicked send this project
const addEventListeners = ()=>{
    const elements = document.getElementsByClassName('project-container');
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function() {

            const divID = elements[i].getAttribute('data-id')
            window.location.href = `/project/getEachProject/${divID}`; // Replace with your desired URL
        });
    }
}

//all
addEventListeners();



