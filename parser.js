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
    }
    const lexerInstance = new Lexer(data);
    const tokens = lexerInstance.lex();
    console.log(tokens);
    rl.close();
  });
});

//Lexer logic
//included types we might not use just so the blueprint is there
//basically the same effect as enums in the Type class w| static
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

class Lexer {
  constructor(input) {
    this.in = input.toString().split(/\s+/);
    this.out = [];
  }

  lex() {
    //regex to scan for and tokenize. Can include more groups for methods/keywords as lang grows
    //still need to add cases for arrays, logical ops, and bools
    const regexP = {
        add: /^\+$/,
        sub: /^\-$/,
        div: /^\/$/,
        mult: /^\*$/,
        eq: /^\=$/,
        digit: /^\d+$/,
        char: /^[a-zA-z]$/,
        variable: /^set$/,
        func_dec: /^def$/,
        methods: /^(?:termite.log)$/,
        ident: /^(?:\#\w+)$/,
        par: /^(?::\()|(?:\):)$/,
        block: /^(?::\|)|(?:\|:)$/,
        term: /^\|$/,
        comma: /^\,$/,
    };

    //categorize tokens
    this.in.forEach((token) => {
        for (const [type, regex] of Object.entries(regexP)) {
          if (regex.test(token)) {
            this.out.push({ Type: type.toUpperCase(), value: token });
            return; 
          }
        }
        // for unmatched tokens or UNKNOWN tokens
        this.out.push({ Type: "UNKNOWN", value: token });
      });
  
      return this.out;
  }
}
