const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("CodenetLang!");

class Type {
    static IDENTIFIER = "IDENTIFIER";
    static OPERATOR = "OPERATOR";
    static EOC = "ENDOFCOMMAND";
    static EQUALS = "EQUALS";
    static NUMBER = "NUMBER";
}

class Lexer {
    constructor(input) {
        this.i = input.toString().split(/\s+/);
        this.out = [];
    }

    lex() {
        const pAdd = /^\+$/;
        const pDigits = /^\d+$/;

        this.i.forEach(token => {
            if (pAdd.test(token)) {
                this.out.push({ Type: Type.OPERATOR, value: token });
            } else if (pDigits.test(token)) {
                this.out.push({ Type: Type.NUMBER, value: token });
            }
        });

        return this.out;
    }
}

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.it = this.tokens[Symbol.iterator]();
        this.current_token = this.it.next().value;
    }

    nextToken() {
        this.current_token = this.it.next().value;
    }

    parse() {
        if (!this.current_token) {
            return null;
        }

        let left = { Type: 'Literal', value: this.current_token.value };
        this.nextToken();

        while (this.current_token && this.current_token.Type === Type.OPERATOR) {
            const operator = this.current_token.value;
            this.nextToken();
            if (!this.current_token || this.current_token.Type !== Type.NUMBER) {
                throw new Error("Expected a number after operator");
            }

            let right = { Type: 'Literal', value: this.current_token.value };
            left = {
                Type: 'BinaryOperation',
                operator: operator,
                left: left,
                right: right
            };
            this.nextToken();
        }

        return left;
    }
}

class Interpreter {
    evaluateAST(ast) {
        if (ast.Type === 'Literal') {
            return parseInt(ast.value, 10);
        } else if (ast.Type === 'BinaryOperation') {
            let leftVal = this.evaluateAST(ast.left);
            let rightVal = this.evaluateAST(ast.right);

            switch (ast.operator) {
                case '+': return leftVal + rightVal;
                case '-': return leftVal - rightVal;
                case '*': return leftVal * rightVal;
                case '/':
                    if (rightVal === 0) {
                        throw new Error("Division by zero");
                    }
                    return leftVal / rightVal;
                default:
                    throw new Error(`Unsupported operator: ${ast.operator}`);
            }
        }
    }
}

rl.question("Enter your filepath: ", (filePath) => {
  rl.close(); //close terminal to prevent further input
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    const lexerInstance = new Lexer(data);
    const tokens = lexerInstance.lex();
    const parserInstance = new Parser(tokens);
    const ast = parserInstance.parse();
    const interpreter = new Interpreter();
    const result = interpreter.evaluateAST(ast);

    console.log("\n--------RESULT--------");
    console.log(`The result of your line of code is: ${result}\n`);
  });
});
