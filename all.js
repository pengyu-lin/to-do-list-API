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
[loginPwd, loginEmail].forEach((item) => {
  item.addEventListener("keypress", function (e) {
    if (e.key == "Enter") {
      signin();
    }
  });
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
      remainNum.textContent = data.filter(
        (item) => item.completed_at == null
      ).length;
    })
    .catch((error) => {
      console.log(error.response);
    });
}

const addBtn = document.querySelector(".add");
const input = document.querySelector(".input");

addBtn.addEventListener("click", inputTodo);
input.addEventListener("keypress", function (e) {
  if (e.key == "Enter") {
    inputTodo();
  }
});

function inputTodo() {
  if (input.value.trim() == "") {
    return;
  } else {
    todo = input.value.trim();
    addTodo(todo);
    input.value = "";
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

//delete/edit todo
list.addEventListener("click", (e) => {
  let id = e.target.closest("li").dataset.id;
  let index = data.findIndex((item) => item.id === id);
  if (e.target.nodeName == "INPUT") {
    toggleChecked(id);
  } else if (e.target.closest("a").getAttribute("class") == "delete") {
    e.preventDefault();
    delTodo(id);
  } else if (e.target.closest("a").getAttribute("class") == "edit") {
    e.preventDefault();
    console.log(123);
    (async () => {
      const { value: content } = await Swal.fire({
        title: "請輸入欲更改內容",
        input: "text",
        inputPlaceholder: `${data[index].content}`,
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "請輸入內容!";
          }
        },
      });

      if (content) {
        Swal.fire(`已將待辦事項更改為: ${content}`);
        editTodo(id, content);
      }
    })();
  }
});

function delTodo(id) {
  axios
    .delete(`${url}/todos/${id}`)
    .then((response) => {
      console.log(response);
      getTodoList();
    })
    .catch((error) => {
      console.log(error.response);
    });
}

function editTodo(id, content) {
  axios
    .put(`${url}/todos/${id}`, {
      todo: {
        content,
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

//toggle checkbox
function toggleChecked(id) {
  axios
    .patch(`${url}/todos/${id}/toggle`)
    .then((response) => {
      console.log(response);
      getTodoList();
    })
    .catch((error) => {
      console.log(error.response);
    });
}

//change tab
let tabStatus = "all";
const tabs = document.querySelector(".tabs");
let tab = document.querySelectorAll(".tabs li");
tabs.addEventListener("click", function (e) {
  tabStatus = e.target.dataset.tab;
  tab.forEach(function (item) {
    item.classList.remove("active");
  });
  e.target.classList.add("active");
  updateTab();
});

//tab content
const remainNum = document.querySelector(".remainNum");
function updateTab() {
  let tabData = [];
  if (tabStatus == "all") {
    tabData = data;
  } else if (tabStatus == "remain") {
    tabData = data.filter((item) => item.completed_at == null);
  } else if (tabStatus == "done") {
    tabData = data.filter((item) => item.completed_at != null);
  }
  render(tabData);
}

//delete checked todos
const deleteDone = document.querySelector(".deleteDone");
deleteDone.addEventListener("click", function (e) {
  e.preventDefault();
  data.forEach((item) => {
    if (item.completed_at != null) {
      id = item.id;
      delTodo(id);
    }
  });
});
