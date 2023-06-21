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
