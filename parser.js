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
    const add = /^\+$/;
    const sub = /^\-$/;
    const div = /^\/$/;
    const mult = /^\*$/;
    const eq = /^\=$/;
    const digit = /^\d+$/;
    const char = /^[a-zA-z]$/;
    const variable = /^set$/;
    const func_dec = /^def$/;
    const methods = /^(?:termite.log)$/;
    const ident = /^(?:\#\w+)$/;
    const par = /^(?::\()|(?:\):)$/;
    const block = /^(?::\|)|(?:\|:)$/;
    const term = /^\|$/;
    const comma = /^\,$/;

    //categorize tokens
    this.in.forEach((token) => {
      if (
        add.test(token) ||
        sub.test(token) ||
        div.test(token) ||
        mult.test(token)
      ) {
        this.out.push({ Type: Type.OPERATOR, value: token });
      } else if (eq.test(token)) {
        this.out.push({ Type: Type.EQUALS, value: token });
      } else if (digit.test(token)) {
        this.out.push({ Type: Type.NUMBER, value: token });
      } else if (char.test(token)) {
        this.out.push({ Token: Type.STRING, value: token });
      } else if (token.match(/^(?:\#\w+)/) && token.match(/\(|\)/)) {
        let guts = token.split(/\(|\)/);
        this.out.push({ Type: Type.IDENTIFIER, value: guts[0] });
        guts.slice(1, guts.length - 1).forEach((part) => {
          let params = part.split(",");
          params.forEach((param) => {
            this.out.push({ Type: Type.PARAMETER, value: param });
          });
        });
      } else if (variable.test(token)) {
        this.out.push({ Type: Type.VARIABLE, value: token });
      } else if (ident.test(token)) {
        this.out.push({ Type: Type.IDENTIFIER, value: token });
      } else if (func_dec.test(token)) {
        this.out.push({ Type: Type.FUNCTION, value: token });
      } else if (methods.test(token)) {
        this.out.push({ Type: Type.METHOD, value: token });
      } else if (par.test(token)) {
        this.out.push({ Type: Type.DELIMITER, value: token });
      } else if (comma.test(token)) {
        this.out.push({ Type: Type.DELIMITER, value: token });
      } else if (block.test(token)) {
        this.out.push({ Type: Type.DELIMITER, value: token });
      } else if (term.test(token)) {
        this.out.push({ Type: Type.TERMINATOR, value: token });
      } else if (token.match(/[^0-9]\|$/)) {
        let attached = token.substr(0, token.length - 1);
        this.out.push({ Type: Type.STRING, value: attached });
        let end = token.substr(token.length - 1, 1);
        this.out.push({ Type: Type.TERMINATOR, value: end });
      } else if (token.match(/\d+\|$/)) {
        let attached = token.substr(0, token.length - 1);
        this.out.push({ Type: Type.NUMBER, value: attached });
        let end = token.substr(token.length - 1, 1);
        this.out.push({ Type: Type.TERMINATOR, value: end });
      }
    });
    console.log(this.out);
  }
}
class Parser {
    constructor(tokens) {

    }

    nextToken() {

    }

    parse() {
        
    }
}