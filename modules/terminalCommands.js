// start moving terminal commands into this file

function getCurrentFiles(fs) {
  return fs.structure[fs.currentWorkingDirectory] || [];
}

let terminalCommands = {
  help: () => {
    return `
    <strong>Commands</strong>
    <span class="cmd">help</span> - displays this help message
    <span class="cmd">clear</span> - clears the terminal
    <span class="cmd">ls</span> - lists files and folders in the current directory
    <span class="cmd">cat</span> - displays the contents of a file
    <span class="cmd">pwd</span> - displays the current working directory
    <span class="cmd">cd</span> - change directory
    <span class="cmd">echo</span> - displays lines of text or string passed as arguments
    <span class="cmd">touch</span> - creates a new empty file
    <span class="cmd">mkdir</span> - creates a new directory
    <span class="cmd">rm</span> - removes a file or directory
    <span class="cmd">lesson &lt;number&gt;</span> - start a guided lesson
    <span class="cmd">lesson --help</span> - how lessons work
    <span class="cmd">lesson ls</span> - list lessons`;
  },
  listFiles: (fs) => {
    const files = getCurrentFiles(fs);
    let output = "";
    for (let i = 0; i < files.length; i++) {
      if (files[i].type === "directory") {
        output += `<span class="dir">${files[i].name}</span> `;
      } else {
        output += `<span>${files[i].name}</span> `;
      }
    }
    return output;
  },
  echo: (args) => {
    let output = "";
    for (let i = 0; i < args.length; i++) {
      if (args[i].includes('"')) {
        output += args[i].slice(1, -1);
      } else {
        output += args[i];
      }
    }
    return output;
  },
  touch: (fs, args) => {
    if (!args.length) return "touch: missing file operand";
    return terminalCommands.createFile(fs, args[0]);
  },
  mkdir: (fs, args) => {
    if (!args.length) return "mkdir: missing directory operand";
    return terminalCommands.createDirectory(fs, args[0]);
  },
  rm: (fs, args) => {
    if (!args.length) return "rm: missing operand";
    return terminalCommands.remove(fs, args[0]);
  },
  cat: (fs, args) => {
    if (!args.length) {
      return "cat: missing operand";
    }
    const file = getCurrentFiles(fs).find(
      (f) => f.name === args[0] && f.type === "file"
    );
    if (!file) {
      return `No such file or directory: ${args[0]}`;
    }
    return file.contents || "";
  },
  cd: (fs, path) => {
    if (!path) {
      return "cd: missing directory operand";
    }
    return terminalCommands.changeDirectory(fs, path);
  },
  pwd: (fs) => {
    return fs.currentWorkingDirectory || "/";
  },
  createFile: (fs, name) => {
    if (!name || typeof name !== "string") {
      return "Error: Invalid file name";
    }
    const files = getCurrentFiles(fs);
    if (files.find((f) => f.name === name)) {
      return `touch: ${name}: File exists`;
    }
    files.push({ name, type: "file", contents: "" });
    return "";
  },
  createDirectory: (fs, name) => {
    if (!name || typeof name !== "string") {
      return "Error: Invalid directory name";
    }
    const files = getCurrentFiles(fs);
    if (files.find((f) => f.name === name)) {
      return `mkdir: ${name}: Directory exists`;
    }
    files.push({ name, type: "directory" });
    fs.structure[`${fs.currentWorkingDirectory}/${name}`] = [];
    return "";
  },
  remove: (fs, name) => {
    if (!name || typeof name !== "string") {
      return "Error: Invalid name";
    }
    const files = getCurrentFiles(fs);
    const index = files.findIndex((f) => f.name === name);
    if (index === -1) {
      return `rm: ${name}: No such file or directory`;
    }
    const item = files[index];
    files.splice(index, 1);
    if (item.type === "directory") {
      delete fs.structure[`${fs.currentWorkingDirectory}/${name}`];
    }
    return "";
  },
  changeDirectory: (fs, path) => {
    if (!path || path === "~") {
      fs.currentWorkingDirectory = fs.root;
      return "";
    }

    if (path === "..") {
      if (fs.currentWorkingDirectory !== fs.root) {
        fs.currentWorkingDirectory = fs.currentWorkingDirectory.replace(/\/[^/]+$/, "");
      }
      return "";
    }

    if (path === ".") return "";

    const target = `${fs.currentWorkingDirectory}/${path}`;
    const exists = fs.structure[target];
    if (!exists) {
      return `cd: ${path}: No such directory`;
    }

    fs.currentWorkingDirectory = target;
    return "";
  },
};

export default terminalCommands;
