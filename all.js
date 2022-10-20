const url = "https://todoo.5xcamp.us/";

const registerBtn = document.querySelector(".register");
const loginPage = document.querySelector(".loginPage");
const signupPage = document.querySelector(".signupPage");
const todoPage = document.querySelector(".todoPage");

//register
registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  register();
});

function register() {
  const email = document.querySelector("#signupEmail").value.trim();
  const nickname = document.querySelector("#nickname").value.trim();
  let firstPwd = document.querySelector("#signupPwd");
  let secondPwd = document.querySelector("#again");
  let password = checkPassword(firstPwd, secondPwd);
  signUp(email, nickname, password);
}

//check password
function checkPassword(firstPwd, secondPwd) {
  if (firstPwd.value.trim() != secondPwd.value.trim()) {
    alert("輸入的密碼不一致，請重新輸入");
  } else {
    return firstPwd.value.trim();
  }
}

//signup
function signUp(email, nickname, password) {
  axios
    .post(`${url}/users`, {
      user: {
        email,
        nickname,
        password,
      },
    })
    .then((response) => {
      console.log(response);
      alert(response.data.message);
      removeHide();
      signupPage.classList.add("hide");
      todoPage.classList.add("hide");
    })

    .catch((error) => {
      console.log(error.response);
      alert(error.response.data.error);
    });
}

function removeHide() {
  loginPage.classList.remove("hide");
  signupPage.classList.remove("hide");
  todoPage.classList.remove("hide");
}

const toLoginPage = document.querySelector(".toLoginPage");
toLoginPage.addEventListener("click", (e) => {
  e.preventDefault();
  removeHide();
  signupPage.classList.add("hide");
  todoPage.classList.add("hide");
});

//login
const loginBtn = document.querySelector(".login");
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  signin();
});

function signin() {
  const email = document.querySelector("#loginEmail").value.trim();
  const password = document.querySelector("#loginPwd").value.trim();
  login(email, password);
}

function login(email, password) {
  axios
    .post(`${url}/users/sign_in`, {
      user: {
        email,
        password,
      },
    })
    .then((response) => {
      console.log(response);
      axios.defaults.headers.common["Authorization"] =
        response.headers.authorization;
      alert(response.data.message);
      removeHide();
      signupPage.classList.add("hide");
      loginPage.classList.add("hide");
      const whos = document.querySelector(".whos");
      whos.textContent = response.data.nickname;
      getTodoList();
    })
    .catch((error) => {
      console.log(error.response);
      alert(error.response.data.message);
    });
}

const toSignupPage = document.querySelector(".toSignupPage");
toSignupPage.addEventListener("click", (e) => {
  e.preventDefault();
  removeHide();
  todoPage.classList.add("hide");
  loginPage.classList.add("hide");
});

//logout
const logout = document.querySelector(".logout");

logout.addEventListener("click", (e) => {
  e.preventDefault();
  signout();
});

function signout() {
  axios
    .delete(`${url}/users/sign_out`)
    .then((response) => {
      console.log(response);
      alert(response.data.message);
      location.reload();
    })
    .catch((error) => {
      console.log(error.response);
      alert(error.response.data.message);
    });
}

//todolist page
function getTodoList() {
  axios
    .get(`${url}/todos`)
    .then((response) => {
      console.log(response);
      data = response.data.todos;
      render(data);
    })
    .catch((error) => {
      console.log(error.response);
    });
}

const addBtn = document.querySelector(".add");
const input = document.querySelector(".input");

addBtn.addEventListener("click", inputTodo);

function inputTodo() {
  if (input.value.trim() == "") {
    return;
  } else {
    todo = input.value.trim();
    addTodo(todo);
  }
}

function addTodo(todo) {
  axios
    .post(`${url}/todos`, {
      todo: {
        content: todo,
      },
    })
    .then((response) => {
      console.log(response);
      getTodoList();
    })
    .catch((error) => {
      console.log(error.response);
    });
}

let data = [];
const list = document.querySelector(".list");
function render(arr) {
  let str = "";
  arr.forEach((item) => {
    if (item.completed_at == null) {
      str += `<li data-id="${item.id}">
      <label class="checkbox">
        <input type="checkbox" />
        <span>${item.content}</span>
      </label>
      <div class="buttons">
        <a href="#" class="edit"><i class="bi bi-pencil-square"></i></a>
        <a href="#" class="delete"><i class="bi bi-x"></i></a>
      </div>
    </li>`;
    } else {
      str += `<li data-id="${item.id}">
      <label class="checkbox">
        <input type="checkbox" checked />
        <span>${item.content}</span>
      </label>
      <div class="buttons">
        <a href="#" class="edit"><i class="bi bi-pencil-square"></i></a>
        <a href="#" class="delete"><i class="bi bi-x"></i></a>
      </div>
    </li>`;
    }
  });
  list.innerHTML = str;
}

//delete todo
list.addEventListener("click", (e) => {
  let id = e.target.closest("li").dataset.id;
  if (e.target.getAttribute("class") == "delete") {
    console.log(123);
  }
});

function delTodo(id) {
  axios
    .delete(`${url}/todos/${id}`)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error.response);
    });
}
