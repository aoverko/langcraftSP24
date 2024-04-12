//Test case for sample.cnet
//double check if comment inits = strings

const tokens = [
    //COMMENTS
    {"type" : type.STRING, "value" : "**"},
    {"type" : type.STRING, "value" : "This"},
    {"type" : type.STRING, "value" : "is"},
    {"type" : type.STRING, "value" : "a"},
    {"type" : type.STRING, "value" : "single"},
    {"type" : type.STRING, "value" : "comment"},
    {"type" : type.STRING, "value" : "*/"},
    {"type" : type.STRING, "value" : "This"},
    {"type" : type.STRING, "value" : "is"},
    {"type" : type.STRING, "value" : "a"},
    {"type" : type.STRING, "value" : "multi"},
    {"type" : type.STRING, "value" : "line"},
    {"type" : type.STRING, "value" : "comment"},
    {"type" : type.STRING, "value" : "/*"}, 

    //TERMITE.LOG
    //Separate indiv methods based on ( )... not sure if in "" or not
    {"type" : type.METHOD, "value" : termite.log},
    {"type" : type.DELIMITER, "value" : (},
    {"type" : type.STRING, "value" : "Hello,"},
    {"type" : type.STRING, "value" : "world!"},
    {"type" : type.DELIMITER, "value" : )},
    {"type" : type.TERMINATOR, "value" : |},

    //#PROJECT
    {"type" : type.VARIABLE, "value" : set},
    {"type" : type.IDENTIFIER, "value" : #project},
    {"type" : type.ASSIGNMENT, "value" : =},
    {"type" : type.STRING, "value" : "CodeNetLang"},
    {"type" : type.TERMINATOR, "value" : |},

    //#ADD -- figure out how to separate the elements w|out spaces here
    {"type" : type.FUNCTION, "value" : def},
    {"type" : type.IDENTIFIER, "value" : #add},
    {"type" : type.DELIMITER, "value" : (},
    {"type" : type.PARAM, "value" : a},
    {"type" : type.DELIMITER, "value" : ,},
    {"type" : type.PARAM, "value" : b},
    {"type" : type.DELIMITER, "value" : )},
    {"type" : type.DELIMITER, "value" : :|},
    {"type" : type.KEYWORD, "value" : Return},
    {"type" : type.PARAM, "value" : a},
    {"type" : type.OPERATOR, "value" : +},
    {"type" : type.PARAM, "value" : b},
    {"type" : type.TERMINATOR, "value" : |},
    {"type" : type.DELIMITER, "value" : |:},

    // #RESULT
    {"type" : type.VARIABLE, "value" : set},
    {"type" : type.IDENTIFIER, "value" : #result},
    {"type" : type.ASSIGNMENT, "value" : =},
    {"type" : type.IDENTIFIER, "value" : #add},
    {"type" : type.DELIMITER, "value" : (},
    {"type" : type.PARAM, "value" : 5},
    {"type" : type.DELIMITER, "value" : ,},
    {"type" : type.PARAM, "value" : 3},
    {"type" : type.DELIMITER, "value" : )},
    {"type" : type.TERMINATOR, "value" : |},
    {"type" : type.METHOD, "value" : termite.log},
    {"type" : type.DELIMITER, "value" : (},
    {"type" : type.IDENTIFIER, "value" : #result},
    {"type" : type.DELIMITER, "value" : )},
    {"type" : type.TERMINATOR, "value" : |}
]