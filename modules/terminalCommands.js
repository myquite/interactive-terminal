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
    <span class="cmd">echo</span> - lines of text or string which are passed as arguments
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
        output += args[i]
      }
    }
    return output;
  },
  lesson: () => {
    return "Lesson Loaded..."
  }
};

export default terminalCommands;
