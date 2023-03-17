import '../src/style.css';
import { Todo, Project, AllProjects} from './modules/classes.js';
import { asideBtns, addProject, projectPopup, closeProjectPopup, addTodo, todoPopup, closeTodoPopup, calendarProjects, sidebar, main, todoItemsContainer, projectInput, todoInputTitle, todoInputDescription, todoInputDate, mainTitleText, deleteProjectButton } from './modules/dom.js';
import { format, isToday, parseISO, isThisWeek, isThisMonth } from 'date-fns';
import { parse, stringify, toJSON, fromJSON } from 'flatted';


let allProjects = new AllProjects(); // Creating an Array of all projects

// Setting up default Project and Todo
const DefaultProject = new Project("Default");
const DefaultTodo = new Todo("Example", "This is an example of a todo.", "2023-03-11", DefaultProject);
DefaultProject.addTodo(DefaultTodo);
allProjects.addProject(DefaultProject);

let currentProject = null;
loadFromLocalStorage();

function displayDefaultProject() {
  const newProject = document.createElement("div");
  newProject.classList.add("project-item");
  newProject.innerHTML = `${DefaultProject.name}`;

  setCurrentProject(DefaultProject);
  calendarProjects.insertAdjacentElement("afterend", newProject);
}

// displayDefaultProject();

function displayDefaultTodo(defaultTodo) {
  todoItemsContainer.innerHTML += `
  <div class="todo-item" data-todo-id=${defaultTodo.id}>
    <div class="todo-details">
      <div class="todo-title">${defaultTodo.title}</div>
      <div class="todo-description">${defaultTodo.description}</div>
    </div>

    <div class="todo-details-2">
      <div class="todo-date">${format(new Date(defaultTodo.date), 'do MMMM yyyy')}</div>

      <div class="delete-todo">
        &times;
      </div>
    </div>
  </div>
  `;
}
// displayDefaultTodo(DefaultTodo);

function setCurrentProject (projectName) {
  currentProject = projectName.name;
}

mainTitleText.textContent = currentProject;

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

  if (projectInput.value.trim() === "") {
    alert("Project name can't be empty");
    return;
  }

  const projectExists = allProjects.projects.some(project => {
    return project.name.trim() === projectInput.value.trim();
  });

  if (projectExists) {
    alert("Project already exists!!!");
    return;
  }

  const myProject = new Project(projectInput.value);
  allProjects.addProject(myProject);

  const newProject = document.createElement("div");
  newProject.classList.add("project-item");
  newProject.innerHTML = `${myProject.name}`;

  setCurrentProject(myProject);

  calendarProjects.insertAdjacentElement("afterend", newProject);

  setDataAttribute();

  todoItemsContainer.innerHTML = "";

  mainTitleText.textContent = myProject.name;

  projectPopup.style.display = "none";
  projectInput.value = "";
  saveToLocalStorage();
});

// TO DELETE A PROJECT
deleteProjectButton.addEventListener("click", () => {
  if (!currentProject) {
    alert("No project selected!");
    return;
  }

  const project = allProjects.projects.find(p => p.name === currentProject);
  allProjects.removeProject(project);

  document.querySelector(`[data-project="${currentProject}"]`).remove();
  
  mainTitleText.textContent = "";
  todoItemsContainer.innerHTML = "";
  currentProject = null;
  saveToLocalStorage();
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

  todoItemsContainer.innerHTML += `
  <div class="todo-item" data-todo-id=${todo.id}>
    <div class="todo-details">
      <div class="todo-title">${todo.title}</div>
      <div class="todo-description">${todo.description}</div>
    </div>

    <div class="todo-details-2">
      <div class="todo-date">${format(new Date(todo.date), 'do MMMM yyyy')}</div>

      <div class="delete-todo">
        &times;
      </div>
    </div>
  </div>`;

  todoPopup.style.display = "none";
  todoInputTitle.value = "";
  todoInputDescription.value = "";
  todoInputDate.value = "";
  saveToLocalStorage();
});

// Delete todo
todoItemsContainer.addEventListener("click", e => {

  const deleteButton = e.target.closest(".delete-todo");

  if (deleteButton) {
  const todoItem = deleteButton.closest(".todo-item");
  const clickedTodoId = parseInt(todoItem.getAttribute("data-todo-id"));
  const project = allProjects.projects.find(p => p.name === currentProject);
  const clickedTodo = project.todos.find(todo => todo.id === clickedTodoId);
  project.removeTodo(clickedTodo);

  todoItem.remove();
  }
  saveToLocalStorage();
});

closeTodoPopup.addEventListener("click", () => {
  todoPopup.style.display = "none";
});

// Filter Projects Todos
sidebar.addEventListener("click", e => {
  if (e.target.classList.contains("project-item")) {

    const project = allProjects.projects.find(p => p.name === currentProject);

    mainTitleText.textContent = project.name;
    todoItemsContainer.innerHTML = "";

    project.todos.forEach(todo => {
      todoItemsContainer.innerHTML += `<div class="todo-item" data-todo-id=${todo.id}>
      <div class="todo-details">
        <div class="todo-title">${todo.title}</div>
        <div class="todo-description">${todo.description}</div>
      </div>
  
      <div class="todo-details-2">
        <div class="todo-date">${format(new Date(todo.date), 'do MMMM yyyy')}</div>
  
        <div class="delete-todo">
          &times;
        </div>
      </div>
    </div>`;
    });
  }
});

sidebar.addEventListener("click", e => {
  if (e.target.id === "today") {
    getTodayTodos();
  } else if (e.target.id === "week") {
    getWeekTodos();
  } else if (e.target.id === "month") {
    getMonthTodos();
  } else if (e.target.id === "all") {
    getAllTodos();
  }

});

function getAllTodos() {
  const project = allProjects.projects;
  todoItemsContainer.innerHTML = "";
  mainTitleText.textContent = "All Todos";

  project.forEach(p => {
    const todo = p.todos;
    todo.forEach(t => {
      todoItemsContainer.innerHTML += `
      <div class="todo-item" data-todo-id=${t.id}>
        <div class="todo-details">
          <div class="todo-title">${t.title}</div>
          <div class="todo-description">${t.description}</div>
        </div>

        <div class="todo-details-2">
          <div class="todo-date">${format(new Date(t.date), 'do MMMM yyyy')}</div>
        </div>
      </div>
    `;
    });
  });
}

function getMonthTodos() {
  const project = allProjects.projects;
  todoItemsContainer.innerHTML = "";
  mainTitleText.textContent = "Month Todos";

  project.forEach(p => {
    const todo = p.todos;
    todo.forEach(t => {
      if (isThisMonth(parseISO(t.date))) {
        todoItemsContainer.innerHTML += `
        <div class="todo-item" data-todo-id=${t.id}>
          <div class="todo-details">
            <div class="todo-title">${t.title}</div>
            <div class="todo-description">${t.description}</div>
          </div>

          <div class="todo-details-2">
            <div class="todo-date">${format(new Date(t.date), 'do MMMM yyyy')}</div>
          </div>
        </div>
      `;
      }
    });
  });
}

function getWeekTodos() {
  const project = allProjects.projects;
  todoItemsContainer.innerHTML = "";
  mainTitleText.textContent = "Week Todos";

  project.forEach(p => {
    const todo = p.todos;
    todo.forEach(t => {
      if (isThisWeek(parseISO(t.date), {weekStartsOn: 1})) {
        todoItemsContainer.innerHTML += `
        <div class="todo-item" data-todo-id=${t.id}>
          <div class="todo-details">
            <div class="todo-title">${t.title}</div>
            <div class="todo-description">${t.description}</div>
          </div>

          <div class="todo-details-2">
            <div class="todo-date">${format(new Date(t.date), 'do MMMM yyyy')}</div>
          </div>
        </div>
      `;
      }
    });
  });
} 

function getTodayTodos() {
  const project = allProjects.projects;
  todoItemsContainer.innerHTML = "";
  mainTitleText.textContent = "Today Todos";

  project.forEach(p => {
    const todo = p.todos;
    todo.forEach(t => {
      
      if (isToday(parseISO(t.date))) {
        todoItemsContainer.innerHTML += `
          <div class="todo-item" data-todo-id=${t.id}>
            <div class="todo-details">
              <div class="todo-title">${t.title}</div>
              <div class="todo-description">${t.description}</div>
            </div>

            <div class="todo-details-2">
              <div class="todo-date">${format(new Date(t.date), 'do MMMM yyyy')}</div>
            </div>
          </div>
        `;
      }
    });
  })
}

function saveToLocalStorage() {
  const projects = allProjects;

  const JSON = localStorage.setItem("Projects", stringify(projects));

  const data = localStorage.getItem("Projects");

  const parsedData = parse(data);
}

saveToLocalStorage();

function loadFromLocalStorage() {

  const projectJSON = localStorage.getItem('Projects');
  
  if (projectJSON) {
    const projectData = parse(projectJSON);
       
    allProjects = projectData;

    // Convert objects to instances of Project and AllProjects
    allProjects = Object.assign(new AllProjects(), projectData);
    allProjects.projects = allProjects.projects.map(projectItem => {
      const project = Object.assign(new Project(), projectItem);
      project.todos = project.todos.map(todoItem => Object.assign(new Todo(), todoItem));
      return project;
    });

    // Set prototype of instances to the classes
    Object.setPrototypeOf(allProjects, AllProjects.prototype);
    allProjects.projects.forEach(project => Object.setPrototypeOf(project, Project.prototype));

    allProjects.projects.forEach(project => {
      const newProject = document.createElement('div'); 
      newProject.classList.add('project-item');
      newProject.innerHTML = `${project.name}`;
      calendarProjects.insertAdjacentElement('afterend', newProject);
      setDataAttribute();

      project.todos.forEach(todo => {
        displayTodoItem(todo);
      });
    })
  } else {
    displayDefaultProject();
    displayDefaultTodo(DefaultTodo);
  }
}

function displayTodoItem(todo) {
  todoItemsContainer.innerHTML += `
  <div class="todo-item" data-todo-id=${todo.id}>
    <div class="todo-details">
      <div class="todo-title">${todo.title}</div>
      <div class="todo-description">${todo.description}</div>
    </div>

    <div class="todo-details-2">
      <div class="todo-date">${format(new Date(todo.date), 'do MMMM yyyy')}</div>
    </div>
  </div>`;
}