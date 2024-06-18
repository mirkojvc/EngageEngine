export function parseMessage(message, ...args) {
  let i = 0;
  while (message.includes("%s")) {
    message = message.replace("%s", args[i]);
    i++;
  }
  return message;
}
