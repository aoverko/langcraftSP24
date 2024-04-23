// Define constants for types
// Test case for sample.cnet
const type = {
    STRING: 'STRING',
    METHOD: 'METHOD',
    DELIMITER: 'DELIMITER',
    TERMINATOR: 'TERMINATOR',
    VARIABLE: 'VARIABLE',
    IDENTIFIER: 'IDENTIFIER',
    ASSIGNMENT: 'ASSIGNMENT',
    FUNCTION: 'FUNCTION',
    PARAM: 'PARAM',
    KEYWORD: 'KEYWORD',
    OPERATOR: 'OPERATOR'
};

// Token definitions
const tokens = [
    // COMMENTS
    {"type": type.STRING, "value": "**"},  // single-line comment
    {"type": type.STRING, "value": "*/"},  // Starts a multi-line comment
    {"type": type.STRING, "value": "/*"},  // Closes a multi-line comment

    // TERMITE.LOG
    {"type": type.METHOD, "value": "termite.log"},
    {"type": type.DELIMITER, "value": "("},
    {"type": type.STRING, "value": "Hello,"},
    {"type": type.STRING, "value": "world!"},
    {"type": type.DELIMITER, "value": ")"},
    {"type": type.TERMINATOR, "value": "|"},

    // #PROJECT
    {"type": type.VARIABLE, "value": "set"},
    {"type": type.IDENTIFIER, "value": "#project"},
    {"type": type.ASSIGNMENT, "value": "="},
    {"type": type.STRING, "value": "CodeNetLang"},
    {"type": type.TERMINATOR, "value": "|"},

    // #ADD
    {"type": type.FUNCTION, "value": "def"},
    {"type": type.IDENTIFIER, "value": "#add"},
    {"type": type.DELIMITER, "value": "("},
    {"type": type.PARAM, "value": "a"},
    {"type": type.DELIMITER, "value": ","},
    {"type": type.PARAM, "value": "b"},
    {"type": type.DELIMITER, "value": ")"},
    {"type": type.DELIMITER, "value": ":|"},
    {"type": type.KEYWORD, "value": "Return"},
    {"type": type.PARAM, "value": "a"},
    {"type": type.OPERATOR, "value": "+"},
    {"type": type.PARAM, "value": "b"},
    {"type": type.TERMINATOR, "value": "|"},
    {"type": type.DELIMITER, "value": "|:"},

    // #RESULT
    {"type": type.VARIABLE, "value": "set"},
    {"type": type.IDENTIFIER, "value": "#result"},
    {"type": type.ASSIGNMENT, "value": "="},
    {"type": type.IDENTIFIER, "value": "#add"},
    {"type": type.DELIMITER, "value": "("},
    {"type": type.PARAM, "value": "5"},
    {"type": type.DELIMITER, "value": ","},
    {"type": type.PARAM, "value": "3"},
    {"type": type.DELIMITER, "value": ")"},
    {"type": type.TERMINATOR, "value": "|"},
    {"type": type.METHOD, "value": "termite.log"},
    {"type": type.DELIMITER, "value": "("},
    {"type": type.IDENTIFIER, "value": "#result"},
    {"type": type.DELIMITER, "value": ")"},
    {"type": type.TERMINATOR, "value": "|"}
];

console.log(tokens); // Output the tokens to the console for debugging
