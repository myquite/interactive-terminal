let lessonCommands = {
  lesson: (arg) => {
    let lessonNumber = arg.toString();
    switch (lessonNumber) {
      case "1":
        let output = `<span class="cmd">Lesson ${arg}:</span> Find out where you are in the file system with the <em>'pwd'</em> command.`;
        return output;
      default:
        console.log(`Sorry`);
    }
  },
};

export default lessonCommands;
