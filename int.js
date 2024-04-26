const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

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
  
  class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.index = 0;
    }

    parse() {
        const ast = [];
        while (this.index < this.tokens.length) {
            const token = this.tokens[this.index];
            switch (token.Type) {
                case Type.DECLARE:
                    ast.push(this.parseDeclaration());
                    break;
                case Type.FUNCTION:
                    ast.push(this.parseFunction());
                    break;
                case Type.METHOD:
                    ast.push(this.parseMethod());
                    break;
                default:
                    this.index++;  // Skip tokens that don't start a statement
            }
        }
        console.log("AST generated:", ast);
        return ast;
    }

    parseDeclaration() {
        const nameToken = this.tokens[++this.index]; // assuming next token is the identifier
        const equalsToken = this.tokens[++this.index]; // assuming next token is '='
        const valueToken = this.tokens[++this.index]; // assuming next token is the value
        this.index++; // move past the end of declaration
        return {
            type: 'Declaration',
            name: nameToken.value,
            value: valueToken.value
        };
    }

    parseFunction() {
        const nameToken = this.tokens[++this.index]; // function name
        // Add parsing for parameters and function body as needed
        this.index++; // adjust according to function parsing logic
        return {
            type: 'Function',
            name: nameToken.value
            // include parameters and body when implemented
        };
    }

    parseMethod() {
        const methodName = this.tokens[++this.index].value; // Get method name
        this.index++; // Assuming method ends after name for simplicity
        return {
            type: 'MethodCall',
            methodName
        };
    }
}

class Interpreter {
    constructor() {
        this.variables = {};
        this.lastEvaluated = null; // This will store the last evaluated result
    }

    evaluateAST(ast) {
        ast.forEach(node => {
            if (node.type === 'Declaration') {
                this.variables[node.name] = this.evaluateExpression(node.value);
                this.lastEvaluated = this.variables[node.name]; // Update last evaluated
                console.log(`Variable ${node.name} set to ${this.variables[node.name]}`);
            } else if (node.type === 'MethodCall' && node.methodName === 'termite.log') {
                // Assuming 'termite.log' logs the variable value
                console.log("Logging:", this.variables[node.methodName]); // This line might need adjustment based on actual logic
                this.lastEvaluated = this.variables[node.methodName]; // Update last evaluated
            } else if (node.type === 'Function') {
                // Handle function logic here
                console.log(`Function ${node.name} defined`); // Function definition logic
                // Update lastEvaluated as needed based on function logic
            }
        });
        console.log("Interpreter Variable Store:", this.variables);
        return this.lastEvaluated; // Return the last evaluated result
    }

    evaluateExpression(expression) {
        // Placeholder for expression evaluation logic
        return expression; // Direct return for simplicity in this example
    }
}


// Example usage remains the same, ensuring the interpreter is invoked after parsing.


rl.question("Enter your file name: ", (fileName) => {
    fs.readFile(fileName, "utf8", (err, data) => {
        rl.close();
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        const lexer = new Lexer(data);
        const tokens = lexer.lex();
        const parser = new Parser(tokens);
        const ast = parser.parse();
        const interpreter = new Interpreter();
        const result = interpreter.evaluateAST(ast); // This should capture the last evaluated result

        console.log("\n--------RESULT--------");
        console.log(`The result of your line of code is: ${result}\n`);
    });
});

