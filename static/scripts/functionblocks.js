// This is a modified definition of Blockly's function block generators for potential
// modification of the functions to perform async execution
// both the original and the async functions are stored so we can switch between them dynamically
// https://github.com/google/blockly/blob/64188ae27297b1ca23a3244cc987dfbfc6e98f34/generators/javascript/procedures.js

var ORIGINAL_FUNCTION_GENERATOR = Blockly.JavaScript['procedures_defreturn'];
var ASYNC_FUNCTION_GENERATOR = function(block) {
    // Define a procedure with a return value.
    var funcName = Blockly.JavaScript.nameDB_.getName(
        block.getFieldValue('NAME'), Blockly.PROCEDURE_CATEGORY_NAME);
    var xfix1 = '';
    if (Blockly.JavaScript.STATEMENT_PREFIX) {
      xfix1 += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_PREFIX,
          block);
    }
    if (Blockly.JavaScript.STATEMENT_SUFFIX) {
      xfix1 += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_SUFFIX,
          block);
    }
    if (xfix1) {
      xfix1 = Blockly.JavaScript.prefixLines(xfix1, Blockly.JavaScript.INDENT);
    }
    var loopTrap = '';
    if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
      loopTrap = Blockly.JavaScript.prefixLines(
          Blockly.JavaScript.injectId(Blockly.JavaScript.INFINITE_LOOP_TRAP,
          block), Blockly.JavaScript.INDENT);
    }
    var branch = Blockly.JavaScript.statementToCode(block, 'STACK');
    var returnValue = Blockly.JavaScript.valueToCode(block, 'RETURN',
        Blockly.JavaScript.ORDER_NONE) || '';
    var xfix2 = '';
    if (branch && returnValue) {
      // After executing the function body, revisit this block for the return.
      xfix2 = xfix1;
    }
    if (returnValue) {
      returnValue = Blockly.JavaScript.INDENT + 'return ' + returnValue + ';\n';
    }
    var args = [];
    var variables = block.getVars();
    for (var i = 0; i < variables.length; i++) {
      args[i] = Blockly.JavaScript.nameDB_.getName(variables[i],
          Blockly.VARIABLE_CATEGORY_NAME);
    }

    // THIS IS WHERE THE EXTRA KEYWORD WAS ADDED
    //           vvv
    var code = 'async function ' + funcName + '(' + args.join(', ') + ') {\n' +
        xfix1 + loopTrap + branch + xfix2 + returnValue + '}';
    code = Blockly.JavaScript.scrub_(block, code);
    // Add % so as not to collide with helper functions in definitions list.
    Blockly.JavaScript.definitions_['%' + funcName] = code;
    return null;
};

var ORIGINAL_FUNCTION_CALL_GENERATOR = Blockly.JavaScript['procedures_callreturn'];
var ASYNC_FUNCTION_CALL_GENERATOR = function(block) {
    // Call a procedure with a return value.
    var funcName = Blockly.JavaScript.nameDB_.getName(
        block.getFieldValue('NAME'), Blockly.PROCEDURE_CATEGORY_NAME);
    var args = [];
    var variables = block.getVars();
    for (var i = 0; i < variables.length; i++) {
        args[i] = Blockly.JavaScript.valueToCode(block, 'ARG' + i,
            Blockly.JavaScript.ORDER_NONE) || 'null';
    }

    // THIS IS WHERE THE EXTRA KEYWORD WAS ADDED
    //       vvv
    var code = 'await ' + funcName + '(' + args.join(', ') + ')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

var ORIGINAL_FUNCTION_CALL_NORETURN = Blockly.JavaScript['procedures_callnoreturn'];
var ASYNC_FUNCTION_CALL_NORETURN = function(block) {
    // Call a procedure with no return value.
    // Generated code is for a function call as a statement is the same as a
    // function call as a value, with the addition of line ending.
    var tuple = Blockly.JavaScript['procedures_callreturn'](block);
    return tuple[0] + ';\n';
};

Blockly.JavaScript['procedures_defreturn'] = function(block) {
    if (USING_THREADS) return ASYNC_FUNCTION_GENERATOR(block);
    else return ORIGINAL_FUNCTION_GENERATOR(block);
}

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.JavaScript['procedures_defnoreturn'] =
    Blockly.JavaScript['procedures_defreturn'];

Blockly.JavaScript['procedures_callreturn'] = function(block) {
    if (USING_THREADS) return ASYNC_FUNCTION_CALL_GENERATOR(block);
    else return ORIGINAL_FUNCTION_CALL_GENERATOR(block);
}

Blockly.JavaScript['procedures_callnoreturn'] = function(block) {
    if (USING_THREADS) return ASYNC_FUNCTION_CALL_NORETURN(block);
    else return ORIGINAL_FUNCTION_CALL_NORETURN(block);
}