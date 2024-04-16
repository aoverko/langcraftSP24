console.log("My new PUDDLE language.");

class Type {
    static IDENTIFIER = "IDENTIFIER";
    static OPERATOR = "OPERATOR";
    static EOC = "ENDOFCOMMAND";
    static EQUALS = "EQUALS";
    static NUMBER = "NUMBER";
}

class Lexer {
    constructor(input) {
        this.i = input.split(/\s+/);
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

function prettyPrintAST(ast, indent = 0) {
    if (ast.Type === 'Literal') {
        console.log(' '.repeat(indent) + `Literal(${ast.value})`);
    } else if (ast.Type === 'BinaryOperation') {
        console.log(' '.repeat(indent) + `BinaryOperation(${ast.operator})`);
        console.log(' '.repeat(indent) + '├─ left:');
        prettyPrintAST(ast.left, indent + 4);
        console.log(' '.repeat(indent) + '└─ right:');
        prettyPrintAST(ast.right, indent + 4);
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

const input = "2 + + + 4 + 6 + 8 + 1000";
console.log("\n--------INPUT--------");
console.log(input);

const tokens = new Lexer(input).lex();
console.log("\n--------TOKENS--------");
console.log(tokens);

const ast = new Parser(tokens).parse();
console.log("\n--------AST--------");
console.log(ast);

const result = new Interpreter().evaluateAST(ast);
console.log("\n--------RESULT--------");
console.log(`The result of your line of code is: ${result}\n`);
