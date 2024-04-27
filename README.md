# CodenetLang

<img src="codenet_logo.png" alt="logo" width="500">

Creators: Bogdan Mygovych, Ariana Overko, Jonah Y

Language Overview: This language is built on top of JS and is a general-purpose language.

## Sample Code: 

** This is a single comment **

*/ This is
   a multi-line
   comment /*

termite.log("Hello, world!")|

set #project = "CodeNetLang"|

set #array = {1, 2, 3}|

def #add(a,b) :| 
	Return a + b|
|:

set #result = #add(5,3)|
termite.log(#result)| 

## Execution Instructions: 
Note: this language requires having a Node.js environment set up. 
Download Node.js here: [download](https://nodejs.org/en/download)

1) Create a separate folder with the CodenetLang Interpreter, and CodenetLang files
2) Open cmd and change directory to your CodenetLang Folder
3) Enter node int.js
4) Once asked for a file name, enter the name of the desired .cnet file

## Syntax Rules: 

  Single Line Comments:  **    

  Multi-line comments:  */    /*

  Single Commands: |

  Blocks of Code: :|   |:

  Assignment Operator:  =

  Not: not

  Or: or

  And: and

  True: T:

  False: F:

  Less than:  <

  Greater than: >

  Less than or equal to: <=

  Greater than or equal to: >=

  Binary Operators:  +  -  *  /  

  Variables: set = #project

  Classes: group #classname :|  |:

  Functions: def #function_name :|   |:

  Arrays: set #name = {  } 

## Grammar Statements:


## State of the Language:
CodenetLang is currently under development. Its lexer is fully functional with all specified syntax above, and the parser creates an ast tree from the tokens. However, the cases for parsing and interpreting only encompass the sample code at this point. It is not fully functional.


    