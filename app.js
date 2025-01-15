"use strict";

import mockFileSystem from "./modules/filesystem.js";
import tc from "./modules/terminalCommands.js";
import { test, expect } from "././modules/test.js";

// Add command history tracking
const commandHistory = [];
let historyIndex = -1;

// instatiates the filesystem and sets the current directory and files.
const lesson1 = mockFileSystem();

const cmdInput = document.querySelector("#cmdInput");
const inputArea = document.querySelector("#inputArea");
const lastLogin = document.querySelector(".lastLogin");
const terminal = document.querySelector("#terminal");
const workingDir = document.querySelector(".workingDir");

// Sets the prompt for the terminal and includes the current working directory if not root.
function setPrompt() {
  let currentDir = lesson1.currentWorkingDirectory.split("/").pop();
  if (lesson1.currentWorkingDirectory === "/Users/myquite") {
    return `<span class="cmd">➜ <span class="workingDir">~</span> </span>`;
  } else {
    workingDir.innerHTML = `${currentDir}`;
    return `<span class="cmd">➜ <span class="workingDir">${currentDir}</span> </span>`;
  }
}

// this function the scroll bar at the bottom of the terminal
function scrollToBottom() {
  terminal.scrollTop = terminal.scrollHeight;
}

// builds and sets the last login info  when page is first loaded
function updateLastLogin() {
  let lastLogin = document.querySelector(".lastLogin");

  function getDate() {
    let currentDate = new Date();
    return currentDate.toString().slice(0, 24);
  }

  lastLogin.innerText = `Last Login: ${getDate()} on ttys000`;
}

// split input into command, options, and arguments.
function inputToCOA(input) {
  let inputArray = input.match(/(".*?"|[^",\s]+)/g);
  let command = inputArray[0];
  let options = inputArray.slice(1, inputArray.length - 1);
  let args = inputArray.slice(-1, inputArray.length);
  return { command, options, args };
}

// this command handler takes the input and generates the output based on options defined below in switch statement.
function cmdHandler(message, input) {
  if (input) {
    return `${setPrompt()} <span class="prevCmd">${input}</span></span><p>${message}</p>`;
  } else {
    return `${setPrompt()}<p></p>`;
  }
}

// Handle command history navigation
function handleKeydown(e) {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      cmdInput.value = commandHistory[historyIndex]; // Remove length-1 subtraction
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      cmdInput.value = commandHistory[historyIndex]; // Remove length-1 subtraction
    } else if (historyIndex === 0) {
      historyIndex = -1;
      cmdInput.value = "";
    }
  }
}

// Modify the existing command processing to store history
function processCommand(input) {
  if (input.trim()) {
    commandHistory.unshift(input); // Adds new commands to beginning of array
    historyIndex = -1;
  }
}

// the event listener captures the input on enter and passes it through the switch statement to handle the various commands
cmdInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    let input = event.target.value.toString();
    let argv = inputToCOA(input);

    switch (argv.command) {
      case "clear":
        lastLogin.remove();
        inputArea.innerHTML = "";
        break;
      case "echo":
        inputArea.innerHTML += cmdHandler(tc.echo(argv.args), input);
        break;
      case "pwd":
        inputArea.innerHTML += cmdHandler(
          lesson1.currentWorkingDirectory,
          input
        );
        break;
      case "ls":
        inputArea.innerHTML += cmdHandler(
          tc.listFiles(lesson1.currentFileSystem),
          input
        );
        break;
      case "help":
        inputArea.innerHTML += cmdHandler(tc.help(), input);
        break;
      case "cat":
        if (argv.args.includes("index.html")) {
          inputArea.innerHTML += cmdHandler(
            lesson1.currentFileSystem[3].contents,
            input
          );
        } else if (argv.args.length === 1) {
          inputArea.innerHTML += cmdHandler("cat: missing operand", input);
        } else {
          inputArea.innerHTML += cmdHandler(
            `No such file or directory: ${argv.args[0]}`,
            input
          );
        }
        break;
      case "cd":
        inputArea.innerHTML += cmdHandler(`${argv}`, input);
        break;
      case "test":
        inputArea.innerHTML += cmdHandler(
          `Command: [${argv.command}], Options [${argv.options}], Argument [${argv.args}]`,
          input
        );
        break;
      default:
        inputArea.innerHTML += cmdHandler(
          `command not found: ${argv.command}`,
          input
        );
        break;
    }

    processCommand(input);
    event.target.value = "";
    scrollToBottom();
  }
});

cmdInput.addEventListener("keydown", handleKeydown);

setPrompt();
updateLastLogin();

// Running tests on the terminal commands

test("echo command returns arguements", tc.echo, () => {
  let input = inputToCOA("echo hello").args;
  expect(input).toBeLike("hello");
});
