class Todo {
  static counter = 0;
  constructor (title, description, date, project) {
    this.id = ++Todo.counter;
    this.title = title;
    this.description = description;
    this.date = date;
    this.project = project;
  }
}

class Project {
  constructor (name) {
    this.name = name;
    this.todos = [];
  }
  
  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(todo) {
    const index = this.todos.indexOf(todo);
    if (index > -1) {
      this.todos.splice(index, 1);
    }
  }
}

class AllProjects {
  constructor () {
    this.name = "All Projects";
    this.projects = [];
  }

  addProject(project) {
    this.projects.push(project);
  }

  removeProject(project) {
    const index = this.projects.indexOf(project);
    if (index > - 1) {
      this.projects.splice(index, 1);
    }
  }
}

export {Todo, Project, AllProjects};