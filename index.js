//создаем класс режима таймера
class timerMode {
  constructor(name, minutes) {
    this.name = name;
    this.minutes = JSON.parse(localStorage.getItem(name))
      ? Number(JSON.parse(localStorage.getItem(name)).minutes)
      : minutes;
    this.isChosen =
      Boolean(JSON.parse(localStorage.getItem(name))?.isChosen) || false;
    this.timeLeft =
      JSON.parse(localStorage.getItem(name))?.timeLeft || minutes * 60;
  }
  getTime() {
    return this.minutes * 60;
  }
}
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

//создаем экземпляры класса которые содержат информацию о режиме таймера
const pomodoro = new timerMode("pomodoro", 25);
const quickBreak = new timerMode("quickBreak", 5);
const longBreak = new timerMode("longBreak", 15);

//создаем массив со всеми режимами
const modes = [pomodoro, quickBreak, longBreak];

//создаем переменную для редактирования тудушки
let bufferTodo;

//создаем масив тудушек
const todos = JSON.parse(localStorage.getItem("todos"))
  ? JSON.parse(localStorage.getItem("todos"))
  : [];
//создаем масив завершенных тудушек
const todosDone = JSON.parse(localStorage.getItem("todosDone"))
  ? JSON.parse(localStorage.getItem("todosDone"))
  : [];
// все переменные по settings
let donePomodoroCount =
  +JSON.parse(localStorage.getItem("donePomodoroCount")) || 0;
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
  if (timerIsActive) {
    timerIsActive = false;
    clearInterval(interval);
    //меняем кнопку pause на start
    startButton.textContent = "start";
    //прячем reset
    resetButton.classList.add("none");
  }
});
settingsCloseButton.addEventListener("click", () => {
  settingsModal.classList.toggle("none");
});
settingsSaveButton.addEventListener("click", () => {
  pomodoro.minutes = +setPomodoro.value;
  pomodoro.timeLeft = +setPomodoro.value * 60;
  longBreak.minutes = +setLongBreak.value;
  longBreak.timeLeft = +setLongBreak.value * 60;
  quickBreak.minutes = +setQuickBreak.value;
  quickBreak.timeLeft = +setQuickBreak.value * 60;
  longBreakInterval = +setLongBreakInterval.value;
  donePomodoroCount = 0;
  localStorage.setItem("pomodoro", JSON.stringify(pomodoro));
  localStorage.setItem("quickBreak", JSON.stringify(quickBreak));
  localStorage.setItem("longBreak", JSON.stringify(longBreak));
  localStorage.setItem("longBreakInterval", JSON.stringify(longBreakInterval));
  localStorage.setItem("donePomodoroCount", "0");

  timerDigitsRender(modes[modes.findIndex((el) => el.isChosen)]);

  settingsModal.classList.toggle("none");
});

// все по тудушкам

//tasks инпуты
const newTodoText = document.querySelector("#newTodoText");
const newTodoTakesPomos = document.querySelector("#newTodoTakesPomos");

//кнопки для tasks
const addTodoButton = document.querySelector(".addTodoButton");
const cancelNewTodo = document.querySelector("#cancelNewTodo");
const saveNewTodoButton = document.querySelector("#saveNewTodo");
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
  buttonEmpty.addEventListener(
    "click",
    () => {
      createTodoModal.classList.toggle("none");
      newTodoText.focus();
    },
    { once: true }
  );
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

// модалка редактирования тудушки

// нода самой модалки редактирования тудушки
const editTodoModal = document.querySelector(".edit-todo-modal");

// инпут с тектом редактирования тудушки
const editTodoText = document.querySelector("#editTodoText");
const editTakesPomos = document.querySelector("#editTakesPomos");

// кнопка сохранения изменений
const saveEditTodoButton = document.querySelector("#saveEditTodo");
// кнопка отмены изменений
const cancelEditTodoButton = document.querySelector("#cancelEditTodo");
// кнопка удаления
const deleteEditTodoButton = document.querySelector("#deleteEditTodo");

// слушатель для кнопки сохранения
saveEditTodoButton.addEventListener("click", saveEditTodoFunction);
// слушатель для кнопки отмены
cancelEditTodoButton.addEventListener("click", () => {
  editTodoModal.classList.add("none");
  todosHeader.classList.remove("none");
  todosBody.classList.remove("none");
});
// слушатель для кнопки удаления
deleteEditTodoButton.addEventListener("click", () => {
  const index = todos.findIndex(
    (el) => el.description === bufferTodo.description
  );
  if (index !== -1) {
    todos.splice(index, 1);
  }
  localStorage.setItem("todos", JSON.stringify([...todos]));
  editTodoModal.classList.add("none");
  todosHeader.classList.remove("none");
  todosBody.classList.remove("none");
  forceTodosRender();
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
pomodoroChooseButton.addEventListener("click", () => chooseTimer(pomodoro));
quickBreakChooseButton.addEventListener("click", () => chooseTimer(quickBreak));
longBreakChooseButton.addEventListener("click", () => chooseTimer(longBreak));
//функция по сохранению изменений в тудушке
function saveEditTodoFunction() {
  const parentNode = this.parentNode.parentNode;
  const newDescription = parentNode.querySelector("#editTodoText").value;
  const newTakesPomos = parentNode.querySelector("#editTakesPomos").value;
  const index = todos.findIndex(
    (el) => el.description === bufferTodo.description
  );
  if (index !== -1 && newDescription !== "" && newTakesPomos > 0) {
    todos[index].description = newDescription;
    todos[index].takesPomos = newTakesPomos;
    localStorage.setItem("todos", JSON.stringify([...todos]));
    editTodoModal.classList.add("none");
    todosHeader.classList.remove("none");
    todosBody.classList.remove("none");
    forceTodosRender();
  } else if (newDescription === "") {
    editTodoText.classList.add("errAnim");
  } else if (newTakesPomos < 1 || !newTakesPomos) {
    editTakesPomos.classList.add("errAnim");
  }
}
//функция запуска/паузы таймера
function timerStartFunction() {
  const chosenMode = modes.find((el) => el.isChosen);
  let time =
    chosenMode.timeLeft == 0 ? chosenMode.getTime() : chosenMode.timeLeft;
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
  }, 1000);
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
    localStorage.setItem(
      "donePomodoroCount",
      JSON.stringify(donePomodoroCount)
    );
  }
  changeModeFunction();
}
//функция для рендера завершенной тудушки
function renderTodoDone(description) {
  const todoDoneList = document.getElementById("todosDone-list");
  const todoDoneElement = document.createElement("li");
  todoDoneElement.innerHTML = `
  <li>
  <div class="todoDone-wrap">
    <p class="large-text">${description}</p>
    <button class="deteleDoneTodo">delete</button>
  </div>
</li>
  `;
  todoDoneList.appendChild(todoDoneElement);
  // выцепляем последний элемент из нодлиста
  const deleteTodoDoneButton =
    document.querySelectorAll(".deteleDoneTodo")[
      document.querySelectorAll(".deteleDoneTodo").length - 1
    ];

  // чтобы навесить именно той тудушке, которая сейчас рендерится
  deleteTodoDoneButton.addEventListener("click", deleteTodoDoneFunction);
}
//функция для удаления завершенной тудушки
function deleteTodoDoneFunction() {
  const text = this.parentNode.querySelector("p").textContent;
  const index = todosDone.findIndex((el) => el.description === text);
  if (index !== -1) {
    todosDone.splice(index, 1);
    localStorage.setItem("todosDone", JSON.stringify([...todosDone]));
  }

  forceTodosRender();
}
//функция для рендера тудушки
function renderTodo(description, takesPomos) {
  const todoList = document.getElementById("todos-list");
  const todoElement = document.createElement("li");
  todoElement.innerHTML = `
      <div class="todo-wrap">

        <input type="checkbox" class="processingState" aria-label="shows if the task already done or not"/>

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
  // выцепляем последний элемент из нодлиста
  const editButton =
    document.querySelectorAll(".todoEditButton")[
      document.querySelectorAll(".todoEditButton").length - 1
    ];
  const checkBox =
    document.querySelectorAll(".processingState")[
      document.querySelectorAll(".processingState").length - 1
    ];

  // чтобы навесить именно той тудушке, которая сейчас рендерится
  editButton.addEventListener("click", editTodoOpen);
  checkBox.addEventListener("change", todoManualChangeState);
}
//функция для ручного выполнения тудушки по клику на чекбокс
function todoManualChangeState() {
  const text = this.parentNode.querySelector("p").textContent;
  const index = todos.findIndex((el) => el.description === text);
  if (index !== -1) {
    todos[index].completed = true;
    todosDone.push(todos[index]);
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify([...todos]));
    localStorage.setItem("todosDone", JSON.stringify([...todosDone]));
  }

  forceTodosRender();
}
//функция открывашка редактирования/удаления существующей тудушки
function editTodoOpen() {
  editTodoModal.classList.remove("none");
  todosHeader.classList.add("none");
  todosBody.classList.add("none");
  editTodoText.focus();
  const parentNode = this.parentNode.parentNode;
  const description = parentNode.querySelector("p").textContent;
  const pomos = parentNode.querySelector(".expected").textContent.trim();
  bufferTodo = new Todo(description, pomos);
  editTodoText.value = description;
  editTakesPomos.value = pomos;
}
// функция редактирования/удаления существующей тудушки
function editTodo() {}
//функция для создания новой тудушки
function addTodo() {
  // получаем значения из формы
  const description = document.getElementById("newTodoText").value;
  const takesPomos = +document.getElementById("newTodoTakesPomos").value;
  // получаем ноды форм
  const descriptionNode = document.getElementById("newTodoText");
  const takesPomosNode = document.getElementById("newTodoTakesPomos");

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
    //обнуляем инпуты
    document.getElementById("newTodoText").value = "";
    document.getElementById("newTodoTakesPomos").value = 1;
  }
}
//универсальная функция для переключения таймеров
function chooseTimer(timerMode) {
  timerIsActive = false;
  clearInterval(interval);
  startButton.textContent = "start";
  resetButton.classList.add("none");
  timerDigitsRender(timerMode);
}
//функция для автоматического переключения между режимами таймера
function changeModeFunction() {
  const chosenModeIndex = modes.findIndex((mode) => mode.isChosen);
  switch (chosenModeIndex) {
    case 0:
      if (donePomodoroCount > 0 && !(donePomodoroCount % longBreakInterval)) {
        chooseTimer(longBreak);
      } else if (
        donePomodoroCount > 0 &&
        donePomodoroCount % longBreakInterval
      ) {
        chooseTimer(quickBreak);
      }
      break;
    case 1:
      chooseTimer(pomodoro);
      break;
    case 2:
      chooseTimer(pomodoro);
      break;

    default:
      break;
  }
}
//функция по рендеру изначального таймера
function timerDigitsRender(timerMode) {
  if (timerMode.timeLeft > 0) {
    timerSeconds.textContent =
      timerMode.timeLeft % 60 >= 10
        ? `${timerMode.timeLeft % 60}`
        : `0${timerMode.timeLeft % 60}`;
    timerMinutes.textContent =
      Math.floor(timerMode.timeLeft / 60) >= 10
        ? `${Math.floor(timerMode.timeLeft / 60)}`
        : `0${Math.floor(timerMode.timeLeft / 60)}`;
  } else {
    timerMinutes.textContent =
      timerMode.minutes >= 10 ? timerMode.minutes : "0" + timerMode.minutes;
    timerSeconds.textContent = "00";
  }

  for (let i = 0; i < modes.length; i++) {
    if (modes[i].name === timerMode.name) {
      document
        .querySelector(`#${modes[i].name}ChooseButton`)
        .classList.add("timer-mode-list_active");
      modes[i].isChosen = true;
    } else {
      document
        .querySelector(`#${modes[i].name}ChooseButton`)
        .classList.remove("timer-mode-list_active");
      modes[i].isChosen = false;
    }
  }
  modes.forEach((el) => {
    localStorage.setItem(el.name, JSON.stringify(el));
  });
}
//функция по рендеру тудушек
function forceTodosRender() {
  //
  const todoslist = document.querySelector("#todos-list");
  const todosDonelist = document.querySelector("#todosDone-list");

  while (todoslist.firstChild) {
    todoslist.removeChild(todoslist.firstChild);
  }
  while (todosDonelist.firstChild) {
    todosDonelist.removeChild(todosDonelist.firstChild);
  }

  // рендерим тудушки если есть свои. иначе пусто
  if (todosDone.length > 0) {
    todosDone.forEach((el) => {
      renderTodoDone(el.description, el.takesPomos);
    });
  }
  if (todos.length > 0) {
    todos.forEach((el) => {
      renderTodo(el.description, el.takesPomos);
    });

    //рендерим под цифрами таймера название текущей тудушки над которой работаем
    document.querySelector(".current-todo-wrap").textContent =
      todos[0].description;
  }
  if (todos.length === 0) {
    buttonEmpty.classList.remove("none");
    todosHeader.classList.add("none");
    todosBody.classList.add("none");
  }
  buttonEmpty.addEventListener(
    "click",
    () => {
      createTodoModal.classList.remove("none");
      newTodoText.focus();
    },
    { once: true }
  );
}
//певроначальный рендер при каждой загрузке страницы
if (modes.findIndex((el) => el.isChosen) > 0) {
  timerDigitsRender(modes[modes.findIndex((el) => el.isChosen)]);
} else {
  timerDigitsRender(pomodoro);
}

forceTodosRender();

// слушатели для того чтобы можно было создавать / редактировать тудушки по нажатию enter
editTodoText.addEventListener("animationend", () => {
  editTodoText.classList.remove("errAnim");
});
editTakesPomos.addEventListener("animationend", () => {
  editTakesPomos.classList.remove("errAnim");
});
newTodoText.addEventListener("animationend", () => {
  newTodoText.classList.remove("errAnim");
});
newTodoTakesPomos.addEventListener("animationend", () => {
  editTakesPomos.classList.remove("errAnim");
});
editTodoText.addEventListener("keypress", (e) => {
  if (e.keyCode === 13 && editTodoText.value !== "") {
    newTodoTakesPomos.focus();
  } else if (e.keyCode === 13 && editTodoText.value === "") {
    editTodoText.classList.add("errAnim");
  }
});
editTakesPomos.addEventListener("keypress", (e) => {
  if (e.keyCode === 13 && editTakesPomos.value !== 0) {
    saveEditTodoFunction.call(saveEditTodoButton);
  } else if (e.keyCode === 13 && editTakesPomos.value === "") {
    editTakesPomos.classList.add("errAnim");
  }
});
newTodoText.addEventListener("keypress", (e) => {
  if (e.keyCode === 13 && newTodoText.value !== "") {
    newTodoTakesPomos.focus();
  } else if (e.keyCode === 13 && newTodoText.value === "") {
    newTodoText.classList.add("errAnim");
  }
});
newTodoTakesPomos.addEventListener("keypress", (e) => {
  if (e.keyCode === 13 && newTodoTakesPomos.value !== 0) {
    addTodo();
  } else if (e.keyCode === 13 && newTodoTakesPomos.value === "") {
    newTodoTakesPomos.classList.add("errAnim");
  }
});
