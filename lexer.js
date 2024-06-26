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
  rl.close();
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
  static DECLARE = "DECLARE";
  static EQUALS = "EQUALS";
  static OPERATOR = "OPERATOR";
  static FUNCTION = "FUNCTION";
  static CLASS = "CLASS";
  static PARAMETER = "PARAMETER";
  static ARRAY = "ARRAY";
  static ARR_VALS = "ARR_VALS";
  static METHOD = "METHOD";
  static KEYWORD = "KEYWORD";
  static DELIMITER = "DELIMITER";
  static TERMINATOR = "TERMINATOR";
}

class Lexer {
  constructor(input) {
    this.in = input.toString().split(/\s+/);
    this.base = this.processInput();
    this.out = [];
  }
  //find instances where a token is split by a space and group it
  //also groups comments so they don't tokenize
  processInput() {
    let output = [];
    let matches = "";
    let isMatching = false;
    this.in.forEach((token) => {
      if (token.match(/termite\.log\([^()]+\)/)) {
        output.push(token);
      } else if (
        (!isMatching &&
          (token.match(/termite\.log/) ||
            token.match(/^\*\//) ||
            token.match(/^\*\*/))) ||
        token.match(/^\{/)
      ) {
        isMatching = true;
        matches = token + " ";
      } else if (
        isMatching &&
        (token.match(/\)/) ||
          token.match(/\/\*$/) ||
          token.match(/\*\*$/) ||
          token.match(/\}\|$/) ||
          token.match(/\}$/))
      ) {
        isMatching = false;
        matches += token;
        output.push(matches);
      } else if (isMatching) {
        matches += token + " ";
      } else {
        output.push(token);
      }
    });
    return output;
  }

  processArray(token) {
    let l_brace = token.match(/\{/);
    let r_brace = token.match(/\}/);
    let guts = token.split(/\{|\}/);
    this.out.push({ Type: Type.DELIMITER, value: l_brace[0] });
    guts.slice(1, guts.length - 1).forEach((part) => {
      let values = part.split("," || ", ");
      values.forEach((value) => {
        let index = value.trim();
        this.out.push({ Type: Type.ARR_VALS, value: index });
      });
    });
    if (token.match(/\}\|/)) {
      this.out.push({ Type: Type.DELIMITER, value: r_brace[0] });
      this.out.push({
        Type: Type.TERMINATOR,
        value: guts[guts.length - 1],
      });
    } else if (r_brace) {
      this.out.push({
        Type: Type.DELIMITER,
        value: r_brace[r_brace.length - 1],
      });
    }
  }

  //helper function: tokenize functional syntax
  categorize(token, type) {
    let guts = token.split(/\(|\)/);
    let l_par = token.match(/\(/);
    let r_par = token.match(/\)/);
    this.out.push({ Type: type, value: guts[0] });
    this.out.push({ Type: Type.DELIMITER, value: l_par[0] });
    guts.slice(1, guts.length - 1).forEach((part) => {
      if (type == Type.FUNC_NAME) {
        let params = part.split("," || ", ");
        params.forEach((param) => {
          this.out.push({ Type: Type.PARAMETER, value: param });
        });
      } else if (type == Type.METHOD) {
        this.out.push({ Type: Type.PARAMETER, value: part });
      }
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
        this.out.push({ Type: Type.STRING, value: token });
      } else if (token.match(/^(?:\#\w+)/) && token.match(/\(|\)/)) {
        this.categorize(token, Type.FUNC_NAME);
      } else if (token.match(/^set$/)) {
        this.out.push({ Type: Type.DECLARE, value: token });
      } else if (token.match(/^(?:\#\w+)$/)) {
        this.out.push({ Type: Type.IDENTIFIER, value: token });
      } else if (token.match(/^group$/)) {
        this.out.push({ Type: Type.CLASS, value: token });
      } else if (token.match(/^def$/)) {
        this.out.push({ Type: Type.FUNCTION, value: token });
      } else if (token.match(/termite\.log\(/)) {
        this.categorize(token, Type.METHOD);
      } else if (token.match(/^Return$/)) {
        this.out.push({Type: Type.METHOD, value: token});
      } else if (token.match(/^\{/)) {
        this.processArray(token);
      } else if (token.match(/^(?:\()|(?:\):)$/)) {
        this.out.push({ Type: Type.DELIMITER, value: token });
      } else if (token.match(/^\,$/)) {
        this.out.push({ Type: Type.DELIMITER, value: token });
      } else if (token.match(/^(?::\|)|(?:\|:)$/)) {
        this.out.push({ Type: Type.DELIMITER, value: token });
        //tokenize terminator
      } else if (token.match(/^\|$/)) {
        this.out.push({ Type: Type.TERMINATOR, value: token });
      } else if (token.match(/[^0-9 | \) | \}]\|$/)) {
        this.termCase(token, Type.STRING);
      } else if (token.match(/\d+\|$/)) {
        this.termCase(token, Type.NUMBER);
      }
    });
    console.log(this.out);
    return this.out;
  }
}
