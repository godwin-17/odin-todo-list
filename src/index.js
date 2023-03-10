import '../src/style.css';

const asideBtns = document.querySelectorAll(".aside-btn");
const addProject = document.querySelector("#add-project");
const projectPopup = document.querySelector("#project-popup");
const closeProject = document.querySelector("#close-popup");

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

closeProject.addEventListener("click", () => {
  projectPopup.style.display = "none";
})