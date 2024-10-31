const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUL = document.getElementById("todo-list");

let allTodos = getTodos();
updateTodoList();

// Listen for form submission to add a new to-do item
todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addToDo();
});

function addToDo() {
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    const todoObject = {
      text: todoText,
      completed: false,
    };
    allTodos.push(todoObject); // Add new to-do to the array
    console.log("Adding To-Do:", todoObject); // Log to verify item is created
    updateTodoList(); // Refresh the displayed list
    saveTodos(); // Save the updated list to localStorage
    todoInput.value = ""; // Clear the input field
  } else {
    console.warn("No text entered for To-Do item."); // Warn if input is empty
  }
}

// This function updates the visible list in the DOM
function updateTodoList() {
  todoListUL.innerHTML = ""; // Clear current items in the list
  allTodos.forEach((todo, todoIndex) => {
    const todoItem = createTodoItem(todo, todoIndex); // Pass both the text and index
    todoListUL.append(todoItem); // Append the created item to the list
  });
}

// Create an individual to-do list item element
function createTodoItem(todo, todoIndex) {
  const todoId = "todo-" + todoIndex; // Unique ID for each item
  const todoLI = document.createElement("li");
  todoLI.className = "todo";

  todoLI.innerHTML = `
    <input type="checkbox" id="${todoId}">
    <label for="${todoId}" class="custom-checkbox">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="transparent">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
      </svg>
    </label>
    <label for="${todoId}" class="todo-text">${todo.text}</label>
    <button class="delete-button">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
      </svg>
    </button>`;

  const deleteButton = todoLI.querySelector(".delete-button");
  deleteButton.addEventListener("click", () => {
    deleteTodoItem(todoIndex);
  });

  const checkbox = todoLI.querySelector("input");
  checkbox.addEventListener("change", () => {
    allTodos[todoIndex].completed = checkbox.checked;
    saveTodos();
  });
  checkbox.checked = todo.completed;

  return todoLI; // Return the created to-do list item element
}

// Delete a to-do item by index
function deleteTodoItem(todoIndex) {
  allTodos = allTodos.filter((_, i) => i !== todoIndex); // Corrected typo
  updateTodoList();
  saveTodos();
}

// Save the to-dos to localStorage
function saveTodos() {
  const todosJson = JSON.stringify(allTodos); // Convert to JSON string
  localStorage.setItem("todos", todosJson); // Store the JSON string in localStorage
  console.log("Todos saved:", todosJson); // Log saved items
}

// Retrieve the to-dos from localStorage
function getTodos() {
  try {
    const todos = localStorage.getItem("todos");
    return todos ? JSON.parse(todos) : [];
  } catch (error) {
    console.error("Error parsing todos from localStorage:", error);
    // Clear the corrupt data to reset the app
    localStorage.removeItem("todos");
    return [];
  }
}
