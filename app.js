"use strict";

import mockFileSystem from "./modules/filesystem.js";
import tc from "./modules/terminalCommands.js";
import lc, { lessons } from "./modules/lessonCommands.js";
import { test, expect } from "././modules/test.js";

// Add command history tracking
const commandHistory = [];
let historyIndex = -1;

// Add after imports
const COMMANDS = [
  "clear",
  "echo",
  "pwd",
  "ls",
  "cd",
  "help",
  "touch",
  "mkdir",
  "rm",
];

// instantiates the filesystem and sets the current directory and files.
const lesson1 = mockFileSystem();
const activeFileSystem = lesson1;

const cmdInput = document.querySelector("#cmdInput");
const inputArea = document.querySelector("#inputArea");
const lastLogin = document.querySelector(".lastLogin");
const terminal = document.querySelector("#terminal");
const main = document.querySelector("main");
const workingDir = document.querySelector(".workingDir");
const helpBar = document.querySelector("#helpBar");
const progressBar = document.querySelector("#progressBar");
const helpInfo = '> Enter <em>help</em> to see list of commands';

// Keep track of which lesson is currently active
const lessonObjectives = Object.fromEntries(
  Object.entries(lessons).map(([num, data]) => [parseInt(num), data.command])
);
let currentLesson = null;

// Progress tracking
const totalLessons = Object.keys(lessonObjectives).length;
let completedLessons = 0;

function updateProgressBar() {
  const percent = (completedLessons / totalLessons) * 100;
  progressBar.style.width = `${percent}%`;
}

function resetLessons() {
  completedLessons = 0;
  currentLesson = null;
  updateProgressBar();
  helpBar.innerHTML = helpInfo;
}

// Sets the prompt for the terminal and includes the current working directory if not root.
function setPrompt() {
  let currentDir = activeFileSystem.currentWorkingDirectory.split("/").pop();
  if (activeFileSystem.currentWorkingDirectory === "/Users/myquite") {
    return `<span class="cmd">➜ <span class="workingDir">~</span> </span>`;
  } else {
    workingDir.innerHTML = `${currentDir}`;
    return `<span class="cmd">➜ <span class="workingDir">${currentDir}</span> </span>`;
  }
}

// Scrolls the terminal view to the bottom
function scrollToBottom() {
  main.scrollTop = main.scrollHeight;
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
  if (!input.trim()) {
    return { command: "", options: [], args: [] };
  }
  let inputArray = input.match(/(".*?"|[^",\s]+)/g) || [];
  let command = inputArray[0] || "";
  let options = inputArray.slice(1, inputArray.length - 1);
  let args = inputArray.slice(-1);
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
  } else if (e.key === "Tab") {
    e.preventDefault();
    handleTabCompletion();
  }
}

// Add new function
function handleTabCompletion() {
  const input = cmdInput.value;
  const parts = input.split(" ");
  const lastWord = parts[parts.length - 1];

  // Command completion
  if (parts.length === 1) {
    const matches = COMMANDS.filter((cmd) => cmd.startsWith(lastWord));
    completeInput(matches, parts, input);
  }
  // File/directory completion
  else {
    const currentFiles =
      activeFileSystem.structure[activeFileSystem.currentWorkingDirectory] || [];
    const matches = currentFiles
      .filter((file) => file.name.startsWith(lastWord))
      .map((file) => file.name);
    completeInput(matches, parts, input);
  }
}

// Add new function
function completeInput(matches, parts, input) {
  if (matches.length === 1) {
    parts[parts.length - 1] = matches[0];
    cmdInput.value = parts.join(" ");
  } else if (matches.length > 1) {
    inputArea.innerHTML += `\n${matches.join("  ")}\n${setPrompt()}${input}`;
  }
}

// Modify the existing command processing to store history
function processCommand(input) {
  if (input.trim()) {
    commandHistory.unshift(input); // Adds new commands to beginning of array
    historyIndex = -1;
  }
}

// Check if the current command fulfills a lesson objective
function handleLesson(input) {
  if (!currentLesson) {
    helpBar.innerHTML = helpInfo;
    return;
  }
  const expected = lessonObjectives[currentLesson];
  const normalizedInput = input.toLowerCase().trim();
  const normalizedExpected = expected.toLowerCase().trim();
  if (normalizedInput === normalizedExpected) {
    helpBar.innerHTML = `Lesson ${currentLesson} complete! Ready for the next lesson?`;
    if (currentLesson > completedLessons) {
      completedLessons = currentLesson;
      updateProgressBar();
    }
    currentLesson = null;
  }
}

// the event listener captures the input on enter and passes it through the switch statement to handle the various commands
cmdInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    let input = event.target.value.toString();
    if (!input.trim()) {
      inputArea.innerHTML += cmdHandler("", "");
      event.target.value = "";
      scrollToBottom();
      return;
    }
    let argv = inputToCOA(input);

    switch (argv.command.toLowerCase()) {
      case "clear":
        lastLogin.remove();
        inputArea.innerHTML = "";
        break;
      case "echo":
        inputArea.innerHTML += cmdHandler(tc.echo(argv.args), input);
        break;
      case "pwd":
        inputArea.innerHTML += cmdHandler(tc.pwd(activeFileSystem), input);
        break;
      case "ls":
        inputArea.innerHTML += cmdHandler(
          tc.listFiles(activeFileSystem),
          input
        );
        break;
      case "help":
        inputArea.innerHTML += cmdHandler(tc.help(), input);
        break;
      case "cat":
        inputArea.innerHTML += cmdHandler(
          tc.cat(activeFileSystem, argv.args),
          input
        );
        break;
      case "cd":
        inputArea.innerHTML += cmdHandler(
          tc.cd(activeFileSystem, argv.args[0]),
          input
        );
        break;
      case "touch":
        inputArea.innerHTML += cmdHandler(
          tc.touch(activeFileSystem, argv.args),
          input
        );
        break;
      case "mkdir":
        inputArea.innerHTML += cmdHandler(
          tc.mkdir(activeFileSystem, argv.args),
          input
        );
        break;
      case "rm":
        inputArea.innerHTML += cmdHandler(
          tc.rm(activeFileSystem, argv.args),
          input
        );
        break;
      case "lesson":
        if (argv.args[0] === "--help" || argv.args[0] === "-h" || !argv.args[0]) {
          inputArea.innerHTML += cmdHandler(lc.lesson(["--help"]), input);
          helpBar.innerHTML = helpInfo;
        } else if (argv.args[0] === "reset") {
          inputArea.innerHTML += cmdHandler(lc.lesson(["reset"]), input);
          helpBar.innerHTML = helpInfo;
          resetLessons();
        } else if (argv.args[0] === "ls") {
          inputArea.innerHTML += cmdHandler(lc.lesson(["ls"]), input);
          helpBar.innerHTML = helpInfo;
        } else {
          const lessonNum = argv.args[0];
          const lessonMsg = lc.lesson(argv.args);
          helpBar.innerHTML = lessonMsg;
          if (lessons[lessonNum]) {
            inputArea.innerHTML += cmdHandler("Lesson Loaded", input);
            currentLesson = parseInt(lessonNum);
          } else {
            inputArea.innerHTML += cmdHandler(lessonMsg, input);
            currentLesson = null;
          }
        }
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

    if (argv.command.toLowerCase() !== "lesson") {
      handleLesson(input.toLowerCase().trim());
    }

    processCommand(input);
    event.target.value = "";
    scrollToBottom();
  }
});

cmdInput.addEventListener("keydown", handleKeydown);

setPrompt();
updateLastLogin();
updateProgressBar();
helpBar.innerHTML = helpInfo;

// Running tests on the terminal commands

test("echo command returns arguements", tc.echo, () => {
  let input = inputToCOA("echo hello").args;
  expect(input).toBeLike("hello");
});

test("touch command warns on existing file", tc.touch, () => {
  let result = tc.touch(activeFileSystem, ["index.html"]);
  expect(result).toBe("touch: index.html: File exists");
});
