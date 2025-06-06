# Interactive Terminal

![myquite github io_interactive-terminal_](https://user-images.githubusercontent.com/997046/131572741-44267951-d5a4-4e7e-987d-865bb9cc0004.png)

Goal: Build a Interactive Web-based Terminal Simulator to work through exercises and build confidence with basic command-line tools.

Current Commands:

- clear
- echo
- pwd
- ls
- cat
- help

- test (shows how the input in the terminal is being broken up into command, options, and arguments)
  Example: test -h -r "Hello World"

## Lessons

Use the `lesson` command to start a guided exercise. When you finish a lesson by entering the correct command, the help bar will confirm completion and prompt you for the next lesson.

Run `lesson --help` for details on how the lesson system works and how to start a specific lesson.

Use `lesson reset` to restart the lesson progress at any time.
Use `lesson ls` to list all available lessons.

### Available Lessons

1. `pwd` - show the current directory
2. `ls` - list files and folders
3. `cd styles` - navigate into the styles directory
4. `cd ..` - return to the previous directory

Live Project: [Interactive Terminal](https://myquite.github.io/interactive-terminal/)

## Priority Tasks

- Implement missing command handlers in terminalCommands.js
- Add file manipulation commands (touch, mkdir, rm)
- Add file content viewing/editing
- Add proper error handling
