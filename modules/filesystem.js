function mockFileSystem() {
  return {
    root: "/Users/myquite",
    currentWorkingDirectory: "/Users/myquite/Sites/js-terminal",
    currentFileSystem: [
      { name: "styles", type: "directory" },
      { name: "scripts", type: "directory" },
      { name: "images", type: "directory" },
      { name: "index.html", type: "file", contents: "Hello World" },
    ],

    createFile: function (name) {
      if (this.currentFileSystem.find((f) => f.name === name)) {
        return `touch: ${name}: File exists`;
      }
      this.currentFileSystem.push({
        name: name,
        type: "file",
        contents: "",
      });
      return `Created file: ${name}`;
    },

    createDirectory: function (name) {
      if (this.currentFileSystem.find((f) => f.name === name)) {
        return `mkdir: ${name}: Directory exists`;
      }
      this.currentFileSystem.push({
        name: name,
        type: "directory",
      });
      return `Created directory: ${name}`;
    },

    remove: function (name) {
      const index = this.currentFileSystem.findIndex((f) => f.name === name);
      if (index === -1) {
        return `rm: ${name}: No such file or directory`;
      }
      this.currentFileSystem.splice(index, 1);
      return `Removed: ${name}`;
    },
  };
}

export default mockFileSystem;
