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



document.addEventListener('DOMContentLoaded', function() {

// behind tasks
    const behindButton = document.getElementById('behind-tasks'); //dugme za projekte koji kasne
    behindButton.addEventListener('click', async function(event) {
        event.preventDefault();

        try {
            const response = await fetch(`/task/getBehindTasks/0`); //get ruta
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const tasksContainer = document.querySelector('.main-container'); //ispraznis div sa projektima
            tasksContainer.innerHTML = ''; // Clear existing projects


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
                                <form action="/logTime/${task._id}" method="post">
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



// completed tasks

    const completedButton = document.getElementById('completed-tasks'); //dugme za projekte koji kasne
    completedButton.addEventListener('click', async function(event) {
        event.preventDefault();
        try {
            const response = await fetch(`/task/getCompletedTasks/0`); //get ruta
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const tasksContainer = document.querySelector('.main-container'); //ispraznis div sa projektima
            tasksContainer.innerHTML = ''; // Clear existing projects

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


//report
    const taskReportButton = document.getElementById('tasks-report'); //dugme za projekte koji kasne
    taskReportButton.addEventListener('click', async function(event) {
        event.preventDefault();

        try {
            const response = await fetch(`/task/getAllTasks/1`); //get ruta
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();



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


