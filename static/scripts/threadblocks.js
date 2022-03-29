import * as Blockly from "blockly";
import { setUsingThreads } from "./modules/blocklyHandling";
import { blockDefinitions } from "../blockDefinition/threadBlocks";
var PREV_DEFINITIONS = null;

Blockly.defineBlocksWithJsonArray(blockDefinitions);

let THREAD_BLOCKS = {
  run_thread: true,
  run_thread_limited: true,
};

// this value is sent to the workers after the thread is created
Blockly.JavaScript["thread_num"] = function () {
  var code = "Handler.THREAD_ID";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

// the available hardware threads on the device
Blockly.JavaScript["thread_hardware_concurrency"] = function () {
  var code = "globalThis.navigator?.hardwareConcurrency || cpus().length || 1";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

// imports a variable from the parent thread into the child thread
Blockly.JavaScript["thread_import_variable"] = function (block) {
  let prev_block = block.getPreviousBlock();
  let surround_block = block.getSurroundParent();

  // unplug the block if it's not inside a thread block
  if (surround_block != null && !THREAD_BLOCKS[surround_block.type]) {
    block.disabled = true;
    block.setWarningText("import block can only be used inside a thread block");
    block.updateDisabled();
  }
  // unplug the block if it isn't at the top of the thread block
  else if (
    prev_block != null &&
    prev_block.type != "thread_import_variable" &&
    !THREAD_BLOCKS[prev_block.type]
  ) {
    block.disabled = true;
    block.setWarningText(
      "import block must be placed at the top of a thread block"
    );
    block.updateDisabled();
  } else {
    block.setWarningText(null);
  }

  let input_var = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("input"),
    Blockly.Variables.NAME_TYPE
  );

  // makes a request from the parent to import a variable
  var code = "";
  code +=
    "Handler.sendMessage(new Message(Handler.PARENT_ID, '" +
    input_var +
    "', 'import'));\n";
  code +=
    input_var +
    " = ( yield(Handler.recvRequest(new RecvRequest(Handler.PARENT_ID))) ).data;\n";
  return code;
};

// escapes special characters so that the string encapsulation does not
// break - the strings must not break encapsulation when inserted into '`' quotes.
function escape_string(str) {
  str = str.replace(/\\/g, "\\\\");
  str = str.replace(/`/g, "\\`");
  return str;
}

// this is a general function for generating the worker code for threads
// this significantly shortens the other blocks, and makes adding other threading blocks easier
function generate_worker_code(statements, return_val) {
  // defining the code to be used inside the web workers
  let worker_code = "";
  worker_code +=
    "importScripts(('" +
    self.location +
    "').replace(/([^/]*$)/, '')+'scripts/MessageHandler.js');\n";
  worker_code += "\n";

  let definitions = Blockly.JavaScript.definitions_;
  let used_definitions =
    PREV_DEFINITIONS != null ? PREV_DEFINITIONS : definitions;
  for (const key in used_definitions) {
    worker_code += escape_string(used_definitions[key]) + "\n\n";
  }

  // We need to keep track of the definitions object because it will continue to be filled in as
  // Blockly generates the code for the rest of the blocks
  // Blockly discards the object once the generation is finished, but it still exists in emmory if we keep track of it
  // this necessitates that the code be generated twice for every operation
  PREV_DEFINITIONS = definitions;

  worker_code += "function* main() {\n";
  worker_code += "try {\n";

  // execute the internal statements and return the value
  worker_code += "`+`" + escape_string(statements) + "`+`;\n";
  worker_code +=
    "  Handler.sendMessage(new Message(Handler.PARENT_ID, " +
    return_val +
    "));\n";
  worker_code += "} catch (e) {\n";
  worker_code += "    consoleerror(e);\n";
  worker_code += "}\n";
  worker_code += "}\n";
  // the message handler will automatically run main.next() when the THREAD_ID is received
  worker_code += "var main = main();\n";

  return worker_code;
}

// runs a series of statements in x threads, then waits for them all to return a result
Blockly.JavaScript["run_thread"] = function (block) {
  // disable the block if the thread is inside of a function block
  let surround_block = block;
  while (surround_block.getSurroundParent() != null) {
    surround_block = surround_block.getSurroundParent();

    if (
      surround_block.type == "procedures_defnoreturn" ||
      surround_block.type == "procedures_defreturn"
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
  setUsingThreads();

  let thread_count = Blockly.JavaScript.valueToCode(
    block,
    "thread_count",
    Blockly.JavaScript.ORDER_NONE
  );
  let output_array = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("output_array"),
    Blockly.Variables.NAME_TYPE
  );
  let return_val = Blockly.JavaScript.valueToCode(
    block,
    "return_value",
    Blockly.JavaScript.ORDER_NONE
  );
  let statements_simulation_steps = Blockly.JavaScript.statementToCode(
    block,
    "thread_statements"
  );
  var loopVar = Blockly.JavaScript.nameDB_.getDistinctName(
    "count",
    Blockly.VARIABLE_CATEGORY_NAME
  );

  // declare the developer variables used by this block
  // I don't know why this is the way they've done it
  block.getDeveloperVariables = function () {
    return ["_worker_code", "_worker_obj", "_threads"];
  };

  let code = "";
  code +=
    "_worker_code = `" +
    generate_worker_code(statements_simulation_steps, return_val) +
    "`;\n";
  code +=
    "_worker_obj = URL.createObjectURL( new Blob([_worker_code], {type: 'application/javascript'}) );\n";
  code += "_threads = new Array();\n";
  code += output_array + " = new Array();\n";
  code +=
    "for (let " +
    loopVar +
    " = 0; " +
    loopVar +
    " < " +
    thread_count +
    "; " +
    loopVar +
    "++) {\n";
  code += "  _threads.push(Handler.createThread(_worker_obj));\n";
  code += "}\n";
  code +=
    "for (let " +
    loopVar +
    " = 0; " +
    loopVar +
    " < " +
    thread_count +
    "; " +
    loopVar +
    "++) {;\n";
  code +=
    "  " +
    output_array +
    ".push( (yield( Handler.recvRequest(new RecvRequest(_threads[" +
    loopVar +
    "])) )).data );\n";
  code += "  Handler.removeThread(_threads[" + loopVar + "]);\n";
  code += "}\n";
  code += "Handler.resetThreadIds();\n";
  return code;
};

// same as the thread block above, but only runs a set number of threads at any one time
Blockly.JavaScript["run_thread_limited"] = function (block) {
  // disable the block if the thread is inside of a function block
  let surround_block = block;
  while (surround_block.getSurroundParent() != null) {
    surround_block = surround_block.getSurroundParent();

    if (
      surround_block.type == "procedures_defnoreturn" ||
      surround_block.type == "procedures_defreturn"
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
  setUsingThreads();

  let thread_count = Blockly.JavaScript.valueToCode(
    block,
    "thread_count",
    Blockly.JavaScript.ORDER_NONE
  );
  let thread_limit = Blockly.JavaScript.valueToCode(
    block,
    "thread_limit",
    Blockly.JavaScript.ORDER_NONE
  );
  let output_array = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("output_array"),
    Blockly.Variables.NAME_TYPE
  );
  let return_val = Blockly.JavaScript.valueToCode(
    block,
    "return_value",
    Blockly.JavaScript.ORDER_NONE
  );
  let statements_simulation_steps = Blockly.JavaScript.statementToCode(
    block,
    "thread_statements"
  );
  var loopVar = Blockly.JavaScript.nameDB_.getDistinctName(
    "count",
    Blockly.VARIABLE_CATEGORY_NAME
  );

  // declare the developer variables used by this block
  // I don't know why this is the way they've done it
  block.getDeveloperVariables = function () {
    return ["_worker_code", "_worker_obj", "_threads", "_thread_limit", "msg"];
  };

  let code = "";
  code +=
    "_worker_code = `" +
    generate_worker_code(statements_simulation_steps, return_val) +
    "`;\n";
  code +=
    "_worker_obj = URL.createObjectURL( new Blob([_worker_code], {type: 'application/javascript'}) );\n";
  code += "_threads = new Array();\n";
  code += output_array + " = new Array();\n";
  code +=
    "_thread_limit = Math.min(" + thread_limit + ", " + thread_count + ");\n";
  code +=
    "for (let " +
    loopVar +
    " = 0; " +
    loopVar +
    " < _thread_limit ; " +
    loopVar +
    "++) {\n";
  code += "  _threads.push( Handler.createThread(_worker_obj) );\n";
  code += " }\n";
  code +=
    "for (let " +
    loopVar +
    " = _thread_limit; " +
    loopVar +
    " < " +
    thread_count +
    "; " +
    loopVar +
    "++) {\n";
  code +=
    "  let msg = yield(Handler.recvRequest( new RecvRequest(Handler.ANY_CHILD_SOURCE) ));\n";
  code += "  " + output_array + "[msg.source-1] = msg.data;\n";
  code += "\n";
  code += "  _threads.push( Handler.createThread(_worker_obj) );\n";
  code += "}\n";
  code += "\n";
  code +=
    "for (let " +
    loopVar +
    " = 0; " +
    loopVar +
    " < _thread_limit; " +
    loopVar +
    "++) {\n";
  code +=
    "  let msg = yield(Handler.recvRequest( new RecvRequest(Handler.ANY_CHILD_SOURCE) ));\n";
  code += "  " + output_array + "[msg.source-1] = msg.data;\n";
  code += " }\n";
  code +=
    "for (let " +
    loopVar +
    " = 0; " +
    loopVar +
    " < " +
    thread_count +
    "; " +
    loopVar +
    "++) {;\n";
  code += "  Handler.removeThread(_threads[" + loopVar + "]);\n";
  code += "}\n";
  code += "Handler.resetThreadIds();\n";
  return code;
};

// this is a testing function to easily test performance of using multiple threads
Blockly.JavaScript["fibonacci"] = function (block) {
  let fib_number = Blockly.JavaScript.valueToCode(
    block,
    "fib_number",
    Blockly.JavaScript.ORDER_NONE
  );
  var functionName = Blockly.JavaScript.provideFunction_("fib", [
    "function " + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + "(n, fib) {",
    "  if (n < 2) return n;",
    "  return fib(n-1, fib) + fib(n-2, fib);",
    "}",
  ]);
  let code = "";
  code += functionName + "(" + fib_number + ", " + functionName + ")";
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
