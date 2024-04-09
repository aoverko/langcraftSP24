//Test case for sample.cnet
//double check if comment inits = strings

const tokens = [
    //TECHNICALLY don't tokenize these but just in case:

    // {"type" : type.STRING, "value" : "//"},
    // {"type" : type.STRING, "value" : "This"},
    // {"type" : type.STRING, "value" : "is"},
    // {"type" : type.STRING, "value" : "a"},
    // {"type" : type.STRING, "value" : "single"},
    // {"type" : type.STRING, "value" : "comment"},
    // {"type" : type.STRING, "value" : "/*"},
    // {"type" : type.STRING, "value" : "This"},
    // {"type" : type.STRING, "value" : "is"},
    // {"type" : type.STRING, "value" : "a"},
    // {"type" : type.STRING, "value" : "multi"},
    // {"type" : type.STRING, "value" : "line"},
    // {"type" : type.STRING, "value" : "comment"},
    // {"type" : type.STRING, "value" : "*/"}, 

    //TERMITE.LOG
    //Separate indiv methods based on ( )... not sure if in "" or not
    {"type" : type.METHOD, "value" : termite.log},
    {"type" : type.DELIMITER, "value" : "("},
    {"type" : type.STRING, "value" : "Hello,"},
    {"type" : type.STRING, "value" : "world!"},
    {"type" : type.DELIMITER, "value" : ")"},
    {"type" : type.TERMINATOR, "value" : "|"}

    //#PROJECT
]