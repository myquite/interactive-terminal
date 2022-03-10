function mockFileSystem() {
  return {
    root: "/Users/myquite",
    currentWorkingDirectory: "/Users/myquite/Sites/js-terminal",
    currentDirectories: ["styles", "scripts", "images"],
    currentFiles: ["index.html"],
    fileContents: {
      "index.html": "Hello World",
    },
  };
}

export default mockFileSystem;
