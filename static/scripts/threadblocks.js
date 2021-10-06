Blockly.defineBlocksWithJsonArray([
  {
    "type": "run_thread",
    "message0": "Run in %1 threads %2 save %3 in %4",
    "args0": [
      {
        "type": "input_value",
        "name": "thread_count",
        "check": "Number"
      },
      {
        "type": "input_statement",
        "name": "thread_statements"
      },
      {
        "type": "input_value",
        "name": "return_value",
      },
      {
        "type": "field_variable",
        "name": "output_array",
        "variable": "result"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 389,
    "tooltip": "",
    "helpUrl": ""
  },

  {
    "type": "run_thread_limited",
    "message0": "Run in %1 threads limited to %2 %3 save %4 in %5",
    "args0": [
      {
        "type": "input_value",
        "name": "thread_count",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "thread_limit",
        "check": "Number"
      },
      {
        "type": "input_statement",
        "name": "thread_statements"
      },
      {
        "type": "input_value",
        "name": "return_value",
      },
      {
        "type": "field_variable",
        "name": "output_array",
        "variable": "result"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 389,
    "tooltip": "",
    "helpUrl": ""
  },

  {
    "type": "thread_num",
    "message0": "Thread ID",
    "inputsInline": true,
    "output": "Number",
    "colour": 389,
    "tooltip": "",
    "helpUrl": ""
  },

  {
    "type": "thread_hardware_concurrency",
    "message0": "Hardware Concurrency",
    "inputsInline": true,
    "output": "Number",
    "colour": 389,
    "tooltip": "",
    "helpUrl": ""
  },

  {
    "type": "thread_import_variable",
    "message0": "import %1 into thread",
    "args0": [
      {
        "type": "field_variable",
        "name": "input"
      }
    ],
    "inputInLine": true,
    "previousStatement": ["ThreadImport", "ThreadStart"],
    "nextStatement": [
      "ThreadImport"
    ],
    "colour": 389,
  },

  {
    "type": "fibonacci",
    "message0": "Calculate Fibonacci of %1",
    "args0": [
      {
        "type": "input_value",
        "name": "fib_number",
        "check": "Number"
      }
    ],
    "inputsInline": true,
    // "previousStatement": null,
    // "nextStatement": null,
    "output": null,
    "colour": 389,
    "tooltip": "",
    "helpUrl": ""
  }
]);

let THREAD_BLOCKS = {
    "run_thread": true,
    "run_thread_limited": true
  }
  
  Blockly.JavaScript['thread_num'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = '_thread_id';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };
  
  Blockly.JavaScript['thread_hardware_concurrency'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'self.navigator.hardwareConcurrency';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };
  
  // imports a variable from the parent thread into the child thread
  Blockly.JavaScript['thread_import_variable'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let prev_block = block.getPreviousBlock();
    let surround_block = block.getSurroundParent();
  
    // unplug the block if it's not inside a thread block
    if (surround_block != null && !THREAD_BLOCKS[surround_block.type]) {
      block.disabled = true;
      block.setWarningText("import block can only be used inside a thread block");
      block.updateDisabled();
    }
    // unplug the block if it isn't at the top of the thread block
    else if (prev_block != null && (prev_block.type != "thread_import_variable" && !THREAD_BLOCKS[prev_block.type])) {
      block.disabled = true;
      block.setWarningText("import block must be placed at the top of a thread block");
      block.updateDisabled();
    }
    else {
      block.setWarningText(null);
    }
  
    let input_var = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('input'), Blockly.Variables.NAME_TYPE);
  
    var code = '';
  
    // makes a request from the parent to import a variable
    code += "Handler.sendMessage(new Message(Handler.PARENT_SOURCE, '"+input_var+"', 'import'));\n"
    code += input_var+" = ( yield(Handler.recvRequest(new RecvRequest(Handler.PARENT_SOURCE))) ).data;\n"
    // TODO: Change ORDER_NONE to the correct strength.
    return code;
  };
  
  function generate_worker_code(statements, return_val) {
      // defining the code to be used inside the web workers
      let worker_code = "";
      worker_code += "importScripts(('"+self.location+"').replace(/([^/]*$)/, '')+'scripts/MessageHandler.js');\n"
      worker_code += "\n";
    
      let definitions = Blockly.JavaScript.definitions_;
      let used_definitions = PREV_DEFINITIONS != null ? PREV_DEFINITIONS : definitions;
      for (const key in used_definitions) {
        worker_code += used_definitions[key]+"\n\n";
      }
    
      // We need to keep track of the definitions object because it will continue to be filled in as
      // Blockly generates the code for the rest of the blocks
      // Blockly discards the object once the generation is finished, but it still exists in emmory if we keep track of it
      // this necessitates that the code be generated twice for every operation
      PREV_DEFINITIONS = definitions
    
      worker_code += "function* main() {\n";
    
      // receive the starter values from the parent
      worker_code += "  var _thread_id = ( yield(Handler.recvRequest(new RecvRequest(Handler.PARENT_SOURCE))) ).data;\n"
    
      // execute the internal statements and return the value
      worker_code += "\`+\`"+statements+"\`+\`;\n";
      worker_code += "  Handler.sendMessage(new Message(Handler.PARENT_SOURCE, "+return_val+"));\n";
    
      worker_code += "}\n";
      worker_code += "var main = main();\n";
      worker_code += "main.next();\n";
  
      return worker_code
  }
  
  Blockly.JavaScript['run_thread'] = function(block) {
  // disable the block if the thread is inside of a function or a thread block
  let surround_block = block;
  while (surround_block.getSurroundParent() != null) {
    surround_block = surround_block.getSurroundParent();

    if (surround_block.type == "procedures_defnoreturn" || surround_block.type == "procedures_defreturn") {
      block.disabled = true;
      block.setWarningText("thread blocks can not be placed inside a function block");
      block.updateDisabled();
      break;

    } else if (THREAD_BLOCKS[surround_block.type]) {
      block.disabled = true;
      block.setWarningText("thread blocks can not be placed inside another thread block");
      block.updateDisabled();
      break;

    } else {
      block.setWarningText(null);
    }
  }
  
    // This flag tells Elea to run the generate code twice so that this block can get function definitions
    USING_THREADS = true
  
    let thread_count = Blockly.JavaScript.valueToCode(block, 'thread_count', Blockly.JavaScript.ORDER_NONE);
    let output_array = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('output_array'), Blockly.Variables.NAME_TYPE);
    let return_val = Blockly.JavaScript.valueToCode(block, 'return_value', Blockly.JavaScript.ORDER_NONE);
  
    let statements_simulation_steps = Blockly.JavaScript.statementToCode(block, 'thread_statements');
  
    // declare the developer variables used by this block
    // I don't know why this is the way they've done it
    block.getDeveloperVariables = function() {
      return ["_worker_code", "_worker_obj", "_threads"]
    }
  
    let code = "";
    code += "_worker_code = `" + generate_worker_code(statements_simulation_steps, return_val) + "`;\n"
  
    code += "_worker_obj = URL.createObjectURL( new Blob([_worker_code], {type: 'application/javascript'}) );\n";
  
    code += "_threads = new Array();\n";
    code += output_array+" = new Array();\n"
    code += "for (let index = 0; index < "+thread_count+"; index++) {\n";
    code += "  _threads.push(Handler.createThread(_worker_obj));\n";
    code += "}\n";
  
    // code += "let arr = new Array();";
    code += "for (let index = 0; index < "+thread_count+"; index++) {;\n";
    code += "  const element = _threads[index];\n";
    // code += "  console.log('receiving...');\n";
    code += "  "+output_array+".push( (yield( Handler.recvRequest(new RecvRequest(element)) )).data );\n";
    code += "  Handler.removeThread(element);\n";
    code += "}\n";
    code += "Handler.resetThreadIds();\n"
  
    // code += "console.log("+output+");\n";
    return code;
  };
  
  // same as the thread block above, but only runs a set number of threads at any one time
  Blockly.JavaScript['run_thread_limited'] = function(block) {
  // disable the block if the thread is inside of a function or a thread block
  let surround_block = block;
  while (surround_block.getSurroundParent() != null) {
    surround_block = surround_block.getSurroundParent();

    if (surround_block.type == "procedures_defnoreturn" || surround_block.type == "procedures_defreturn") {
      block.disabled = true;
      block.setWarningText("thread blocks can not be placed inside a function block");
      block.updateDisabled();
      break;

    } else if (THREAD_BLOCKS[surround_block.type]) {
      block.disabled = true;
      block.setWarningText("thread blocks can not be placed inside another thread block");
      block.updateDisabled();
      break;

    } else {
      block.setWarningText(null);
    }
  }
  
    // This flag tells Elea to run the generate code twice so that this block can get function definitions
    USING_THREADS = true
  
    let thread_count = Blockly.JavaScript.valueToCode(block, 'thread_count', Blockly.JavaScript.ORDER_NONE);
    let thread_limit = Blockly.JavaScript.valueToCode(block, 'thread_limit', Blockly.JavaScript.ORDER_NONE);
    let output_array = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('output_array'), Blockly.Variables.NAME_TYPE);
    let return_val = Blockly.JavaScript.valueToCode(block, 'return_value', Blockly.JavaScript.ORDER_NONE);
  
    let statements_simulation_steps = Blockly.JavaScript.statementToCode(block, 'thread_statements');
  
    // declare the developer variables used by this block
    // I don't know why this is the way they've done it
    block.getDeveloperVariables = function() {
      return ["_worker_code", "_worker_obj", "_threads", "_thread_counter"]
    }
  
    let code = "";
    code += "_worker_code = `" + generate_worker_code(statements_simulation_steps, return_val) + "`;\n"
  
    code += "_worker_obj = URL.createObjectURL( new Blob([_worker_code], {type: 'application/javascript'}) );\n";
  
    code += "_threads = new Array();\n";
    code += output_array+" = new Array();\n"
  
    code += "for (let index = 0; index < Math.min("+thread_limit+", "+thread_count+") ; index++) {\n";
    code += "  _threads.push( Handler.createThread(_worker_obj) );\n";
    code += " }\n";
  
    code += "_thread_counter = Math.min("+thread_limit+", "+thread_count+");\n";
    code += "while (_thread_counter < "+thread_count+") {\n";
    code += "  let msg = yield(Handler.recvRequest( new RecvRequest(Handler.ANY_CHILD_SOURCE) ));\n"
    code += "  "+output_array+"[msg.source-1] = msg.data;\n";
    code += "\n";
    code += "  _threads.push( Handler.createThread(_worker_obj) );\n";
    code += "  _thread_counter ++;\n";
    code += "}\n";
  
    code += "for (let index = 0; index < Math.min("+thread_limit+", "+thread_count+"); index++) {\n";
    code += "  let msg = yield(Handler.recvRequest( new RecvRequest(Handler.ANY_CHILD_SOURCE) ));\n"
    code += "  "+output_array+"[msg.source-1] = msg.data;\n";
    code += " }\n";
  
    code += "for (let index = 0; index < "+thread_count+"; index++) {;\n";
    code += "  Handler.removeThread(_threads[index]);\n";
    code += "}\n";
  
    code += "Handler.resetThreadIds();\n"
    // code += "console.log("+output+");\n";
    return code;
  };
  
  Blockly.JavaScript['fibonacci'] = function(block) {
    let fib_number = Blockly.JavaScript.valueToCode(block, 'fib_number', Blockly.JavaScript.ORDER_NONE);
    var functionName = Blockly.JavaScript.provideFunction_(
      'fib',
      ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
          '(n, fib) {',
          "  if (n < 2) return n;",
          "  return fib(n-1, fib) + fib(n-2, fib);",
        '}']);
    let code = "";
    code += functionName+"("+fib_number+", "+functionName+")";
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };