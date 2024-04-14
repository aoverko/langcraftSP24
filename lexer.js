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
  rl.close();
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return;
    } else {
      fileData = data;
      console.log(data);
    }
  });
});


//lexer logic (do later)
