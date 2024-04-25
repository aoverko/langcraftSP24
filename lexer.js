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
  static FUNC_NAME = "FUNC_NAME";
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
    this.base = this.process();
    this.out = [];
  }
  //find instances where a token is split by a space and group it
  //also groups multi-line comments so they don't tokenize
  process() {
    let output = [];
    let matches = "";
    let isMatching = false;
    this.in.forEach((token) => {
      if (
        !isMatching &&
        (token.match(/termite\.log/) || token.match(/^\*\//))
      ) {
        isMatching = true;
        matches = token;
      } else if (isMatching && (token.match(/\)/) || token.match(/\/\*$/))) {
        isMatching = false;
        matches += token;
        output.push(matches);
        matches = "";
      } else if (isMatching) {
        matches += token;
      } else {
        output.push(token);
      }
    });
    return output;
  }

  //helper function: tokenize complex syntax
  categorize(token, type) {
    let guts = token.split(/\(|\)/);
    let l_par = token.match(/\(/);
    let r_par = token.match(/\)/);
    this.out.push({ Type: type, value: guts[0] });
    this.out.push({ Type: Type.DELIMITER, value: l_par[0] });
    guts.slice(1, guts.length - 1).forEach((part) => {
      let params = part.split(",");
      params.forEach((param) => {
        this.out.push({ Type: Type.PARAMETER, value: param });
        if (param.match(/\s+/)) {
          this.out.push({ Type: Type.PARAMETER, value: "," });
        }
      });
    });
    if (token.match(/\)\|$/)) {
      this.out.push({ Type: Type.DELIMITER, value: r_par[0] });
      this.out.push({
        Type: Type.TERMINATOR,
        value: guts[guts.length - 1],
      });
    } else if (r_par) {
      this.out.push({
        Type: Type.DELIMITER,
        value: r_par[r_par.length - 1],
      });
    }
  }

  //helper function for when there's no space btwn a terminator and value
  termCase(token, type) {
    let attached = token.substr(0, token.length - 1);
    this.out.push({ Type: type, value: attached });
    let end = token.substr(token.length - 1, 1);
    this.out.push({ Type: Type.TERMINATOR, value: end });
  }

  lex() {
    //still need to add cases for arrays, if/else, classes
    this.base.forEach((token) => {
      if (
        token.match(/^\+$/) ||
        token.match(/^\-$/) ||
        token.match(/^\/$/) ||
        token.match(/^\*$/) ||
        token.match(/^\</) ||
        token.match(/^\>/) ||
        token.match(/^\<\=/) ||
        token.match(/^\>\=/) ||
        token.match(/^and$/) ||
        token.match(/^or$/) ||
        token.match(/^not$/) ||
        token.match(/^T\:$/) ||
        token.match(/^F\:$/)
      ) {
        this.out.push({ Type: Type.OPERATOR, value: token });
      } else if (token.match(/^\=$/)) {
        this.out.push({ Type: Type.EQUALS, value: token });
      } else if (token.match(/^\d+$/)) {
        this.out.push({ Type: Type.NUMBER, value: token });
      } else if (token.match(/^[a-zA-z]$/)) {
        if (token.match(/\*\/[\s\S]*\/\*/)) {
          return;
        } else {
          this.out.push({ Type: Type.STRING, value: token });
        }
      } else if (token.match(/^(?:\#\w+)/) && token.match(/\(|\)/)) {
        this.categorize(token, Type.FUNC_NAME);
      } else if (token.match(/^set$/)) {
        this.out.push({ Type: Type.VARIABLE, value: token });
      } else if (token.match(/^(?:\#\w+)$/)) {
        this.out.push({ Type: Type.IDENTIFIER, value: token });
      } else if (token.match(/^def$/)) {
        this.out.push({ Type: Type.FUNCTION, value: token });
      } else if (token.match(/termite\.log\(/)) {
        this.categorize(token, Type.METHOD);
      } else if (token.match(/^(?:\()|(?:\):)$/)) {
        this.out.push({ Type: Type.DELIMITER, value: token });
      } else if (token.match(/^\,$/)) {
        this.out.push({ Type: Type.DELIMITER, value: token });
      } else if (token.match(/^(?::\|)|(?:\|:)$/)) {
        this.out.push({ Type: Type.DELIMITER, value: token });
        //tokenize terminator
      } else if (token.match(/^\|$/)) {
        this.out.push({ Type: Type.TERMINATOR, value: token });
      } else if (token.match(/[^0-9 | \)]\|$/)) {
        this.termCase(token, Type.STRING);
      } else if (token.match(/\d+\|$/)) {
        this.termCase(token, Type.NUMBER);
      }
    });
    console.log(this.out);
  }
}
