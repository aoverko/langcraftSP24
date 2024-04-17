//useful Node.js links for ref:
// readline: https://www.geeksforgeeks.org/node-js-readline-module/
// readfile: https://stackoverflow.com/questions/10058814/get-data-from-fs-readfile

//Import Libraries: File System and Readline (for user interaction)
const fs = require("fs");
const readline = require("readline");

//User Interface (terminal)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//Get file data from user
rl.question("Enter your file name: ", (fileName) => {
  rl.close(); //close terminal to prevent further input
  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      lexer(data);
    }
  });
});

//Lexer logic
//included types we might not use just so the blueprint is there
class Type {
  static STRING = "STRING";
  static NUMBER = "NUMBER";
  static IDENTIFIER = "IDENTIFIER";
  static VARIABLE = "VARIABLE";
  static EQUALS = "EQUALS";
  static OPERATOR = "OPERATOR";
  static FUNCTION = "FUNCTION";
  static PARAMETER = "PARAMETER";
  static METHOD = "METHOD";
  static KEYWORD = "KEYWORD";
  static DELIMITER = "DELIMITER";
  static TERMINATOR = "TERMINATOR";
}

function lexer(fileData) {
  console.log("hello");
}
