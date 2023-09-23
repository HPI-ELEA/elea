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
  let inputVar = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("input"),
    Blockly.Variables.NAME_TYPE
  );
  var code = "# importing " + inputVar + " not implemented yet\n";

  return code;
};

Blockly.Python["run_thread"] = function (block) {
  let statementsSimulationSteps = Blockly.Python.statementToCode(
    block,
    "thread_statements"
  );

  let code = "#multithreading not implemented yet\n";
  return code + statementsSimulationSteps;
};

// same as the thread block above, but only runs a set number of threads at any one time
Blockly.Python["run_thread_limited"] = function (block) {
  let statementsSimulationSteps = Blockly.Python.statementToCode(
    block,
    "thread_statements"
  );

  let code = "# multithreading not implemented yet\n";
  return code + statementsSimulationSteps;
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
