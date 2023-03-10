import '../src/style.css';

const asideBtns = document.querySelectorAll(".aside-btn");
const addProject = document.querySelector("#add-project");
const projectPopup = document.querySelector("#project-popup");
const closeProjectPopup = document.querySelector("#close-popup");
const addTodo = document.querySelector("#add-todo");
const todoPopup = document.querySelector("#todo-popup");
const closeTodoPopup = document.querySelector("#close-todo");

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

projectPopup.addEventListener("submit", e => {
  e.preventDefault();
  // -------------------------------
  projectPopup.style.display = "none";
});

closeProjectPopup.addEventListener("click", () => {
  projectPopup.style.display = "none";
});

addTodo.addEventListener("click", () => {
  todoPopup.style.display = "block";
});

todoPopup.addEventListener("submit", e => {
  e.preventDefault();
  // -------------------
  todoPopup.style.display = "none";
});

closeTodoPopup.addEventListener("click", () => {
  todoPopup.style.display = "none";
});