function mockFileSystem() {
  const root = "/Users/myquite";
  const base = `${root}/Sites/js-terminal`;

  // simple map of absolute paths to their contents
  const structure = {};

  // root level
  structure[root] = [{ name: "Sites", type: "directory" }];
  structure[`${root}/Sites`] = [{ name: "js-terminal", type: "directory" }];

  structure[base] = [
    { name: "styles", type: "directory" },
    { name: "scripts", type: "directory" },
    { name: "images", type: "directory" },
    { name: "index.html", type: "file", contents: "Hello World" },
  ];

  // initialize empty directories
  structure[`${base}/styles`] = [];
  structure[`${base}/scripts`] = [];
  structure[`${base}/images`] = [];

  return {
    root,
    currentWorkingDirectory: base,
    structure,
  };
}

export default mockFileSystem;
