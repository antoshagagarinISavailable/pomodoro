// все const по settings

//html модалки setting
const settingsModal = document.querySelector(".settings-modal");

//settings инпуты
const setPomodoro = document.querySelector("#setPomodoro");
const setQuickBreak = document.querySelector("#setQuickBreak");
const setLongBreak = document.querySelector("#setLongBreak");

//кнопки для settings
const mainSettingsButton = document.querySelector("#mainSettingsButton");
const settingsCloseButton = document.querySelector("#settingsCloseButton");

//слушатели по модалке настроек
mainSettingsButton.addEventListener("click", () => {
  settingsModal.classList.toggle("none");
});
settingsCloseButton.addEventListener("click", () => {
  settingsModal.classList.toggle("none");
});

// все const по tasks

//tasks инпуты
const newTodoText = document.querySelector("#newTodoText");
const newTodoTakesPomos = document.querySelector("#newTodoTakesPomos");

//кнопки для tasks
const addTodoButton = document.querySelector(".addTodoButton");
const cancelNewTodo = document.querySelector("#cancelNewTodo");

//html модалки для создания task
const createTodoModal = document.querySelector(".create-todo-modal");

//слушатели по созданию тудушки
addTodoButton.addEventListener("click", () => {
  createTodoModal.classList.toggle("none");
});
cancelNewTodo.addEventListener("click", () => {
  createTodoModal.classList.toggle("none");
  newTodoText.value = "";
  newTodoTakesPomos.value = "1";
});

// блок таймера

//цифры таймера
const timerString = document.querySelector(".timer-string");

//кнопки выбора режима
const quickBreakChooseButton = document.querySelector(
  "#quickBreakChooseButton"
);
const longBreakChooseButton = document.querySelector("#longBreakChooseButton");
const pomodoroChooseButton = document.querySelector("#pomodoroChooseButton");
const changeModeButtons = document.querySelectorAll(".timer-mode-list button");
console.log(changeModeButtons);
//слушатели по нажатию кнопок выбора режима
changeModeButtons.forEach((el) => {
  el.addEventListener("click", () => {
    changeModeButtons.forEach((el) => {
      el.classList.remove("timer-mode-list_active");
    });
    el.classList.add("timer-mode-list_active");
  });
});
