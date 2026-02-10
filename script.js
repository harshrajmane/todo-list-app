const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("taskCounter");
const clearBtn = document.getElementById("clearAll");

document.addEventListener("DOMContentLoaded", loadTasks);

addBtn.addEventListener("click", addTask);

// ENTER KEY SUPPORT
taskInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addTask();
    }
});

function addTask() {

    const taskText = taskInput.value.trim();

    if(taskText === ""){
        alert("Please enter a task");
        return;
    }

    const tasks = getTasks();

    // PREVENT DUPLICATES
    if(tasks.some(task => task.text === taskText)){
        alert("Task already exists!");
        return;
    }

    const task = {
        text: taskText,
        completed: false,
        time: new Date().toLocaleString()
    };

    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTask(task);
    updateCounter();

    taskInput.value = "";
}

function renderTask(task){

    const li = document.createElement("li");

    if(task.completed){
        li.classList.add("completed");
    }

    li.innerHTML = `
        <span>
            ${task.text}<br>
            <small>${task.time}</small>
        </span>
    `;

    // TOGGLE COMPLETE
    li.addEventListener("click", () => {
        li.classList.toggle("completed");
        updateTaskStatus(task.text);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", (e)=>{
        e.stopPropagation();
        deleteTask(task.text);
        taskList.removeChild(li);
        updateCounter();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function getTasks(){
    return localStorage.getItem("tasks")
        ? JSON.parse(localStorage.getItem("tasks"))
        : [];
}

function loadTasks(){
    const tasks = getTasks();
    tasks.forEach(renderTask);
    updateCounter();
}

function deleteTask(taskText){
    let tasks = getTasks();
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskStatus(taskText){
    const tasks = getTasks();

    tasks.forEach(task=>{
        if(task.text === taskText){
            task.completed = !task.completed;
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCounter(){
    const tasks = getTasks();
    const remaining = tasks.filter(task => !task.completed).length;
    counter.textContent = `You have ${remaining} task(s) remaining`;
}

// CLEAR ALL
clearBtn.addEventListener("click", ()=>{
    if(confirm("Delete all tasks?")){
        localStorage.removeItem("tasks");
        taskList.innerHTML = "";
        updateCounter();
    }
});
