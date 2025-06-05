const modules = {
  1: {
    description: "Basic navigation",
    lessons: [1, 2, 3, 4],
  },
};

function listModules() {
  return Object.keys(modules)
    .map(
      (num) =>
        `<span class=\"cmd\">${num}</span> - ${modules[num].description} (lessons: ${modules[num].lessons.join(', ')})`
    )
    .join("<br>");
}

let moduleCommands = {
  module: (args) => {
    const firstArg = Array.isArray(args) ? args[0] : args;

    if (!firstArg || firstArg === "--help" || firstArg === "-h") {
      return (
        "Use the <span class=\"cmd\">module &lt;number&gt;</span> command to " +
        "start a module. Use <span class=\"cmd\">module ls</span> to list modules."
      );
    }

    if (firstArg === "ls") {
      return listModules();
    }

    const moduleNumber = firstArg.toString();
    if (modules[moduleNumber]) {
      const m = modules[moduleNumber];
      return `<span class=\"cmd\">Module ${moduleNumber}:</span> ${m.description} (lessons: ${m.lessons.join(', ')})`;
    }
    return `Sorry, module ${moduleNumber} not found.`;
  },
};

export { modules };
export default moduleCommands;
