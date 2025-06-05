const lessons = {
  1: {
    description:
      "Find out where you are in the file system with the <em>'pwd'</em> command.",
    command: "pwd",
  },
};

function listLessons() {
  return Object.keys(lessons)
    .map(
      (num) =>
        `<span class=\"cmd\">${num}</span> - ${lessons[num].description}`
    )
    .join("<br>");
}

let lessonCommands = {
  lesson: (args) => {
    // Normalize arguments coming from argv.args
    const firstArg = Array.isArray(args) ? args[0] : args;

    // Display usage information when called with --help or no args
    if (!firstArg || firstArg === "--help" || firstArg === "-h") {
      return (
        "Use the <span class=\"cmd\">lesson &lt;number&gt;</span> command to " +
        "start a guided exercise. Example: <span class=\"cmd\">lesson 1</span>." +
        " Use <span class=\"cmd\">lesson ls</span> to list lessons."
      );
    }

    if (firstArg === "reset") {
      return "Lesson progress reset.";
    }

    if (firstArg === "ls") {
      return listLessons();
    }

    const lessonNumber = firstArg.toString();
    if (lessons[lessonNumber]) {
      return `<span class=\"cmd\">Lesson ${lessonNumber}:</span> ${lessons[lessonNumber].description}`;
    }
    return `Sorry, lesson ${lessonNumber} not found.`;
  },
};

export { lessons };
export default lessonCommands;
