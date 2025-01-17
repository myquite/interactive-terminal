// start moving terminal commands into this file

let terminalCommands = {
  help: () => {
    return `
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
    <span class="cmd">`;
  },
  listFiles: (fs) => {
    let output = "";
    for (let i = 0; i < fs.length; i++) {
      if (fs[i].type === "directory") {
        output += `<span class="dir">${fs[i].name}</span> `;
      } else {
        output += `<span>${fs[i].name}</span> `;
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
    const file = fs.find((f) => f.name === args[0]);
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
    if (!fs || !fs.currentFileSystem) {
      return "Error: File system not initialized";
    }
    if (!name || typeof name !== "string") {
      return "Error: Invalid file name";
    }
    if (fs.currentFileSystem.find((f) => f.name === name)) {
      return `touch: ${name}: File exists`;
    }
    try {
      fs.currentFileSystem.push({
        name: name,
        type: "file",
        contents: "",
      });
      return "";
    } catch (error) {
      return `Error creating file: ${error.message}`;
    }
  },
  createDirectory: (fs, name) => {
    if (!fs || !fs.currentFileSystem) {
      return "Error: File system not initialized";
    }
    if (!name || typeof name !== "string") {
      return "Error: Invalid directory name";
    }
    if (fs.currentFileSystem.find((f) => f.name === name)) {
      return `mkdir: ${name}: Directory exists`;
    }
    try {
      fs.currentFileSystem.push({
        name: name,
        type: "directory",
      });
      return "";
    } catch (error) {
      return `Error creating directory: ${error.message}`;
    }
  },
  remove: (fs, name) => {
    if (!fs || !fs.currentFileSystem) {
      return "Error: File system not initialized";
    }
    if (!name || typeof name !== "string") {
      return "Error: Invalid name";
    }
    try {
      const index = fs.currentFileSystem.findIndex((f) => f.name === name);
      if (index === -1) {
        return `rm: ${name}: No such file or directory`;
      }
      fs.currentFileSystem.splice(index, 1);
      return "";
    } catch (error) {
      return `Error removing item: ${error.message}`;
    }
  },
  changeDirectory: (fs, path) => {
    if (!path || path === "~") {
      fs.currentWorkingDirectory = fs.root;
      return "";
    }

    if (path === "..") {
      const parts = fs.currentWorkingDirectory.split("/");
      if (parts.length > 3) {
        parts.pop();
        fs.currentWorkingDirectory = parts.join("/");
      }
      return "";
    }

    if (path === ".") return "";

    const targetDir = fs.currentFileSystem.find(
      (f) => f.name === path && f.type === "directory"
    );

    if (!targetDir) {
      return `cd: ${path}: No such directory`;
    }

    fs.currentWorkingDirectory += `/${path}`;
    return "";
  },
};

export default terminalCommands;
