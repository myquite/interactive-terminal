// start moving terminal commands into this file

let terminalCommands = {
  help: () => {
    return `
    <span class="cmd">help</span> - displays this help message
    <br>
    <span class="cmd">clear</span> - clears the terminal
    <br>
    <span class="cmd">ls</span> - lists files and folders in the current directory
    <br>
    <span class="cmd">cat</span> - displays the contents of a file
    <br>
    <span class="cmd">pwd</span> - displays the current working directory
    <br>
    <span class="cmd">cd</span> - change directory
    <br>
    <span class="cmd">echo</span> - displays lines of text or string passed as arguments
    <br>
    <span class="cmd">touch</span> - creates a new empty file
    <br>
    <span class="cmd">mkdir</span> - creates a new directory
    <br>
    <span class="cmd">rm</span> - removes a file or directory
    <br>
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
    return fs.createFile(args[0]);
  },
  mkdir: (fs, args) => {
    if (!args.length) return "mkdir: missing directory operand";
    return fs.createDirectory(args[0]);
  },
  rm: (fs, args) => {
    if (!args.length) return "rm: missing operand";
    return fs.remove(args[0]);
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
    // TODO: Implement directory change logic
    return `Changed to directory: ${path}`;
  },
  pwd: (fs) => {
    return fs.currentWorkingDirectory || "/";
  },
};

export default terminalCommands;
