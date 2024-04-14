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
rl.question("Enter your filepath: ", (filePath) => {
  rl.close(); //close terminal to prevent further input
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      lexer(data);
    }
  });
});


//Lexer logic
function lexer(fileData){

};
