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

// все переменные по settings
let donePomodoroCount =
  JSON.parse(localStorage.getItem("donePomodoroCount")) || 0;
let longBreakInterval =
  JSON.parse(localStorage.getItem("longBreakInterval")) || 3;
//html модалки setting
const settingsModal = document.querySelector(".settings-modal");

//settings инпуты
const setPomodoro = document.querySelector("#setPomodoro");
const setQuickBreak = document.querySelector("#setQuickBreak");
const setLongBreak = document.querySelector("#setLongBreak");
const setLongBreakInterval = document.querySelector("#setLongBreakInterval");

//кнопки по settings
const mainSettingsButton = document.querySelector("#mainSettingsButton");
const settingsCloseButton = document.querySelector("#settingsCloseButton");
const settingsSaveButton = document.querySelector("#settingsSaveButton");

//слушатели по settings
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
  longBreakInterval = +setLongBreakInterval.value;
  localStorage.setItem("pomodoro", JSON.stringify(pomodoro));
  localStorage.setItem("quickBreak", JSON.stringify(quickBreak));
  localStorage.setItem("longBreak", JSON.stringify(longBreak));
  localStorage.setItem("longBreakInterval", JSON.stringify(longBreakInterval));

  initialTimerRender();

  settingsModal.classList.toggle("none");
});

// все по тудушкам

//tasks инпуты
const newTodoText = document.querySelector("#newTodoText");
const newTodoTakesPomos = document.querySelector("#newTodoTakesPomos");

//кнопки для tasks
const addTodoButton = document.querySelector(".addTodoButton");
const saveNewTodoButton = document.querySelector("#saveNewTodo");
const cancelNewTodo = document.querySelector("#cancelNewTodo");

//ноды tasks
const todosHeader = document.querySelector("#TodosHeaderContainer");
const todosBody = document.querySelector(".todos-body");
const buttonEmpty = document.querySelector("#buttonEmpty");

//нода самой модалки
const createTodoModal = document.querySelector(".create-todo-modal");

//слушатель по открытию модалки для создания тудушки
addTodoButton.addEventListener("click", () => {
  createTodoModal.classList.toggle("none");
  todosHeader.classList.add("none");
  todosBody.classList.add("none");
  newTodoText.focus();
});
//слушатель по клику на cancel (отмена создания новой тудушки)
cancelNewTodo.addEventListener("click", () => {
  if (document.getElementById("newTodoText").classList.contains("errAnim")) {
    document.getElementById("newTodoText").classList.remove("errAnim");
  }
  createTodoModal.classList.toggle("none");
  todosHeader.classList.toggle("none");
  todosBody.classList.toggle("none");
  newTodoText.value = "";
  newTodoTakesPomos.value = "1";
});
//слушатель по клику на save (проиходит создание новой тудушки)
saveNewTodoButton.addEventListener("click", () => {
  if (document.getElementById("newTodoText").classList.contains("errAnim")) {
    document.getElementById("newTodoText").classList.remove("errAnim");
  }
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

//кнопка start
const startButton = document.querySelector("#startButton");
//кнопка next
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
    } else if (chosenMode.name === "pomodoro" && time == 0) {
      timerIsActive = false;
      clearInterval(interval);
      donePomodoroCount++;
      localStorage.setItem(
        "donePomodoroCount",
        JSON.stringify(donePomodoroCount)
      );
      changeModeFunction();
    } else if (chosenMode.name !== "pomodoro" && time == 0) {
      changeModeFunction();
    }
  }, 10);
}
//функция для сброса таймера
function timerResetFunction() {
  timerIsActive = false;
  //рендер текста для кнопки start
  startButton.textContent = "start";
  resetButton.classList.add("none");
  clearInterval(interval);
  const chosenMode = modes.find((el) => el.isChosen);
  chosenMode.timeLeft = 0;
  localStorage.setItem(`${chosenMode.name}`, JSON.stringify({ ...chosenMode }));
  if (chosenMode.name === "pomodoro") {
    donePomodoroCount++;
  }
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
          <button class="todoEditButton">edit</button>

          
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
  // получаем ноды форм
  const descriptionNode = document.getElementById("newTodoText");
  const takesPomosNode = +document.getElementById("newTodoTakesPomos");

  // проверяем значения из формы на пустоту или неверные значения
  if (description.trim() === "") {
    descriptionNode.classList.add("errAnim");
    descriptionNode.addEventListener("input", () => {
      if (descriptionNode.classList.contains("errAnim")) {
        descriptionNode.classList.remove("errAnim");
      }
    });
  } else if (!takesPomos || takesPomos < 1) {
    takesPomosNode.classList.add("errAnim");
  } else if (description.trim() !== "" && takesPomos >= 1) {
    if (descriptionNode.classList.contains("errAnim")) {
      descriptionNode.classList.remove("errAnim");
    }
    // здесь логика по сокрытию/показу элементов
    createTodoModal.classList.toggle("none");
    if (todosHeader.classList.contains("none")) {
      todosHeader.classList.remove("none");
    }
    if (todosBody.classList.contains("none")) {
      todosBody.classList.remove("none");
    }
    buttonEmpty.classList.add("none");

    // если всё гуд создаём новую тудушку
    const todo = new Todo(description, takesPomos);

    // добавляем ее в наш массив в тудушек
    todos.push(todo);

    // добавляем ее в наш массив в тудушек в local storage
    localStorage.setItem("todos", JSON.stringify([...todos]));

    // рендерим её на страницу
    renderTodo(todo.description, todo.takesPomos);

    //если это была первая тудушка созданная - тогда рендерим ее
    // в current в таймере. Типа работать будем над ней
    if (todos.length == 1) {
      document.querySelector(".current-todo-wrap").textContent =
        todos[0].description;
    }
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
//функция для переключения на longBreak
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
  console.log("активный индекс был: " + chosenModeIndex);
  switch (chosenModeIndex) {
    case 0:
      if (donePomodoroCount > 1 && !(donePomodoroCount % longBreakInterval)) {
        chooseLongBreakFunction();
      } else if (
        donePomodoroCount > 1 &&
        donePomodoroCount % longBreakInterval
      ) {
        chooseQuickBreakFunction();
      }
      break;
    case 1:
      choosePomodoroFuction();
      break;
    case 2:
      choosePomodoroFuction();
      break;

    default:
      break;
  }
}
//функция по рендеру изначального таймера
function initialTimerRender() {
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
}
//функция по рендеру тудушек
function initialTodosRender() {
  // рендерим тудушки если есть свои. иначе пусто
  if (todos.length > 0) {
    todos.forEach((el) => {
      renderTodo(el.description, el.takesPomos);
    });
    //рендерим под цифрами таймера название текущей тудушки над которой работаем
    document.querySelector(".current-todo-wrap").textContent =
      todos[0].description;
  } else if (todos.length === 0) {
    buttonEmpty.classList.remove("none");
    todosHeader.classList.add("none");
    todosBody.classList.add("none");
    buttonEmpty.addEventListener("click", () => {
      createTodoModal.classList.toggle("none");
      newTodoText.focus();
      // buttonEmpty.classList.add("none");
    });
  }
}
initialTimerRender();
initialTodosRender();
