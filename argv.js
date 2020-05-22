function inputArgV(input) {
  const argv = input.split(" ");
  return argv;
}

let args = inputArgV("Hello World");

if (args[0] === "Hello") {
  console.log(`Hello ${args[1]}!`);
} else {
  console.log(`Command not found: ${args[0]}`);
}
