import '../src/style.css';
import {Todo, Project, AllProjects} from './modules/classes.js';
import {asideBtns, addProject, projectPopup, closeProjectPopup, addTodo, todoPopup, closeTodoPopup, calendarProjects, sidebar, main, projectInput, todoInputTitle, todoInputDescription, todoInputDate} from './modules/dom.js';

const allProjects = new AllProjects(); // Creating an Array of all projects

// Setting up default Project and Todo
const DefaultProject = new Project("Default");
const DefaultTodo = new Todo("Example", "This is an example of a todo.", "2023-03-11", DefaultProject);
DefaultProject.addTodo(DefaultTodo);
allProjects.addProject(DefaultProject);


let currentProject = null;

function displayDefaultProject() {
  const newProject = document.createElement("div");
  newProject.classList.add("project-item");
  newProject.innerHTML = `${DefaultProject.name}`;

  setCurrentProject(DefaultProject);
  calendarProjects.insertAdjacentElement("afterend", newProject);
}

displayDefaultProject();

function displayDefaultTodo(defaultTodo) {
  main.innerHTML += `
  <div class="todo-item">
    <div class="todo-details">
      <div class="todo-title">${defaultTodo.title}</div>
      <div class="todo-description">${defaultTodo.description}</div>
    </div>

    <div class="todo-details-2">
      <input type="date" name="todo-date" class="todo-date" value=${defaultTodo.date}>

      <div class="delete-todo">
        &times;
      </div>
    </div>
  </div>
  `;
}
displayDefaultTodo(DefaultTodo);

function setCurrentProject (projectName) {
  currentProject = projectName.name;
}

// Set Data Attribute
function setDataAttribute() {
  const projects = document.querySelectorAll(".project-item");
  projects.forEach(project => {
    project.dataset.project = project.textContent;
  });
}

setDataAttribute();

// Set Current project
sidebar.addEventListener("click", e => {
  if (e.target.classList.contains('project-item')) {
    const project = e.target.dataset.project;

    currentProject = project;

    console.log(`Current project: ${currentProject}`);
  }
});

asideBtns.forEach(btn => {
  btn.addEventListener("click", () => {

    asideBtns.forEach(btns => {
      btns.classList.remove("active-btn");
    });

    btn.classList.add("active-btn");
    
  });
});

addProject.addEventListener("click", () => {
  projectPopup.style.display = "block";
});

// TO CREATE A PROJECT
projectPopup.addEventListener("submit", e => {
  e.preventDefault();

  const myProject = new Project(projectInput.value);
  allProjects.addProject(myProject);

  const newProject = document.createElement("div");
  newProject.classList.add("project-item");
  newProject.innerHTML = `${myProject.name}`;

  setCurrentProject(myProject);

  calendarProjects.insertAdjacentElement("afterend", newProject);
  console.log("Project Created", myProject);
  console.log("CURRENT", currentProject);
  
  setDataAttribute();
  projectPopup.style.display = "none";
});

closeProjectPopup.addEventListener("click", () => {
  projectPopup.style.display = "none";
});

addTodo.addEventListener("click", () => {
  todoPopup.style.display = "block";
});

// TO CREATE A TODO
todoPopup.addEventListener("submit", e => {
  e.preventDefault();

  if (!currentProject) {
    alert("Can't create a todo, no project selected.");
    return;
  }

  const project = allProjects.projects.find(p => p.name === currentProject);

  const todo = new Todo(todoInputTitle.value, todoInputDescription.value, todoInputDate.value, project);
  project.addTodo(todo); // Add the todo to the project

  main.innerHTML += `
  <div class="todo-item">
    <div class="todo-details">
      <div class="todo-title">${todo.title}</div>
      <div class="todo-description">${todo.description}</div>
    </div>

    <div class="todo-details-2">
      <input type="date" name="todo-date" class="todo-date" value=${todo.date}>

      <div class="delete-todo">
        &times;
      </div>
    </div>
  </div>
  `;
  console.log("Todo", todo);

  todoPopup.style.display = "none";
});

closeTodoPopup.addEventListener("click", () => {
  todoPopup.style.display = "none";
});