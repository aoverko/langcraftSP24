const fs = require("fs"); //import filesystem library
const readline = require("readline"); //import readline library

const rl = readline.createInterface({ //create interface
    input: process.stdin,
    output: process.stdout
  });

//define token types
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
        //case for termite.log with no spaces so it's not overridden by the case with spaces
        if (token.match(/termite\.log\([^()]+\)/)) { 
          output.push(token);
        } else if ( //first match where something might be split by an unwanted space
          (!isMatching && 
            (token.match(/termite\.log/) ||
              token.match(/^\*\//) ||
              token.match(/^\*\*/))) ||
          token.match(/^\{/)
        ) {//add the token to the matches
          isMatching = true;
          matches = token + " ";
        } else if ( //matches the end of that case and adds it to matches. isMatching now false
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
        } else if (isMatching) { //while still matching add token to matches
          matches += token + " ";
        } else { //otherwise tokens are added as usual
          output.push(token);
        }
      });
      return output; //output fed to this.base in constructor
    }
    
    //helper function: separate {} delims and individual array values
    processArray(token) {
      let l_brace = token.match(/\{/);
      let r_brace = token.match(/\}/);
      let guts = token.split(/\{|\}/); //reduce array to the values
      this.out.push({ Type: Type.DELIMITER, value: l_brace[0] }); //if { matches, output it
      guts.slice(1, guts.length - 1).forEach((part) => {
        let values = part.split("," || ", "); //split into individual values
        values.forEach((value) => {
          let index = value.trim(); //remove spaces
          this.out.push({ Type: Type.ARR_VALS, value: index }); //output value
        });
      });
      if (token.match(/\}\|/)) { //output }|
        this.out.push({ Type: Type.DELIMITER, value: r_brace[0] });
        this.out.push({
          Type: Type.TERMINATOR,
          value: guts[guts.length - 1],
        });
      } else if (r_brace) { //output }
        this.out.push({
          Type: Type.DELIMITER,
          value: r_brace[r_brace.length - 1],
        });
      }
    }
  
    //helper function: tokenize functional syntax (functions and termite.log)
    categorize(token, type) {
      let guts = token.split(/\(|\)/); //reduce function to parameters and function name
      let l_par = token.match(/\(/);
      let r_par = token.match(/\)/);
      this.out.push({ Type: type, value: guts[0] }); //output function name
      this.out.push({ Type: Type.DELIMITER, value: l_par[0] }); //if ( matches, output it
      guts.slice(1, guts.length - 1).forEach((part) => {
        if (type == Type.FUNC_NAME) {//split into indiv params if function and output each one
          let params = part.split("," || ", "); 
          params.forEach((param) => {
            this.out.push({ Type: Type.PARAMETER, value: param });
          });
        } else if (type == Type.METHOD) {//output the message if it's termite.log
          this.out.push({ Type: Type.PARAMETER, value: part });
        }
      });
      if (token.match(/\)\|$/)) {//output )|
        this.out.push({ Type: Type.DELIMITER, value: r_par[0] });
        this.out.push({
          Type: Type.TERMINATOR,
          value: guts[guts.length - 1],
        });
      } else if (r_par) {//output )
        this.out.push({
          Type: Type.DELIMITER,
          value: r_par[r_par.length - 1],
        });
      }
    }
  
    //helper function: when there's no space btwn a terminator and value
    termCase(token, type) {
      let attached = token.substr(0, token.length - 1);
      this.out.push({ Type: type, value: attached }); //output whatever is to the left of |
      let end = token.substr(token.length - 1, 1);
      this.out.push({ Type: Type.TERMINATOR, value: end }); //output |
    }
  
    lex() {
      //tokenize operators
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
          //tokenize assignment op: = 
        } else if (token.match(/^\=$/)) {
          this.out.push({ Type: Type.EQUALS, value: token });
          //tokenize numbers
        } else if (token.match(/^\d+$/)) {
          this.out.push({ Type: Type.NUMBER, value: token });
          //tokenize characters
        } else if (token.match(/^[a-zA-z]$/)) {
          this.out.push({ Type: Type.STRING, value: token });
          //tokenize functions by calling the helper function
        } else if (token.match(/^(?:\#\w+)/) && token.match(/\(|\)/)) {
          this.categorize(token, Type.FUNC_NAME);
          //tokenize variable declaration
        } else if (token.match(/^set$/)) {
          this.out.push({ Type: Type.DECLARE, value: token });
          //tokenize identifiers
        } else if (token.match(/^(?:\#\w+)$/)) {
          this.out.push({ Type: Type.IDENTIFIER, value: token });
          //tokenize class declaration
        } else if (token.match(/^group$/)) {
          this.out.push({ Type: Type.CLASS, value: token });
          //tokenize function declaration
        } else if (token.match(/^def$/)) {
          this.out.push({ Type: Type.FUNCTION, value: token });
          //tokenize the termite.log method with a helper function call
        } else if (token.match(/termite\.log\(/)) {
          this.categorize(token, Type.METHOD);
          //tokenize the Return method
        } else if (token.match(/^Return$/)) {
          this.out.push({Type: Type.METHOD, value: token});
          //tokenize arrays and their values (with helper function)
        } else if (token.match(/^\{/)) {
          this.processArray(token);
          //tokenize individual delimiters ( )
        } else if (token.match(/^(?:\()|(?:\):)$/)) {
          this.out.push({ Type: Type.DELIMITER, value: token });
          //tokenize individual commas
        } else if (token.match(/^\,$/)) {
          this.out.push({ Type: Type.DELIMITER, value: token });
          //tokenize individual code block delimiters
        } else if (token.match(/^(?::\|)|(?:\|:)$/)) {
          this.out.push({ Type: Type.DELIMITER, value: token });
          //tokenize individual terminator
        } else if (token.match(/^\|$/)) {
          this.out.push({ Type: Type.TERMINATOR, value: token });
          //tokenize terminator attached to a character/string
        } else if (token.match(/[^0-9 | \) | \}]\|$/)) {
          this.termCase(token, Type.STRING);
          //tokenize terminator attached to a number
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
        const nameToken = this.tokens[++this.index]; // next token is the identifier
        const equalsToken = this.tokens[++this.index]; // next token is '='
        const valueToken = this.tokens[++this.index]; // next token is the value
        this.index++; // move past the end of declaration
        return {
            type: 'Declaration',
            name: nameToken.value,
            value: valueToken.value
        };
    }

    parseFunction() {
        const nameToken = this.tokens[++this.index]; // function name
        // Add parsing for parameters and function body
        this.index++; // adjust according to function parsing logic
        return {
            type: 'Function',
            name: nameToken.value
            // include parameters and body
        };
    }

    parseMethod() {
        const methodName = this.tokens[++this.index].value; // Get method name
        this.index++; // method ends after name
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
                // 'termite.log' logs the variable value
                console.log("Logging:", this.variables[node.methodName]); 
                this.lastEvaluated = this.variables[node.methodName]; // Update last evaluated
            } else if (node.type === 'Function') {
                // Handle function logic here
                console.log(`Function ${node.name} defined`); // Function definition logic
                
            }
        });
        console.log("Interpreter Variable Store:", this.variables);
        return this.lastEvaluated; // Return the last evaluated result
    }

    evaluateExpression(expression) {
        // Placeholder for expression evaluation logic
        return expression; // Direct return for simplicity
    }
}




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

