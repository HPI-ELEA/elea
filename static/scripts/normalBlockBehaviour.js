import * as Blockly from "blockly";
import { blockDefinitions } from "../blockDefinition/normalBlocks";
Blockly.defineBlocksWithJsonArray(blockDefinitions);

Blockly.JavaScript["experimental_raw_code"] = function (block) {
  // TODO add javascript validation
  return block.getFieldValue("code") + "\n";
};

Blockly.JavaScript["experimental_raw_value"] = function (block) {
  // TODO add javascript validation
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
  var statementsSimulationSteps = Blockly.JavaScript.statementToCode(
    block,
    "init_statements"
  );

  let code = "";
  code = "async function mainFunction() {\n";
  code += statementsSimulationSteps;
  code += "}\n";
  code += "mainFunction()\n";
  code += ".catch( error => console.error(error) )\n";
  code += ".finally( () => Handler.sendMessage(new Message(Handler.PARENT_ID, 0, 'terminate')) );\n";
  return code;
};

// TODO: init all developer variables with
// https://developers.google.com/blockly/reference/js/Blockly.Variables#.allDeveloperVariables

Blockly.JavaScript["init_meta"] = function (block) {
  var globalVars = "var fittestInd = null;\nvar fittest = 0;\n";
  var statementsSimulationSteps = Blockly.JavaScript.statementToCode(
    block,
    "init_statements"
  );
  return globalVars + statementsSimulationSteps;
};

Blockly.JavaScript["init_run"] = function (block) {
  var statementsSimulationSteps = Blockly.JavaScript.statementToCode(
    block,
    "init_statements"
  );
  return statementsSimulationSteps;
};

Blockly.JavaScript["pop_init"] = function (block) {
  var valuePopInitStrategy = Blockly.JavaScript.valueToCode(
    block,
    "INIT_STRATEGY",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  return [valuePopInitStrategy, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["jump_k"] = function (block) {
  //WARNING: jump_k uses hardcoded variables.
  var k = Blockly.JavaScript.valueToCode(
    block,
    "K",
    Blockly.JavaScript.ORDER_ATOMIC
  ); // TODO: cache
  var variableIndividual = Blockly.JavaScript.nameDB_.getName(
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
  var code = functionName + "(" + variableIndividual + "," + k + ")";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["leading_ones"] = function (block) {
  var variableIndividual = Blockly.JavaScript.nameDB_.getName(
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
  var code = functionName + "(" + variableIndividual + ")";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["init_uniform"] = function () {
  var functionName = Blockly.JavaScript.provideFunction_(
    "uniformInitPopulation",
    [
      "function " + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + "() {",
      "  var fullArray = Array(_C2_B5).fill(0);", // TODO: replace fill for ES5
      "  for (var j=0; j < _C2_B5;j++) {",
      "    var tempArray = Array(genome_length).fill(0);",
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
  //WARNING: init_constant uses hardcoded variables.
  var dropdownConstant = block.getFieldValue("CONSTANT");
  if (dropdownConstant == "ZERO") {
    dropdownConstant = "0";
  } else {
    dropdownConstant = "1";
  }
  var functionName = Blockly.JavaScript.provideFunction_("zeroInitPopulation", [
    "function " + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + "() {",
    "  var fullArray = Array(_C2_B5);",
    "  var tempArray = Array(genome_length);",
    "  for (var j=0; j < genome_length;j++) {",
    "    tempArray[j] = " + dropdownConstant + ";",
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
  //WARNING: individual_init_constant uses hardcoded variables
  var dropdownConstant = block.getFieldValue("CONSTANT");
  if (dropdownConstant == "ZERO") {
    dropdownConstant = "0";
  } else {
    dropdownConstant = "1";
  }
  var functionName = Blockly.JavaScript.provideFunction_("zeroInitIndividual", [
    "function " + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + "() {",
    "  var tempArray = Array(genome_length);",
    "  for (var j=0; j < genome_length;j++) {",
    "    tempArray[j] =" + dropdownConstant + ";",
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
  var continueCondition = Blockly.JavaScript.valueToCode(
    block,
    "continue_condition",
    Blockly.JavaScript.ORDER_NONE
  );
  var exitNumber = Blockly.JavaScript.valueToCode(
    block,
    "exit_number",
    Blockly.JavaScript.ORDER_NONE
  );
  var statementsSimulationSteps = Blockly.JavaScript.statementToCode(
    block,
    "loop_statement"
  );
  var loopVar = Blockly.JavaScript.nameDB_.getDistinctName(
    "count",
    Blockly.VARIABLE_CATEGORY_NAME
  );
  var code =
    "for (var " +
    loopVar +
    "=0;(" +
    continueCondition +
    ") && " +
    loopVar +
    " < " +
    exitNumber +
    "; " +
    loopVar +
    "++){\n";
  code += statementsSimulationSteps;
  code += "}\n";
  return code;
};

// a breeding loop designed to send a log message every time the best fitness is improved
Blockly.JavaScript["run_loop_logging"] = function (block) {
  // WARNING: the run_loop_logging block has had logging disabled while multi-threading is being worked on
  var continueCondition = Blockly.JavaScript.valueToCode(
    block,
    "continue_condition",
    Blockly.JavaScript.ORDER_NONE
  );
  var exitNumber = Blockly.JavaScript.valueToCode(
    block,
    "exit_number",
    Blockly.JavaScript.ORDER_NONE
  );
  // TODO Add validator checking wether aldID exists
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
  var statementsSimulationSteps = Blockly.JavaScript.statementToCode(
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
    continueCondition +
    " || false) && " +
    loopVar +
    " <= " +
    exitNumber +
    ";" +
    loopVar +
    "++){\n";
  code += statementsSimulationSteps;
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
  code += logs + '["budget"] = ' + exitNumber + ";\n";
  code +=
    "Handler.sendMessage(new Message(Handler.PARENT_ID, " +
    logs +
    ', "log"));\n';
  code += "\n";
  return code;
};

Blockly.JavaScript["ea_run_breeding"] = function (block) {
  var loopNumber = Blockly.JavaScript.valueToCode(
    block,
    "loop_number",
    Blockly.JavaScript.ORDER_NONE
  );
  var statements = Blockly.JavaScript.statementToCode(block, "loop_statement");
  var code = "for (var j=0;j < " + loopNumber + ";j++){\n";
  code += statements;
  code += "}\n";
  return code;
};

Blockly.JavaScript["ea_addtopopulation"] = function (block) {
  // WARNING: ea_addtopopulation uses hardcoded variables and requires the fitness function
  var dropdownSelectionStrategy = block.getFieldValue("SELECTION_STRATEGY");
  var POPULATION = Blockly.JavaScript.valueToCode(
    block,
    "POPULATION",
    Blockly.JavaScript.ORDER_ATOMIC
  );

  var length = "_C2_B5"; //Blockly.JavaScript.nameDB_.getName('µ');
  var code = "";
  if (dropdownSelectionStrategy == "FITNESS") {
    code +=
      POPULATION +
      ".sort(function(a,b) { return fitness(b)-fitness(a)}).slice(0," +
      length +
      ")";
  } else if (dropdownSelectionStrategy == "CHANCE") {
    //global shuffle function from https://stackoverflow.com/a/2450976
    var functionName = Blockly.JavaScript.provideFunction_("shuffle", [
      "function " + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + "(array) {",
      " var currentIndex = array.length, temporaryValue, randomIndex;",
      " while (0 !== currentIndex) {",
      "   randomIndex = Math.floor(Math.random() * randomIndex);",
      "   currentIndex -= 1;",
      "   temporaryValue = array[currentIndex];",
      "   array[currentIndex] = array[randomIndex];",
      "   array[randomIndex] = temporaryValue;",
      " }",
      " return array;",
      "}",
    ]);
    code += functionName + "(" + POPULATION + ").slice(0," + length + ")";
  }
  return [code, Blockly.JavaScript.ORDER_NONE];
  // TODO: Change ORDER_NONE to the correct strength.
};

Blockly.JavaScript["ea_select_best"] = function (block) {
  //WARNING: ea_select_best requires the fitness function.
  var POPULATION = Blockly.JavaScript.valueToCode(
    block,
    "POPULATION",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = POPULATION + ".reduce((a,b) => (fitness(a) > fitness(b))? a: b)";
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
  // WARNING: ea_select_parent uses hardcoded variables.
  var dropdownName = block.getFieldValue("NAME");
  var variablePopulation = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("POPULATION"),
    Blockly.Variables.NAME_TYPE
  );
  var code;
  if (dropdownName == "CHANCE") {
    code =
      variablePopulation +
      "[Math.floor(Math.random() * " +
      variablePopulation +
      ".length)]";
    return [code, Blockly.JavaScript.ORDER_NONE];
  } else if (dropdownName == "FITNESSPROPORTIONATE") {
    var functionName = Blockly.JavaScript.provideFunction_(
      "getIndividualFitnessproportionate",
      [
        "function " +
          Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
          "(population) {",
        " var overallFitness = 0, maxRandomNumber = Array(population.length), fitnesses = Array(population.length);",
        " for (let i = 0; i < population.length; i++) {",
        "   const individual = population[i];  ",
        "   const individualFitness = fitness(individual);",
        "   overallFitness += individualFitness;",
        "   fitnesses[i] = individualFitness;",
        " }",
        " if (overallFitness == 0) {",
        "   return population[Math.floor(Math.random() * population.length)];",
        " }",
        " var previousProbability = 0;",
        " for (let i = 0; i < population.length; i++) {",
        "   maxRandomNumber[i] = previousProbability + (fitnesses[i] / overallFitness);",
        "   previousProbability = maxRandomNumber[i];",
        " }",
        " var r  = Math.random();",
        " for (let i = 0; i < population.length; i++) {",
        "   if(r < maxRandomNumber[i]) {",
        "     return population[i];",
        "   }",
        " }",
        " //Due to rounding there is a small possibility of not selecting any individual.",
        " //In this case the process is repeated.",
        " return " +
          Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
          "(population);",
        "}",
      ]
    );
    code = functionName + "(" + variablePopulation + ")";
    return [code, Blockly.JavaScript.ORDER_NONE];
  }
};

Blockly.JavaScript["ea_crossover"] = function (block) {
  var crossoverFunction = Blockly.JavaScript.valueToCode(
    block,
    "NAME",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var variableParent1 = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("PARENT1"),
    Blockly.Variables.NAME_TYPE
  );
  var variableParent2 = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("PARENT2"),
    Blockly.Variables.NAME_TYPE
  );
  var variableOffspring1 = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("OFFSPRING1"),
    Blockly.Variables.NAME_TYPE
  );
  var variableOffspring2 = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("OFFSPRING2"),
    Blockly.Variables.NAME_TYPE
  );
  var code =
    "var offspring_list = " +
    crossoverFunction +
    "(" +
    variableParent1 +
    "," +
    variableParent2 +
    ")\n";
  code += variableOffspring1 + " = offspring_list[0];\n";
  code += variableOffspring2 + " = offspring_list[1];\n";
  return code;
};

Blockly.JavaScript["lists_append"] = function (block) {
  var variableIndividual = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("INDIVIDUAL"),
    Blockly.Variables.NAME_TYPE
  );
  var variablePopulation = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("POPULATION"),
    Blockly.Variables.NAME_TYPE
  );
  var code = variablePopulation + ".push(" + variableIndividual + ");\n";
  return code;
};

Blockly.JavaScript["lists_concat"] = function (block) {
  var variablePopulation1 = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("POPULATION1"),
    Blockly.Variables.NAME_TYPE
  );
  var variablePopulation2 = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("POPULATION2"),
    Blockly.Variables.NAME_TYPE
  );
  var code = variablePopulation1 + ".concat(" + variablePopulation2 + ")";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["ea_mutate_prob"] = function (block) {
  var variableIndividual = Blockly.JavaScript.valueToCode(
    block,
    "individual",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var variableProbability = Blockly.JavaScript.valueToCode(
    block,
    "probability",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code =
    variableIndividual +
    ".map(function(x) {return (Math.random() < " +
    variableProbability +
    " ? (1-x) : x) })";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["ea_mutate_bit"] = function (block) {
  // WARNING: ea_mutate_bit uses hardcoded variables.
  var variableIndividual = Blockly.JavaScript.valueToCode(
    block,
    "individual",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code =
    "function(i) {var ind_index = Math.floor(Math.random()*genome_length); i[ind_index] = (1-i[ind_index]); return i}(" +
    variableIndividual +
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

Blockly.JavaScript["variables_get_individual"] = function (block) {
  var variableIndividual = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Variables.NAME_TYPE
  );

  var code = variableIndividual;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["variables_set_individual"] = function (block) {
  var variableIndividual = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Variables.NAME_TYPE
  );
  var newValueIndividual = Blockly.JavaScript.valueToCode(
    block,
    "VALUE",
    Blockly.JavaScript.ORDER_ATOMIC
  );

  var code = variableIndividual + " = " + newValueIndividual + ";\n";
  return code;
};

Blockly.JavaScript["variables_get_population"] = function (block) {
  var variablePopulation = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Variables.NAME_TYPE
  );

  var code = variablePopulation;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["variables_set_population"] = function (block) {
  var variablePopulation = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Variables.NAME_TYPE
  );
  var newValuePopulation = Blockly.JavaScript.valueToCode(
    block,
    "VALUE",
    Blockly.JavaScript.ORDER_ATOMIC
  );

  var code = variablePopulation + " = " + newValuePopulation + ";\n";
  return code;
};

Blockly.JavaScript["wait"] = function (block) {
  var waitPeriod = block.getFieldValue("PERIOD");
  var functionName = Blockly.JavaScript.provideFunction_("sleep", [
    "function " +
      Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      "(wait_period) {",
    "   const date = Date.now();",
    "   let currentDate = null;",
    "   do {",
    "     currentDate = Date.now();",
    "   } while (currentDate - date < wait_period);",
    "}",
  ]);
  var code = functionName + "(" + waitPeriod * 1000 + ");";
  return code;
};

Blockly.JavaScript["check_fitness"] = function (block) {
  var variablePopulation = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("POPULATION"),
    Blockly.Variables.NAME_TYPE
  );
  var variableMinFitness = Blockly.JavaScript.valueToCode(
    block,
    "MIN_FITNESS",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var functionCheckFitness = Blockly.JavaScript.provideFunction_(
    "populationHasNotRequiredFitness",
    [
      "function " +
        Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
        "(population, fitnessRequired) {",
      "  var bestFitness = 0",
      "  for (var i=0; i < population.length; i++) {",
      "   if(fitness(population[i])>bestFitness){bestFitness=fitness(population[i])}",
      "  }",
      "  return bestFitness < fitnessRequired",
      "}",
    ]
  );
  var code =
    functionCheckFitness +
    "(" +
    variablePopulation +
    "," +
    variableMinFitness +
    ")";
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript["plotting_one_value"] = function (block) {
  var variableYValue = Blockly.JavaScript.valueToCode(
    block,
    "yValue",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var variableDatasetNumber = Blockly.JavaScript.valueToCode(
    block,
    "datasetNumber",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var variablePlotName = block.getFieldValue("plotName");
  var variablePlotType = block.getFieldValue("plotType");

  var code = "plot({xValue: null, yValue: ";
  code += variableYValue + ", datasetNumber: ";
  code += variableDatasetNumber + ", plotName: ";
  code += "'" + variablePlotName + "', plotType: ";
  code += "'" + variablePlotType + "'});\n";
  return code;
};

Blockly.JavaScript["save_in_csv"] = function (block) {
  var variableValue = Blockly.JavaScript.valueToCode(
    block,
    "value",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var variableDatasetName = Blockly.JavaScript.valueToCode(
    block,
    "datasetname",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var variablePlotName = block.getFieldValue("filename");

  var code = "saveInCSV({value: ";
  code += variableValue + ", datasetname: ";
  code += variableDatasetName + ", filename: ";
  code += "'" + variablePlotName + "'});\n";
  return code;
};

Blockly.JavaScript["individual_hamming_distance"] = function (block) {
  var variableInidividual1 = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("FIRST_INDIVIDUAL"),
    Blockly.Variables.NAME_TYPE
  );
  var variableIndividual2 = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("SECOND_INDIVIDUAL"),
    Blockly.Variables.NAME_TYPE
  );
  var functionName = Blockly.JavaScript.provideFunction_(
    "individualHammingDistance",
    [
      "function " +
        Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
        "(individual_1, individual_2) {",
      "  if(individual_1.length != individual_2.length){return 0;}",
      "  var count = 0;",
      "  for (var j=0; j<individual_1.length; j++) {",
      "    if(individual_1[j] == individual_2[j]) {count ++;}",
      "  }",
      "  return count;",
      "}",
    ]
  );
  var code =
    functionName + "(" + variableInidividual1 + "," + variableIndividual2 + ")";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["plotting_two_values"] = function (block) {
  var variableXValue = Blockly.JavaScript.valueToCode(
    block,
    "xValue",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var variableYValue = Blockly.JavaScript.valueToCode(
    block,
    "yValue",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var variableDatasetNumber = Blockly.JavaScript.valueToCode(
    block,
    "datasetNumber",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var variablePlotName = block.getFieldValue("plotName");
  var variablePlotType = block.getFieldValue("plotType");

  var code = "plot({xValue: " + variableXValue + ", yValue: ";
  code += variableYValue + ", datasetNumber: ";
  code += variableDatasetNumber + ", plotName: ";
  code += "'" + variablePlotName + "', plotType: ";
  code += "'" + variablePlotType + "'});\n";
  return code;
};
