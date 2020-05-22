"use strict";

function updateLastLogin() {
  let lastLogin = document.querySelector(".lastLogin");

  function getDate() {
    let currentDate = new Date();
    return currentDate.toString().slice(0, 24);
  }

  lastLogin.innerText = `Last Login: ${getDate()} on ttys000`;
}

updateLastLogin();

const cmdInput = document.querySelector("#cmdInput");
const inputArea = document.querySelector("#inputArea");
const lastLogin = document.querySelector(".lastLogin");

function cmdHandler(text, cmd, includeCmd) {
  if (!text) {
    return `<span class="cmd">➜  <span>~</span> <span class="prevCmd"> ${cmd}</span></span>`;
  } else if (!includeCmd) {
    return `<span class="cmd">➜  <span>~</span> <span class="prevCmd"> ${cmd}</span></span> <p>${text}</p>`;
  } else {
    return `<span class="cmd">➜  <span>~</span> <span class="prevCmd"> ${cmd}</span></span> <p>${text} ${cmd.split(
      " ",
      1
    )}</p>`;
  }
}

cmdInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    let input = event.target.value.toString();

    switch (input) {
      case "clear":
        lastLogin.remove();
        inputArea.innerHTML = "";
        break;
      case "echo":
        inputArea.innerHTML += cmdHandler("echo", input, false);
        break;
      case "pwd":
        inputArea.innerHTML += cmdHandler("/Users/myquite", input, false);
        break;
      case "ls":
        inputArea.innerHTML += cmdHandler("hello.txt", input, false);
        break;
      case "cat hello.txt":
        inputArea.innerHTML += cmdHandler("Hello World", input, false);
        break;
      default:
        inputArea.innerHTML += cmdHandler("command not found:", input, true);
    }

    event.target.value = "";
  }
});