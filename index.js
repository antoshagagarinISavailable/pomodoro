//создаем объекты которые содержат информацию о режиме таймера
const pomodoro = {
  name: "pomodoro",
  minutes: JSON.parse(localStorage.getItem("pomodoro"))
    ? Number(JSON.parse(localStorage.getItem("pomodoro")).minutes)
    : 25,
  seconds: 0,
  isChosen: true,
  timeLeft: JSON.parse(localStorage.getItem("pomodoro"))?.timeLeft || 0,
  get time() {
    return this.minutes * 60;
  },
};
const quickBreak = {
  name: "quickBreak",
  minutes: JSON.parse(localStorage.getItem("quickBreak"))
    ? JSON.parse(localStorage.getItem("quickBreak")).minutes
    : 5,
  seconds: 0,
  isChosen: false,
  timeLeft: JSON.parse(localStorage.getItem("quickBreak"))?.timeLeft || 0,

  get time() {
    return this.minutes * 60;
  },
};
const longBreak = {
  name: "longBreak",
  minutes: JSON.parse(localStorage.getItem("longBreak"))
    ? JSON.parse(localStorage.getItem("longBreak")).minutes
    : 15,
  seconds: 0,
  isChosen: false,
  timeLeft: JSON.parse(localStorage.getItem("longBreak"))?.timeLeft || 0,
  get time() {
    return this.minutes * 60;
  },
};
//создаем массив со всеми режимами
const modes = [pomodoro, quickBreak, longBreak];

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
let longBreakInterval =
  JSON.parse(localStorage.getItem("longBreakInterval")) || 3;
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
  pomodoro.minutes = +setPomodoro.value;
  longBreak.minutes = +setLongBreak.value;
  quickBreak.minutes = +setQuickBreak.value;
  localStorage.setItem("pomodoro", JSON.stringify(pomodoro));
  localStorage.setItem("quickBreak", JSON.stringify(quickBreak));
  localStorage.setItem("longBreak", JSON.stringify(longBreak));

  /* рендерим изначальный таймер
по дефолту при каждой перезагрузе ставим количество минут из режима pomodoro
либо сколько осталось вермени / либо сколько минут в режиме */
  if (pomodoro.timeLeft > 0) {
    timerSeconds.textContent =
      pomodoro.timeLeft % 60 >= 10
        ? `${pomodoro.timeLeft % 60}`
        : `0${pomodoro.timeLeft % 60}`;
    timerMinutes.textContent =
      Math.floor(pomodoro.timeLeft / 60) >= 10
        ? `${Math.floor(pomodoro.timeLeft / 60)}`
        : `0${Math.floor(pomodoro.timeLeft / 60)}`;
  } else {
    timerMinutes.textContent =
      pomodoro.minutes >= 10 ? pomodoro.minutes : "0" + pomodoro.minutes;
    timerSeconds.textContent = "00";
  }

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
const resetButton = document.querySelector("#resetButton");

//глобальные переменные для таймера
let interval;
let timerIsActive = false;

//слушатель по нажатию кнопки start
startButton.addEventListener("click", timerStartFunction);

//слушатель по нажатию кнопки reset
resetButton.addEventListener("click", timerResetFunction);

//слушатели по нажатию кнопок выбора режима
pomodoroChooseButton.addEventListener("click", choosePomodoroFuction);
quickBreakChooseButton.addEventListener("click", chooseQuickBreakFunction);
longBreakChooseButton.addEventListener("click", chooseLongBreakFunction);

/* рендерим изначальный таймер
по дефолту при каждой перезагрузе ставим количество минут из режима pomodoro
либо сколько осталось вермени / либо сколько минут в режиме */
if (pomodoro.timeLeft > 0) {
  timerSeconds.textContent =
    pomodoro.timeLeft % 60 >= 10
      ? `${pomodoro.timeLeft % 60}`
      : `0${pomodoro.timeLeft % 60}`;
  timerMinutes.textContent =
    Math.floor(pomodoro.timeLeft / 60) >= 10
      ? `${Math.floor(pomodoro.timeLeft / 60)}`
      : `0${Math.floor(pomodoro.timeLeft / 60)}`;
} else {
  timerMinutes.textContent =
    pomodoro.minutes >= 10 ? pomodoro.minutes : "0" + pomodoro.minutes;
  timerSeconds.textContent = "00";
}

//функция запуска/паузы таймера
function timerStartFunction() {
  const chosenMode = modes.find((el) => el.isChosen);

  let time = chosenMode.timeLeft == 0 ? chosenMode.time : chosenMode.timeLeft;
  timerIsActive = !timerIsActive;
  clearInterval(interval);
  //рендер текста для кнопки start
  startButton.textContent = timerIsActive ? "pause" : "start";
  resetButton.classList.remove("none");

  interval = setInterval(() => {
    if (time > 0 && timerIsActive) {
      time--;
      let minutes = Math.floor(time / 60);
      let seconds = time % 60;
      console.log(time);
      timerMinutes.textContent = minutes >= 10 ? `${minutes}` : `0${minutes}`;
      timerSeconds.textContent = seconds >= 10 ? `${seconds}` : `0${seconds}`;
      chosenMode.timeLeft = time;
      localStorage.setItem(
        `${chosenMode.name}`,
        JSON.stringify({ ...chosenMode })
      );
    }
  }, 100);
}

//функция для сброса таймера
function timerResetFunction() {
  timerIsActive = !timerIsActive;
  //рендер текста для кнопки start
  startButton.textContent = "start";
  resetButton.classList.add("none");
  clearInterval(interval);
  const chosenMode = modes.find((el) => el.isChosen);
  chosenMode.timeLeft = 0;
  localStorage.setItem(`${chosenMode.name}`, JSON.stringify({ ...chosenMode }));
  changeModeFunction();
}
//функция для рендера тудушки
function renderTodo(description, takesPomos) {
  const todoList = document.getElementById("todos-list");
  const todoElement = document.createElement("li");
  todoElement.innerHTML = `
      <div class="todo-wrap">

        <input type="checkbox" name="" id="" aria-label="shows if the task already done or not"/>

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
//функция для переключения на pomodoro
function choosePomodoroFuction() {
  timerIsActive = false;
  clearInterval(interval);
  startButton.textContent = "start";
  resetButton.classList.add("none");

  longBreakChooseButton.classList.remove("timer-mode-list_active");
  quickBreakChooseButton.classList.remove("timer-mode-list_active");
  pomodoroChooseButton.classList.add("timer-mode-list_active");
  pomodoro.isChosen = true;
  quickBreak.isChosen = false;
  longBreak.isChosen = false;

  if (pomodoro.timeLeft > 0) {
    timerSeconds.textContent =
      pomodoro.timeLeft % 60 >= 10
        ? `${pomodoro.timeLeft % 60}`
        : `0${pomodoro.timeLeft % 60}`;
    timerMinutes.textContent =
      Math.floor(pomodoro.timeLeft / 60) >= 10
        ? `${Math.floor(pomodoro.timeLeft / 60)}`
        : `0${Math.floor(pomodoro.timeLeft / 60)}`;
  } else {
    timerMinutes.textContent =
      pomodoro.minutes >= 10 ? pomodoro.minutes : "0" + pomodoro.minutes;
    timerSeconds.textContent = "00";
  }
}
//функция для переключения на quickBreak
function chooseQuickBreakFunction() {
  timerIsActive = false;
  clearInterval(interval);
  startButton.textContent = "start";
  resetButton.classList.add("none");

  longBreakChooseButton.classList.remove("timer-mode-list_active");
  pomodoroChooseButton.classList.remove("timer-mode-list_active");
  quickBreakChooseButton.classList.add("timer-mode-list_active");
  pomodoro.isChosen = false;
  quickBreak.isChosen = true;
  longBreak.isChosen = false;

  if (quickBreak.timeLeft > 0) {
    timerSeconds.textContent =
      quickBreak.timeLeft % 60 >= 10
        ? `${quickBreak.timeLeft % 60}`
        : `0${quickBreak.timeLeft % 60}`;
    timerMinutes.textContent =
      Math.floor(quickBreak.timeLeft / 60) >= 10
        ? `${Math.floor(quickBreak.timeLeft / 60)}`
        : `0${Math.floor(quickBreak.timeLeft / 60)}`;
  } else {
    timerMinutes.textContent =
      quickBreak.minutes >= 10 ? quickBreak.minutes : "0" + quickBreak.minutes;
    timerSeconds.textContent = "00";
  }
}
//функция для переключения на quickBreak
function chooseLongBreakFunction() {
  timerIsActive = false;
  clearInterval(interval);
  startButton.textContent = "start";
  resetButton.classList.add("none");

  quickBreakChooseButton.classList.remove("timer-mode-list_active");
  pomodoroChooseButton.classList.remove("timer-mode-list_active");
  longBreakChooseButton.classList.add("timer-mode-list_active");
  pomodoro.isChosen = false;
  quickBreak.isChosen = false;
  longBreak.isChosen = true;

  if (longBreak.timeLeft > 0) {
    timerSeconds.textContent =
      longBreak.timeLeft % 60 >= 10
        ? `${longBreak.timeLeft % 60}`
        : `0${longBreak.timeLeft % 60}`;

    timerMinutes.textContent =
      Math.floor(longBreak.timeLeft / 60) >= 10
        ? `${Math.floor(longBreak.timeLeft / 60)}`
        : `0${Math.floor(longBreak.timeLeft / 60)}`;
  } else {
    timerSeconds.textContent = "00";
    timerMinutes.textContent =
      longBreak.minutes >= 10 ? longBreak.minutes : "0" + longBreak.minutes;
  }
}

//функция для автоматического переключения между режимами таймера
function changeModeFunction() {
  const chosenModeIndex = modes.findIndex((mode) => mode.isChosen);
  switch (chosenModeIndex) {
    case 0:
      chooseQuickBreakFunction();
      break;
    case 1:
      chooseLongBreakFunction();
      break;
    case 2:
      choosePomodoroFuction();
      break;

    default:
      break;
  }
}
