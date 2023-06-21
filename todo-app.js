const key = new URL(document.URL);
const addToLocalStorage = (value) => {
  const item = localStorage.getItem(key);

  const todos = JSON.parse(item);
  if (Array.isArray(todos)) {
    todos.push(value);
    localStorage.setItem(key, JSON.stringify(todos));
    return;
  }
};

const initLocalStorage = () => {
  const key = new URL(document.URL);
  const item = localStorage.getItem(key);
  if (!item) {
    const defaultTodos = [
      {
        id: crypto.randomUUID(),
        text: "todo item example1",
        isDone: false,
      },
      {
        id: crypto.randomUUID(),
        text: "todo item example2",
        isDone: true,
      },
      {
        id: crypto.randomUUID(),
        text: "todo item example3",
        isDone: false,
      },
    ];
    localStorage.setItem(key, JSON.stringify(defaultTodos));
  }
};

function createTodoApp(container, title) {
  let appTitle = document.createElement("h2");
  appTitle.innerHTML = title;
  container.append(appTitle);

  let form = document.createElement("form");
  let input = document.createElement("input");
  let buttonWrapper = document.createElement("div");
  let button = document.createElement("button");

  input.placeholder = "Введите название дела";
  button.textContent = "Добавить дело";

  form.classList.add("input-group", "mb-3");
  input.classList.add("form-control");
  buttonWrapper.classList.add("input-group-append");
  button.classList.add("btn", "btn-primary");
  button.classList.add("enter-btn");

  container.append(form);
  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);

  button.disabled = true;
  input.addEventListener("input", () => {
    button.disabled = input.value === "";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    button.disabled = true;
    const todo = {
      id: crypto.randomUUID(),
      text: input.value,
      isDone: false,
    };
    createTodoItem(todo);
    input.value = "";
  });

  function createTodoItem(todo, state) {
    let item = document.createElement("li");
    item.classList.add("list");
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    if (state) {
      item.classList.toggle("list-group-item-success");
    }
    item.textContent = todo.text;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    deleteButton.classList.add("btn", "btn-danger");

    doneButton.textContent = "Готово";
    deleteButton.textContent = "Удалить";

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);

    item.append(buttonGroup);
    container.append(item);

    const jsonTodos = localStorage.getItem(key);
    const todos = JSON.parse(jsonTodos);

    doneButton.addEventListener("click", function () {
      const jsonTodos = localStorage.getItem(key);
      const todos = JSON.parse(jsonTodos);
      todos.forEach((elem) => {
        if (elem.id === todo.id) {
          elem.isDone = item.classList.toggle("list-group-item-success");
          localStorage.setItem(key, JSON.stringify(todos));
        }
      });
    });

    deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        const jsonTodos = localStorage.getItem(key);
        const todos = JSON.parse(jsonTodos);
        const filterTodos = todos.filter((elem) => elem.id !== todo.id);
        localStorage.setItem(key, JSON.stringify(filterTodos));
        item.remove();
      }
    });

    const findedTodos = todos.find((item) => {
      return item.id === todo.id;
    });
    if (!findedTodos) {
      addToLocalStorage(todo);
    }
  }

  initLocalStorage();

  const todoItemsJSON = localStorage.getItem(key);
  const todoItems = JSON.parse(todoItemsJSON);

  todoItems.forEach((element) => {
    createTodoItem(element, element.isDone);
    console.log(element);
  });
}
