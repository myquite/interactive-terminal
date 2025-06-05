let lessonCommands = {
  lesson: (args) => {
    // Normalize arguments coming from argv.args
    const firstArg = Array.isArray(args) ? args[0] : args;

    // Display usage information when called with --help or no args
    if (!firstArg || firstArg === "--help" || firstArg === "-h") {
      return (
        "Use the <span class=\"cmd\">lesson &lt;number&gt;</span> command to " +
        "start a guided exercise. Example: <span class=\"cmd\">lesson 1</span>."
      );
    }

    if (firstArg === "reset") {
      return "Lesson progress reset.";
    }

    const lessonNumber = firstArg.toString();
    switch (lessonNumber) {
      case "1":
        return `<span class=\"cmd\">Lesson ${lessonNumber}:</span> Find out where you are in the file system with the <em>'pwd'</em> command.`;
      default:
        return `Sorry, lesson ${lessonNumber} not found.`;
    }
  },
};

export default lessonCommands;
