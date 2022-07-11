export const validateInput = function (nameInput, messageInput) {
  let result = true;
  const numbersAndSymbols = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "=",
    "+",
    "-",
    "_",
    ")",
    "(",
    "*",
    "&",
    "^",
    "%",
    "$",
    "#",
    "@",
    "!",
    "~",
    "`",
    '"',
    ";",
    ":",
    "/",
    "?",
    ">",
    ",",
    "<",
    "[",
    "]",
    "{",
    "}",
    "\\",
    "|",
  ];
  let bothNames = "";
  if (nameInput.length <= 1 || messageInput.length <= 1) {
    result = false;
  } else {
    for (let i = 0; i < numbersAndSymbols.length; i++) {
      if (nameInput.includes(numbersAndSymbols[i])) {
        result = false;
        break;
      }
    }
  }

  return result;
};
