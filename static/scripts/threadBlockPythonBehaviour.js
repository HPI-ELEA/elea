import * as Blockly from "blockly";

// this value is sent to the workers after the thread is created
Blockly.Python["thread_num"] = function () {
  var code = "# not implemented yet\n";
  return [code, Blockly.Python.ORDER_NONE];
};

// the available hardware threads on the device
Blockly.Python["thread_hardware_concurrency"] = function () {
  var code = "# not implemented yet\n";
  return [code, Blockly.Python.ORDER_NONE];
};

// imports a variable from the parent thread into the child thread
Blockly.Python["thread_import_variable"] = function (block) {
  // let prevBlock = block.getPreviousBlock();
  // let surroundBlock = block.getSurroundParent();
  //
  // // unplug the block if it's not inside a thread block
  // if (surroundBlock != null && !THREAD_BLOCKS[surroundBlock.type]) {
  //     block.disabled = true;
  //     block.setWarningText("import block can only be used inside a thread block");
  //     block.updateDisabled();
  // }
  // // unplug the block if it isn't at the top of the thread block
  // else if (
  //     prevBlock != null &&
  //     prevBlock.type != "thread_import_variable" &&
  //     !THREAD_BLOCKS[prevBlock.type]
  // ) {
  //     block.disabled = true;
  //     block.setWarningText(
  //         "import block must be placed at the top of a thread block"
  //     );
  //     block.updateDisabled();
  // } else {
  //     block.setWarningText(null);
  // }

  let inputVar = Blockly.Python.nameDB_.getName(
    block.getFieldValue("input"),
    Blockly.Variables.NAME_TYPE
  );

  // makes a request from the parent to import a variable
  var code = "# not implemented yet\n";
  return code;
};

// escapes special characters so that the string encapsulation does not
// break - the strings must not break encapsulation when inserted into '`' quotes.
function escapseString(str) {
  str = str.replace(/\\/g, "\\\\");
  str = str.replace(/`/g, "\\`");
  return str;
}

// Generates different import statements depending on the execution enviroment (JS vs NodeJS)
function generateWorkerImports() {
  return (
    "if(typeof process === 'object'){\n" +
    "\t_worker_code += `const {parentPort} = require('worker_threads')\\n`" +
    "\t_worker_code += `const {Handler, consolelog, consoleerror, Message, RecvRequest} = require('./MessageHandler.js')\\n`\n" +
    "\t_worker_code += `Handler.setParentPort(parentPort)\\n`" +
    "}else{\n" +
    "\t _worker_code += `importScripts(('` + globalThis.location + `').replace(/([^/]*$)/, '').replace('blob:', '') +'scripts/MessageHandler.js');\\n`\n" +
    "}\n"
  );
}

// this is a general function for generating the worker code for threads
// this significantly shortens the other blocks, and makes adding other threading blocks easier
function generateWorkerCode(statements, returnVal) {
  // defining the code to be used inside the web workers
  let workerCode = "";
  let definitions = Blockly.Python.definitions_;
  let usedDefinition =
    PREV_DEFINITIONS != null ? PREV_DEFINITIONS : definitions;
  for (const key in usedDefinition) {
    workerCode += escapseString(usedDefinition[key]) + "\n\n";
  }

  // We need to keep track of the definitions object because it will continue to be filled in as
  // Blockly generates the code for the rest of the blocks
  // Blockly discards the object once the generation is finished, but it still exists in emmory if we keep track of it
  // this necessitates that the code be generated twice for every operation

  workerCode += "async function mainFunction() {\n";
  workerCode += "  await Handler.resolveID();\n";

  // execute the internal statements and return the value
  workerCode += "`+`" + escapseString(statements) + "`+`;\n";
  workerCode +=
    "  Handler.sendMessage(new Message(Handler.PARENT_ID, " +
    returnVal +
    "));\n";
  workerCode += "}\n";
  // the message handler will automatically run main.next() when the THREAD_ID is received
  workerCode += "mainFunction()\n";
  workerCode += ".catch( error => consoleerror(error) );\n";

  return workerCode;
}

// runs a series of statements in x threads, then waits for them all to return a result
Blockly.Python["run_thread"] = function (block) {
  // disable the block if the thread is inside of a function block
  let surroundBlock = block;
  while (surroundBlock.getSurroundParent() != null) {
    surroundBlock = surroundBlock.getSurroundParent();

    if (
      surroundBlock.type == "procedures_defnoreturn" ||
      surroundBlock.type == "procedures_defreturn"
    ) {
      block.disabled = true;
      block.setWarningText(
        "thread blocks can not be placed inside a function block"
      );
      block.updateDisabled();
      break;
    } else {
      block.setWarningText(null);
    }
  }

  // This flag tells Elea to run the generate code twice so that this block can get function definitions
  // setUsingThreads();

  let threadCount = Blockly.Python.valueToCode(
    block,
    "thread_count",
    Blockly.Python.ORDER_NONE
  );
  let outputArray = Blockly.Python.nameDB_.getName(
    block.getFieldValue("output_array"),
    Blockly.Variables.NAME_TYPE
  );
  let returnVal = Blockly.Python.valueToCode(
    block,
    "return_value",
    Blockly.Python.ORDER_NONE
  );
  let statementsSimulationSteps = Blockly.Python.statementToCode(
    block,
    "thread_statements"
  );
  var loopVar = Blockly.Python.nameDB_.getDistinctName(
    "count",
    Blockly.VARIABLE_CATEGORY_NAME
  );

  // declare the developer variables used by this block
  // I don't know why this is the way they've done it
  block.getDeveloperVariables = function () {
    return ["_worker_code", "_worker_obj", "_threads"];
  };

  let code = "#multithreading not implemented yet";
  return statementsSimulationSteps;
};

// same as the thread block above, but only runs a set number of threads at any one time
Blockly.Python["run_thread_limited"] = function (block) {
  // disable the block if the thread is inside of a function block
  let surroundBlock = block;
  while (surroundBlock.getSurroundParent() != null) {
    surroundBlock = surroundBlock.getSurroundParent();

    if (
      surroundBlock.type == "procedures_defnoreturn" ||
      surroundBlock.type == "procedures_defreturn"
    ) {
      block.disabled = true;
      block.setWarningText(
        "thread blocks can not be placed inside a function block"
      );
      block.updateDisabled();
      break;
    } else {
      block.setWarningText(null);
    }
  }

  // This flag tells Elea to run the generate code twice so that this block can get function definitions
  // setUsingThreads();

  let threadCount = Blockly.Python.valueToCode(
    block,
    "thread_count",
    Blockly.Python.ORDER_NONE
  );
  let threadLimit = Blockly.Python.valueToCode(
    block,
    "thread_limit",
    Blockly.Python.ORDER_NONE
  );
  let outputArray = Blockly.Python.nameDB_.getName(
    block.getFieldValue("output_array"),
    Blockly.Variables.NAME_TYPE
  );
  let returnVal = Blockly.Python.valueToCode(
    block,
    "return_value",
    Blockly.Python.ORDER_NONE
  );
  let statementsSimulationSteps = Blockly.Python.statementToCode(
    block,
    "thread_statements"
  );
  var loopVar = Blockly.Python.nameDB_.getDistinctName(
    "count",
    Blockly.VARIABLE_CATEGORY_NAME
  );

  // declare the developer variables used by this block
  // I don't know why this is the way they've done it
  block.getDeveloperVariables = function () {
    return ["_worker_code", "_worker_obj", "_threads", "_thread_limit", "msg"];
  };

  let code = "# multithreading not implemented yet";
  return statementsSimulationSteps;
};

// this is a testing function to easily test performance of using multiple threads
Blockly.Python["fibonacci"] = function (block) {
  let fibNumber = Blockly.Python.valueToCode(
    block,
    "fib_number",
    Blockly.Python.ORDER_NONE
  );
  var functionName = Blockly.Python.provideFunction_("fib", [
    "def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "(n, fib):",
    "   if (n < 2):",
    "       return n",
    "   return fib(n-1, fib) + fib(n-2, fib);",
  ]);
  let code = "";
  code += functionName + "(" + fibNumber + ", " + functionName + ")";
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};
