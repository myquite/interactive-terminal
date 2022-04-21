// function mockFileSystem() {
//   return {
//     root: "/Users/myquite",
//     currentWorkingDirectory: "/Users/myquite/Sites/js-terminal",
//     currentDirectories: ["styles", "scripts", "images"],
//     currentFiles: ["index.html"],
//     fileContents: {
//       "index.html": "Hello World",
//     },
//   };
// }

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
  };
}

export default mockFileSystem;
