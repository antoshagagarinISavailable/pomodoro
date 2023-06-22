//создаем объекты которые содержат информацию о режиме таймера
const pomodoro = {
  minutes: JSON.parse(localStorage.getItem("pomodoro"))
    ? JSON.parse(localStorage.getItem("pomodoro")).minutes
    : 25,
  seconds: 0,
  set setMinutes(value) {
    this.minutes = +value;
  },
  get time() {
    return this.minutes * 60;
  },
};
const quickBreak = {
  minutes: JSON.parse(localStorage.getItem("quickBreak"))
    ? JSON.parse(localStorage.getItem("quickBreak")).minutes
    : 5,
  seconds: 0,
  set setMinutes(value) {
    this.minutes = +value;
  },
  get time() {
    return this.minutes * 60;
  },
};
const longBreak = {
  minutes: JSON.parse(localStorage.getItem("longBreak"))
    ? JSON.parse(localStorage.getItem("longBreak")).minutes
    : 15,
  seconds: 0,
  set setMinutes(value) {
    this.minutes = +value;
  },
  get time() {
    return this.minutes * 60;
  },
};

//создаем класс для создания тудушек
class Todo {
  constructor(description, takesPomos) {
    this.description = description;
    this.takesPomos = takesPomos;
    this.completed = false;
  }

  markComplete() {
    this.completed = true;
  }
}

//создаем масив тудушек
const todos = JSON.parse(localStorage.getItem("todos"))
  ? JSON.parse(localStorage.getItem("todos"))
  : [];

// рендерим тудушки если есть свои. иначе пусто
if (todos.length > 0) {
  todos.forEach((el) => {
    renderTodo(el.description, el.takesPomos);
  });
  //рендерим под цифрами таймера название текущей тудушки над которой работаем
  document.querySelector(".current-todo-wrap").textContent =
    todos[0].description;
}

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
const settingsSaveButton = document.querySelector("#settingsSaveButton");

//слушатели по модалке настроек
mainSettingsButton.addEventListener("click", () => {
  settingsModal.classList.toggle("none");
});
settingsCloseButton.addEventListener("click", () => {
  settingsModal.classList.toggle("none");
});
settingsSaveButton.addEventListener("click", () => {
  pomodoro.setMinutes = setPomodoro.value;
  longBreak.setMinutes = setLongBreak.value;
  quickBreak.setMinutes = setQuickBreak.value;
  localStorage.setItem("pomodoro", JSON.stringify(pomodoro));
  localStorage.setItem("quickBreak", JSON.stringify(quickBreak));
  localStorage.setItem("longBreak", JSON.stringify(longBreak));

  settingsModal.classList.toggle("none");
});

// все const по tasks

//tasks инпуты
const newTodoText = document.querySelector("#newTodoText");
const newTodoTakesPomos = document.querySelector("#newTodoTakesPomos");

//кнопки для tasks
const addTodoButton = document.querySelector(".addTodoButton");
const saveNewTodoButton = document.querySelector("#saveNewTodo");
const cancelNewTodo = document.querySelector("#cancelNewTodo");

//нода модалки
const createTodoModal = document.querySelector(".create-todo-modal");

//слушатели по созданию тудушки
addTodoButton.addEventListener("click", () => {
  createTodoModal.classList.toggle("none");
  newTodoText.focus();
});
cancelNewTodo.addEventListener("click", () => {
  createTodoModal.classList.toggle("none");
  newTodoText.value = "";
  newTodoTakesPomos.value = "1";
});
saveNewTodoButton.addEventListener("click", () => {
  createTodoModal.classList.toggle("none");
  addTodo();
  newTodoText.value = "";
  newTodoTakesPomos.value = "1";
});

// блок таймера

//минуты таймера
const timerMinutes = document.querySelector(".timer-string__minutes");
//секунды таймера
const timerSeconds = document.querySelector(".timer-string__seconds");

//кнопки выбора режима
const quickBreakChooseButton = document.querySelector(
  "#quickBreakChooseButton"
);
const longBreakChooseButton = document.querySelector("#longBreakChooseButton");
const pomodoroChooseButton = document.querySelector("#pomodoroChooseButton");
const changeModeButtons = document.querySelectorAll(".timer-mode-list button");

//кнопка start
const startButton = document.querySelector("#startButton");

//глобальные переменные для таймера
let interval;
let timerIsActive = false;

//функция запуска таймера
const timerStartFunction = () => {
  timerIsActive = !timerIsActive;
  //рендер текста для кнопки start
  startButton.textContent = timerIsActive ? "pause" : "start";
  let time = +timerMinutes.textContent * 60 + +timerSeconds.textContent;
  clearInterval(interval);
  interval = setInterval(() => {
    if (time > 0 && timerIsActive) {
      time--;
      let minutes = Math.floor(time / 60);
      let seconds = time % 60;
      console.log(time);
      timerMinutes.textContent = minutes >= 10 ? `${minutes}` : `0${minutes}`;
      timerSeconds.textContent = seconds >= 10 ? `${seconds}` : `0${seconds}`;
    }
  }, 100);
};

//слушатель по нажатию кнопки start
startButton.addEventListener("click", timerStartFunction);

//слушатели по нажатию кнопок выбора режима

pomodoroChooseButton.addEventListener("click", () => {
  longBreakChooseButton.classList.remove("timer-mode-list_active");
  quickBreakChooseButton.classList.remove("timer-mode-list_active");
  pomodoroChooseButton.classList.add("timer-mode-list_active");

  time = timerMinutes.textContent =
    pomodoro.minutes >= 10 ? pomodoro.minutes : "0" + pomodoro.minutes;
});
quickBreakChooseButton.addEventListener("click", () => {
  longBreakChooseButton.classList.remove("timer-mode-list_active");
  pomodoroChooseButton.classList.remove("timer-mode-list_active");
  quickBreakChooseButton.classList.add("timer-mode-list_active");

  timerMinutes.textContent =
    quickBreak.minutes >= 10 ? quickBreak.minutes : "0" + quickBreak.minutes;
});
longBreakChooseButton.addEventListener("click", () => {
  quickBreakChooseButton.classList.remove("timer-mode-list_active");
  pomodoroChooseButton.classList.remove("timer-mode-list_active");
  longBreakChooseButton.classList.add("timer-mode-list_active");

  timerMinutes.textContent =
    longBreak.minutes >= 10 ? longBreak.minutes : "0" + longBreak.minutes;
});

//по дефолту при каждой перезагрузе ставим количество минут из режима pomodoro
timerMinutes.textContent = JSON.parse(localStorage.getItem("pomodoro"))
  ? JSON.parse(localStorage.getItem("pomodoro")).minutes
  : 25;

//функция для рендера тудушки
function renderTodo(description, takesPomos) {
  const todoList = document.getElementById("todos-list");
  const todoElement = document.createElement("li");
  todoElement.innerHTML = `
      <div class="todo-wrap">
        <!-- <div class="svg-plug"> -->
        <input type="checkbox" name="" id="" />
        <!-- </div> -->
        <p class="large-text">${description}</p>
        <div class="todo-settings">
          <div class="pomo-iterations">
            <span class="pomo-iterations__actual actual"> 0 </span>
            <span>/</span>
            <span class="pomo-iterations__expected expected">
              ${takesPomos}
            </span>
          </div>
  
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="16"
            height="16"
            viewBox="0 0 30 30"
            fill="#ccc"
          >
            <circle cx="12" cy="12" r="20" opacity="0" />
            <circle cx="12" cy="2" r="2" opacity="0.8" />
            <circle cx="12" cy="12" r="2" opacity="0.8" />
            <circle cx="12" cy="22" r="2" opacity="0.8" />
          </svg>
        </div>
      </div>
      `;
  todoList.appendChild(todoElement);
}
//функция для создания новой тудушки
function addTodo() {
  // получаем значения из формы
  const description = document.getElementById("newTodoText").value;
  const takesPomos = +document.getElementById("newTodoTakesPomos").value;

  // создаём новую тудушку
  const todo = new Todo(description, takesPomos);
  console.log(todos);
  console.log(todo);
  // добавляем ее в наш массив в тудушек
  todos.push(todo);
  // добавляем ее в наш массив в тудушек в local storage
  localStorage.setItem("todos", JSON.stringify([...todos]));

  // добавляем её на страницу
  renderTodo(todo.description, todo.takesPomos);

  if (todos.length == 1) {
    document.querySelector(".current-todo-wrap").textContent =
      todos[0].description;
  }
}
