function mockFileSystem() {
  const fs = {
    root: "/Users/user/Project",
    currentDirectories: ["styles", "scripts", "images"],
    currentFiles: ["index.html"],
  };
  return fs;
}

export default mockFileSystem;
