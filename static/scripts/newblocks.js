import * as Blockly from "blockly";
Blockly.defineBlocksWithJsonArray([
  //
  {
    type: "ea_init",
    message0: "Initialize program %1 will be run once %2 %3",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "init_statements",
      },
    ],
    colour: 230,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "init_meta",
    message0: "Initialize global vars and metainfo %1 will be run once %2 %3",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "init_statements",
      },
    ],
    colour: 230,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "init_run",
    message0:
      "Run algorithm once. %1 Called once per n %2 Init/change metavariables before %3 initialising your population %4 %5",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "init_statements",
      },
    ],
    colour: 230,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "init_uniform",
    message0: "uniform random init",
    output: "init_strategy",
    colour: 230,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "individual_init_uniform",
    message0: "individual uniform random init",
    output: "individual_init_strategy",
    colour: 230,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "init_constant",
    message0: "constant init %1",
    args0: [
      {
        type: "field_dropdown",
        name: "CONSTANT",
        options: [
          ["0", "ZERO"],
          ["1", "ONE"],
        ],
      },
    ],
    output: "init_strategy",
    colour: 230,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "individual_init_constant",
    message0: "individual constant init %1",
    args0: [
      {
        type: "field_dropdown",
        name: "CONSTANT",
        options: [
          ["0", "ZERO"],
          ["1", "ONE"],
        ],
      },
    ],
    output: "individual_init_strategy",
    colour: 230,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "pop_init",
    message0: "Init population with µ individuals %1 with the init strategy %2",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "INIT_STRATEGY",
      },
    ],
    inputsInline: true,
    output: null,
    colour: 230,
    tooltip: "Use this function to init your population",
    helpUrl: "",
  },
  {
    type: "init_lambda",
    message0: "Init lambda to  %1",
    args0: [
      {
        type: "field_number",
        name: "pop_lambda",
        value: 50,
        min: 1,
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "run_loop",
    message0: "While %1 and rounds less than %2 %3",
    args0: [
      {
        type: "input_value",
        name: "continue_condition",
        check: "Boolean",
      },
      {
        type: "input_value",
        name: "exit_number",
        check: "Number",
      },
      {
        type: "input_statement",
        name: "loop_statement",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "run_loop_logging",
    message0:
      "While %1 Budget %2 Algorithm ID %3 %4 Function ID %5 %6 %7 %8 Log: %9 fitness %10 dimension %11 run %12",
    args0: [
      {
        type: "input_value",
        name: "continue_condition",
        check: "Boolean",
      },
      {
        type: "input_value",
        name: "exit_number",
        check: "Number",
      },
      {
        type: "field_input",
        name: "algId",
        text: "elea",
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_number",
        name: "fnId",
        value: 1,
        min: 1,
        precision: 1,
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "loop_statement",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "fitness",
        check: "Number",
      },
      {
        type: "input_value",
        name: "dim",
        check: "Number",
      },
      {
        type: "input_value",
        name: "run",
        check: "Number",
      },
    ],
    inputsInline: false,
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "An experimental breeding loop with logging",
    helpUrl: "",
  },
  {
    type: "jump_k",
    message0: "jump k fitness for %1 with k = %2",
    args0: [
      {
        type: "field_variable",
        name: "INDIVIDUAL",
        variable: "individual",
      },
      {
        type: "input_value",
        name: "K",
      },
    ],
    inputsInline: true,
    output: null,
    colour: 180,
    tooltip: "Calculate jump-k value on individual",
    helpUrl: "",
  },

  {
    type: "leading_ones",
    message0: "leading ones fitness for %1",
    args0: [
      {
        type: "field_variable",
        name: "INDIVIDUAL",
        variable: "individual",
      },
    ],
    inputsInline: true,
    output: null,
    colour: 180,
    tooltip: "Calculate leading ones value on individual",
    helpUrl: "",
  },

  {
    type: "lists_append",
    message0: "add %1 to %2",
    args0: [
      {
        type: "field_variable",
        name: "INDIVIDUAL",
        variable: "offspring1",
      },
      {
        type: "field_variable",
        name: "POPULATION",
        variable: "offspring_population",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 260,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "lists_concat",
    message0: "merge %1 with %2",
    args0: [
      {
        type: "field_variable",
        name: "POPULATION1",
        variable: "parent_population",
      },
      {
        type: "field_variable",
        name: "POPULATION2",
        variable: "offspring_population",
      },
    ],
    output: null,
    colour: 260,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "ea_select_parent",
    message0: "select individual  %1 from %2",
    args0: [
      {
        type: "field_dropdown",
        name: "NAME",
        options: [
          ["fitnessproportionately", "FITNESSPROPORTIONATE"],
          ["uniformly", "UNIFORM"],
        ],
      },
      {
        type: "field_variable",
        name: "POPULATION",
        variable: "parent_population",
      },
    ],
    output: "parent_selection_strategy",
    colour: 230,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "ea_copy",
    message0: "copy %1",
    args0: [
      {
        type: "input_value",
        name: "individual",
      },
    ],
    inputsInline: true,
    output: null,
    colour: 120,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "ea_run_breeding",
    message0: "For %1 %2 times, breed: %3 %4",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "loop_number",
        check: "Number",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "loop_statement",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "ea_crossover",
    message0: "crossover %1 %2 %3 with %4 into %5 and %6",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "NAME",
        check: "crossover_function",
      },
      {
        type: "field_variable",
        name: "PARENT1",
        variable: "parent1",
      },
      {
        type: "field_variable",
        name: "PARENT2",
        variable: "parent2",
      },
      {
        type: "field_variable",
        name: "OFFSPRING1",
        variable: "offspring1",
      },
      {
        type: "field_variable",
        name: "OFFSPRING2",
        variable: "offspring2",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "ea_mutate",
    message0: "mutate %1",
    args0: [
      {
        type: "input_value",
        name: "individual",
      },
    ],
    inputsInline: true,
    output: null,
    colour: 120,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "ea_mutate_prob",
    message0: "mutate %1 with a bitwise probability of %2",
    args0: [
      {
        type: "input_value",
        name: "individual",
      },
      {
        type: "input_value",
        name: "probability",
      },
    ],
    inputsInline: true,
    output: null,
    colour: 120,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "ea_mutate_bit",
    message0: "mutate a random bit in %1 ",
    args0: [
      {
        type: "input_value",
        name: "individual",
      },
    ],
    inputsInline: true,
    output: null,
    colour: 120,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "ea_addtopopulation",
    message0: "select new pop+ by %1 from %2 as tiebreak use %3",
    args0: [
      {
        type: "field_dropdown",
        name: "SELECTION_STRATEGY",
        options: [
          ["best", "BEST"],
          ["random", "RANDOM"],
        ],
      },
      {
        type: "input_value",
        name: "POPULATION",
      },
      {
        type: "field_dropdown",
        name: "TIEBREAK",
        options: [
          ["newer", "NEWER"],
          ["random", "RANDOM"],
        ],
      },
    ],
    inputsInline: false,
    output: null,
    colour: 230,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "ea_select_best",
    message0: "select best individual from %1",
    args0: [
      {
        type: "input_value",
        name: "POPULATION",
      },
    ],
    inputsInline: false,
    output: null,
    colour: 230,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "max_diversity",
    message0: "max pairwise diversity of %1",
    args0: [
      {
        type: "input_value",
        name: "POPULATION",
      },
    ],
    inputsInline: false,
    output: "Number",
    colour: 180,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "ea_crossover_onepoint",
    message0: "one-point",
    output: "crossover_function",
    colour: 120,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "ea_crossover_twopoint",
    message0: "two-point",
    output: "crossover_function",
    colour: 120,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "ea_crossover_uniform",
    message0: "uniform",
    output: "crossover_function",
    colour: 120,
    tooltip: "",
    helpUrl: "",
  },

  {
    type: "ea_debug_all",
    message0: "debug print to output",
    previousStatement: null,
    nextStatement: null,
    colour: "#777",
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "ea_debug",
    message0: "print to output %1",
    args0: [
      {
        type: "input_value",
        name: "logging_variable",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: "#777",
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "ea_log",
    message0: "log %1 with tag %2",
    args0: [
      {
        type: "input_value",
        name: "logging_variable",
      },
      {
        type: "input_value",
        name: "logging_tag",
        check: "String",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: "#777",
    tooltip: "",
    helpUrl: "",
  },

  {
    type: "comment",
    message0: '// "%1"',
    args0: [
      {
        type: "field_multilinetext",
        name: "text",
        text: "Add comment",
      },
    ],
    inputsInLine: true,
    previousStatement: true,
    nextStatement: true,
    colour: 60,
    tooltip: "",
    helpUrl: "",
  },

  {
    type: "experimental_timer",
    message0: "measure runtime of %1 %2 save result in %3",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "code",
      },
      {
        type: "field_variable",
        name: "output_time",
        variable: "time",
      },
    ],
    inputsInLine: true,
    previousStatement: true,
    nextStatement: true,
    colour: 0,
  },

  {
    type: "experimental_raw_code",
    message0: "%1",
    args0: [
      {
        type: "field_input",
        name: "code",
      },
    ],
    inputsInLine: true,
    previousStatement: true,
    nextStatement: true,
    colour: 0,
    tooltip: "enter raw line of code to execute",
  },

  {
    type: "experimental_raw_value",
    message0: "%1",
    args0: [
      {
        type: "field_input",
        name: "code",
      },
    ],
    inputsInLine: true,
    output: null,
    colour: 0,
    tooltip: "enter raw code value to use",
  },
]);

Blockly.JavaScript["experimental_raw_code"] = function (block) {
  return block.getFieldValue("code") + "\n";
};

Blockly.JavaScript["experimental_raw_value"] = function (block) {
  return [block.getFieldValue("code"), Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["comment"] = function (block) {
  return "//" + block.getFieldValue("text").replaceAll("\n", " ") + "\n";
};

Blockly.JavaScript["experimental_timer"] = function (block) {
  let statements = Blockly.JavaScript.statementToCode(block, "code");
  let result = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("output_time"),
    Blockly.Variables.NAME_TYPE
  );
  let timer = Blockly.JavaScript.nameDB_.getDistinctName(
    "startTime",
    Blockly.VARIABLE_CATEGORY_NAME
  );

  let code = "";
  code += "let " + timer + " = performance.now();\n";
  code += "\n";
  code += statements;
  code += "\n";
  code += result + " = performance.now() - " + timer + ";\n";

  return code;
};

// the init block encapsulates everything else into a generator function to allow for multi-threading
Blockly.JavaScript["ea_init"] = function (block) {
  var statements_simulation_steps = Blockly.JavaScript.statementToCode(
    block,
    "init_statements"
  );

  let code = "";
  code = "function* main() {\n\n";
  code += "try {\n";
  code += statements_simulation_steps;
  code += "} catch(e) {\n";
  code += "    consoleerror(e);\n"
  code += "} finally {\n"
  code +=
  '  Handler.sendMessage(new Message(Handler.PARENT_ID, 0, "terminate"));\n';
  code += "};\n"
  code += "}\n";
  code += "var main = main();\n";
  code += "main.next();\n";
  return code;
};

// TODO: init all developer variables with
// https://developers.google.com/blockly/reference/js/Blockly.Variables#.allDeveloperVariables

Blockly.JavaScript["init_meta"] = function (block) {
  var globalVars = "var fittestInd = null;\nvar fittest = 0;\n";
  var statements_simulation_steps = Blockly.JavaScript.statementToCode(
    block,
    "init_statements"
  );
  return globalVars + statements_simulation_steps;
};

Blockly.JavaScript["init_run"] = function (block) {
  var statements_simulation_steps = Blockly.JavaScript.statementToCode(
    block,
    "init_statements"
  );
  return statements_simulation_steps;
};

Blockly.JavaScript["pop_init"] = function (block) {
  var value_popinit_strategy = Blockly.JavaScript.valueToCode(
    block,
    "INIT_STRATEGY",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  return [value_popinit_strategy, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["jump_k"] = function (block) {
  console.warn("jump_k uses hardcoded variables");
  var k = Blockly.JavaScript.valueToCode(
    block,
    "K",
    Blockly.JavaScript.ORDER_ATOMIC
  ); // TODO: cache
  var variable_individual = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("INDIVIDUAL"),
    Blockly.Variables.NAME_TYPE
  );
  var functionName = Blockly.JavaScript.provideFunction_("jump_k", [
    "function " +
      Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      "(individual, k) {",
    "  var sum = individual.reduce(function(a,b) {return a+b});",
    "  if (sum <= genome_length - k || sum == genome_length) {",
    "    return sum;",
    "  } else {",
    "    return 0;",
    "  }",
    "}",
  ]);
  var code = functionName + "(" + variable_individual + "," + k + ")";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["leading_ones"] = function (block) {
  var variable_individual = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("INDIVIDUAL"),
    Blockly.Variables.NAME_TYPE
  );
  var functionName = Blockly.JavaScript.provideFunction_("leading_ones", [
    "function " +
      Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      "(individual) {",
    "  var count = 0;",
    "  for (var j=0;individual[j] == 1 && j<individual.length; j++) {",
    "    count += 1;",
    "  }",
    "  return count;",
    "}",
  ]);
  var code = functionName + "(" + variable_individual + ")";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["init_uniform"] = function () {
  var functionName = Blockly.JavaScript.provideFunction_(
    "uniformInitPopulation",
    [
      "function " + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + "() {",
      "  var fullArray = Array(_C2_B5).fill(0);", // TODO: replace fill for ES5
      "  var tempArray = Array(genome_length).fill(0);",
      "  for (var j=0; j < _C2_B5;j++) {",
      "    for (var k=0; k< genome_length; k++) {",
      "      tempArray[k] = Math.round(Math.random());",
      "    }",
      "    fullArray[j] = tempArray;",
      "  }",
      "  return fullArray;",
      "}",
    ]
  );
  var code = functionName + "()";
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript["individual_init_uniform"] = function () {
  var functionName = Blockly.JavaScript.provideFunction_(
    "uniformInitIndividual",
    [
      "function " + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + "() {",
      "  var tempArray = Array(genome_length).fill(0);",
      "  for (var k=0; k< genome_length; k++) {",
      "      tempArray[k] = Math.round(Math.random());",
      "    }",
      "  return tempArray;",
      "}",
    ]
  );
  var code = functionName + "()";
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript["init_constant"] = function (block) {
  console.warn("init_constant uses hardcoded variables");
  var dropdown_constant = block.getFieldValue("CONSTANT");
  if (dropdown_constant == "ZERO") {
    dropdown_constant = "0";
  } else {
    dropdown_constant = "1";
  }
  var functionName = Blockly.JavaScript.provideFunction_("zeroInitPopulation", [
    "function " + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + "() {",
    "  var fullArray = Array(_C2_B5);",
    "  var tempArray = Array(genome_length);",
    "  for (var j=0; j < genome_length;j++) {",
    "    tempArray[j] = " + dropdown_constant + ";",
    "  }",
    "  for (var j=0; j < _C2_B5;j++) {",
    "    fullArray[j] = tempArray;",
    "  }",
    "  return fullArray;",
    "}",
  ]);
  var code = functionName + "()";
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript["individual_init_constant"] = function (block) {
  console.warn("individual_init_constant uses hardcoded variables");
  var dropdown_constant = block.getFieldValue("CONSTANT");
  if (dropdown_constant == "ZERO") {
    dropdown_constant = "0";
  } else {
    dropdown_constant = "1";
  }
  var functionName = Blockly.JavaScript.provideFunction_("zeroInitIndividual", [
    "function " + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + "() {",
    "  var tempArray = Array(genome_length);",
    "  for (var j=0; j < genome_length;j++) {",
    "    tempArray[j] =" + dropdown_constant + ";",
    "  }",
    "  return tempArray;",
    "}",
  ]);
  var code = functionName + "()";
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

// all of the logging functionality of this block has been removed due to the modified messsage handling system used for
// multi-threading. The logging system needs to be re-implemented and potentially redesigned
Blockly.JavaScript["run_loop"] = function (block) {
  console.warn(
    "the run_loop_logging block has had logging disabled while multi-threading is being worked on"
  );
  var continue_condition = Blockly.JavaScript.valueToCode(
    block,
    "continue_condition",
    Blockly.JavaScript.ORDER_NONE
  );
  var exit_number = Blockly.JavaScript.valueToCode(
    block,
    "exit_number",
    Blockly.JavaScript.ORDER_NONE
  );
  var statements_simulation_steps = Blockly.JavaScript.statementToCode(
    block,
    "loop_statement"
  );
  // TODO: create or update global dev var counter and also reset in "prepare next run"
  var code =
    "for (var i=0;(" +
    continue_condition +
    " || false) && i < " +
    exit_number +
    ";i++){\n";
  code += statements_simulation_steps;
  code += "}\n";
  // TODO: increment global counter used for cost calculation
  return code;
};

// a breeding loop designed to send a log message every time the best fitness is improved
Blockly.JavaScript["run_loop_logging"] = function (block) {
  var continue_condition = Blockly.JavaScript.valueToCode(
    block,
    "continue_condition",
    Blockly.JavaScript.ORDER_NONE
  );
  var exit_number = Blockly.JavaScript.valueToCode(
    block,
    "exit_number",
    Blockly.JavaScript.ORDER_NONE
  );
  var algId = block.getFieldValue("algId");
  var fnId = block.getFieldValue("fnId");
  var fitness = Blockly.JavaScript.valueToCode(
    block,
    "fitness",
    Blockly.JavaScript.ORDER_NONE
  );
  var dimension = Blockly.JavaScript.valueToCode(
    block,
    "dim",
    Blockly.JavaScript.ORDER_NONE
  );
  var run = Blockly.JavaScript.valueToCode(
    block,
    "run",
    Blockly.JavaScript.ORDER_NONE
  );
  var statements_simulation_steps = Blockly.JavaScript.statementToCode(
    block,
    "loop_statement"
  );
  var loopVar = Blockly.JavaScript.nameDB_.getDistinctName(
    "count",
    Blockly.VARIABLE_CATEGORY_NAME
  );
  var logs = Blockly.JavaScript.nameDB_.getDistinctName(
    "logs",
    Blockly.VARIABLE_CATEGORY_NAME
  );
  var bestFitness = Blockly.JavaScript.nameDB_.getDistinctName(
    "bestFitness",
    Blockly.VARIABLE_CATEGORY_NAME
  );

  var code = "";
  code += "\n";
  code += "let " + bestFitness + " = Number.MIN_VALUE;\n";
  code += "let " + logs + " = new Array();\n";
  code +=
    "for (var " +
    loopVar +
    "=1;(" +
    continue_condition +
    " || false) && " +
    loopVar +
    " <= " +
    exit_number +
    ";" +
    loopVar +
    "++){\n";
  code += statements_simulation_steps;
  code += "  if (" + fitness + " <= " + bestFitness + ") continue;\n";
  code += "\n";
  code += "  " + bestFitness + " = " + fitness + ";\n";
  code += "  " + logs + ".push({\n";
  code += '    "evaluation": ' + loopVar + ",\n";
  code += '    "fitness": ' + fitness + ",\n";
  code += "  });\n";
  code += "}\n";
  code += logs + '["algorithm"] = "' + algId + '";\n';
  code += logs + '["function"] = ' + fnId + ";\n";
  code += logs + '["dimension"] = ' + dimension + ";\n";
  code += logs + '["run"] = ' + run + ";\n";
  code += logs + '["budget"] = ' + exit_number + ";\n";
  code +=
    "Handler.sendMessage(new Message(Handler.PARENT_ID, " +
    logs +
    ', "log"));\n';
  code += "\n";
  return code;
};

Blockly.JavaScript["ea_run_breeding"] = function (block) {
  var loop_number = Blockly.JavaScript.valueToCode(
    block,
    "loop_number",
    Blockly.JavaScript.ORDER_NONE
  );
  var statements = Blockly.JavaScript.statementToCode(block, "loop_statement");
  var code = "for (var j=0;j < " + loop_number + ";j++){\n";
  code += statements;
  code += "}\n";
  return code;
};

Blockly.JavaScript["ea_addtopopulation"] = function (block) {
  console.warn(
    "ea_addtopopulation uses hardcoded variables and requires the fitness function"
  );
  var dropdown_selection_strategy = block.getFieldValue("SELECTION_STRATEGY");
  var POPULATION = Blockly.JavaScript.valueToCode(
    block,
    "POPULATION",
    Blockly.JavaScript.ORDER_ATOMIC
  );

  // eslint-disable-next-line no-unused-vars -- part of TODO
  var dropdown_tiebreak = block.getFieldValue("TIEBREAK"); // TODO ensure sort is stable and fits the NEWER tiebreak
  var length = "_C2_B5"; //Blockly.JavaScript.nameDB_.getName('µ');
  var code = "";
  if (dropdown_selection_strategy == "BEST") {
    code +=
      POPULATION +
      ".sort(function(a,b) { return fitness(b)-fitness(a)}).slice(0," +
      length +
      ")";
  } else if (dropdown_selection_strategy == "RANDOM") {
    code += "shuffle(parent_population).slice(0," + length + ")";
  }
  return [code, Blockly.JavaScript.ORDER_NONE];
  // TODO: Change ORDER_NONE to the correct strength.
};

Blockly.JavaScript["ea_select_best"] = function (block) {
  console.warn("ea_select_best requires the fitness function");
  var POPULATION = Blockly.JavaScript.valueToCode(
    block,
    "POPULATION",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code =
    POPULATION + ".sort(function(a,b) { return fitness(b)-fitness(a)})[0]";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["max_diversity"] = function (block) {
  var POPULATION = Blockly.JavaScript.valueToCode(
    block,
    "POPULATION",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var functionDiversity = Blockly.JavaScript.provideFunction_("diversity", [
    "function " +
      Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      "(ind1, ind2) {",
    "  var count = 0;",
    "  for (var j=0; j < ind1.length; j++) {",
    "    count += (ind1[j] ^ ind2[j]);",
    "  }",
    "  return count;",
    "}",
  ]);
  var functionMaxDiversity = Blockly.JavaScript.provideFunction_(
    "maxDiversity",
    [
      "function " +
        Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
        "(population) {",
      "  var maxDiversity = 0;",
      "  if (population.length < 2) { return 0 }",
      "  for (var j=0; j < population.length-1; j++) {",
      "    for (var k=j+1; k < population.length; k++) {",
      "      maxDiversity = Math.max(maxDiversity, " +
        functionDiversity +
        "(population[j], population[k]));",
      "    }",
      "  }",
      "  return maxDiversity;",
      "}",
    ]
  );
  var code = functionMaxDiversity + "(" + POPULATION + ")";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["ea_select_parent"] = function (block) {
  console.warn("ea_select_parent uses hardcoded variables");
  var dropdown_name = block.getFieldValue("NAME");
  var variable_population = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("POPULATION"),
    Blockly.Variables.NAME_TYPE
  );
  if (dropdown_name == "UNIFORM") {
    var code =
      variable_population +
      "[Math.floor(Math.random() * " +
      variable_population +
      ".length)]";
    return [code, Blockly.JavaScript.ORDER_NONE];
  } else if (dropdown_name == "FITNESSPROPORTIONATE") {
    console.warn("fitness proportionate selection not yet implemented");
    return ["Array(genome_length).fill(0)", Blockly.JavaScript.ORDER_NONE];
  }
};

Blockly.JavaScript["ea_crossover"] = function (block) {
  var crossover_function = Blockly.JavaScript.valueToCode(
    block,
    "NAME",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var variable_parent1 = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("PARENT1"),
    Blockly.Variables.NAME_TYPE
  );
  var variable_parent2 = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("PARENT2"),
    Blockly.Variables.NAME_TYPE
  );
  var variable_offspring1 = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("OFFSPRING1"),
    Blockly.Variables.NAME_TYPE
  );
  var variable_offspring2 = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("OFFSPRING2"),
    Blockly.Variables.NAME_TYPE
  );
  var code =
    "var offspring_list = " +
    crossover_function +
    "(" +
    variable_parent1 +
    "," +
    variable_parent2 +
    ")\n";
  code += variable_offspring1 + " = offspring_list[0];\n";
  code += variable_offspring2 + " = offspring_list[1];\n";
  return code;
};

Blockly.JavaScript["lists_append"] = function (block) {
  var variable_individual = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("INDIVIDUAL"),
    Blockly.Variables.NAME_TYPE
  );
  var variable_population = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("POPULATION"),
    Blockly.Variables.NAME_TYPE
  );
  var code = variable_population + ".push(" + variable_individual + ");\n";
  return code;
};

Blockly.JavaScript["lists_concat"] = function (block) {
  var variable_population1 = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("POPULATION1"),
    Blockly.Variables.NAME_TYPE
  );
  var variable_population2 = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("POPULATION2"),
    Blockly.Variables.NAME_TYPE
  );
  var code = variable_population1 + ".concat(" + variable_population2 + ")";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["ea_mutate_prob"] = function (block) {
  var variable_individual = Blockly.JavaScript.valueToCode(
    block,
    "individual",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var variable_probability = Blockly.JavaScript.valueToCode(
    block,
    "probability",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code =
    variable_individual +
    ".map(function(x) {return (Math.random() < " +
    variable_probability +
    " ? (1-x) : x) })";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["ea_mutate_bit"] = function (block) {
  console.warn("ea_mutate_bit uses hardcoded variables");
  var variable_individual = Blockly.JavaScript.valueToCode(
    block,
    "individual",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code =
    "function(i) {var ind_index = Math.floor(Math.random()*genome_length); i[ind_index] = (1-i[ind_index]); return i}(" +
    variable_individual +
    ")";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["ea_debug_all"] = function () {
  var code = 'windowalert("genome_length: " + genome_length);\n';
  code += 'windowalert("lambda: " + _CE_BB);\n';
  code += 'windowalert("mu: " + _C2_B5);\n';
  code += 'windowalert("parent1: " + parent1);\n';
  code += 'windowalert("parent2: " + parent2);\n';
  code += 'windowalert("offspring1: " + offspring1);\n';
  code += 'windowalert("offspring2: " + offspring2);\n';
  code += 'windowalert("parent_population: " + parent_population);\n';
  code += 'windowalert("offspring_population: " + offspring_population);\n';
  return code;
};
Blockly.JavaScript["ea_debug"] = function (block) {
  var variable_ = Blockly.JavaScript.valueToCode(
    block,
    "logging_variable",
    Blockly.JavaScript.ORDER_ATOMIC
  );

  // Add new line characters if the logging_variable is a two-dimensional array
  var code = "var print_var = " + variable_ + ";\n";
  code +=
    "if(" +
    variable_ +
    ".length != 0 && Array.isArray(" +
    variable_ +
    "[0]))\n";
  code += "  print_var = " + variable_ + '.join("\\n");\n';
  code += "consolelog(print_var);\n";
  return code;
};

Blockly.JavaScript["ea_log"] = function () {
  console.warn(
    "the ea_log block has been disabled while multi-threading is worked on"
  );
  // var variable = Blockly.JavaScript.valueToCode(block, 'logging_variable', Blockly.JavaScript.ORDER_ATOMIC);
  // var logging_tag = Blockly.JavaScript.valueToCode(block, 'logging_tag', Blockly.JavaScript.ORDER_ATOMIC);
  // var code = 'jsonLogItem[' + logging_tag + '] = ' + variable + ';\n';
  // return code;
  return "";
};

Blockly.JavaScript["ea_crossover_onepoint"] = function () {
  var functionCrossover = Blockly.JavaScript.provideFunction_(
    "crossoverOnepoint",
    [
      "function " +
        Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
        "(p1, p2) {",
      "  var index = Math.floor(Math.random() * p1.length)",
      "  var child1 = p1.slice(0,index)",
      "  child1 = child1.concat(p2.slice(index, p2.length))",
      "  var child2 = p2.slice(0,index)",
      "  child2 = child2.concat(p1.slice(index, p1.length))",
      "  return [child1, child2]",
      "}",
    ]
  );
  return [functionCrossover, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["ea_crossover_twopoint"] = function () {
  var functionCrossover2 = Blockly.JavaScript.provideFunction_(
    "crossoverTwopoint",
    [
      "function " +
        Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
        "(p1, p2) {",
      "  var childrenList = crossoverOnepoint(p1,p2);",
      "  return crossoverOnepoint(childrenList[0], childrenList[1]);",
      "}",
    ]
  );
  return [functionCrossover2, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["ea_crossover_uniform"] = function () {
  var functionCrossover3 = Blockly.JavaScript.provideFunction_(
    "crossoverUniform",
    [
      "function " +
        Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
        "(p1, p2) {",
      "  var child1 = p1;",
      "  var child2 = p2;",
      "  for (var i=0; i < p1.length; i++) {",
      "    if (Math.round(Math.random())) {",
      "      child1[i] = p2[i];",
      "      child2[i] = p1[i];",
      "    }",
      "  }",
      "  return [child1, child2];",
      "}",
    ]
  );
  return [functionCrossover3, Blockly.JavaScript.ORDER_NONE];
};

// TODO: add global shuffle function from https://stackoverflow.com/a/2450976 :
/*
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}*/
