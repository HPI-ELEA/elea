import * as Blockly from "blockly";

Blockly.Python["experimental_raw_code"] = function (block) {
  // TODO add Python validation
  return block.getFieldValue("code") + "\n";
};

Blockly.Python["experimental_raw_value"] = function (block) {
  // TODO add Python validation
  return [block.getFieldValue("code"), Blockly.Python.ORDER_NONE];
};

Blockly.Python["comment"] = function (block) {
  return "# " + block.getFieldValue("text").replaceAll("\n", " ") + "\n";
};

Blockly.Python["experimental_timer"] = function (block) {
  let statements = Blockly.Python.statementToCode(block, "code");
  let result = Blockly.Python.nameDB_.getName(
    block.getFieldValue("output_time"),
    Blockly.Variables.NAME_TYPE
  );
  let timer = Blockly.Python.nameDB_.getDistinctName(
    "startTime",
    Blockly.VARIABLE_CATEGORY_NAME
  );

  let code = timer + " = time.time()\n";

  code += statements + "\n";
  code += result + " = time.time() - " + timer + "\n";

  return code;
};

// the init block encapsulates everything else into a generator function to allow for multi-threading
Blockly.Python["ea_init"] = function (block) {
  var statementsSimulationSteps = Blockly.Python.statementToCode(
    block,
    "init_statements"
  );
  var globals = [];
  var workspace = block.workspace;
  var variables = Blockly.Variables.allUsedVarModels(workspace) || [];
  for (var i = 0, variable; (variable = variables[i]); i++) {
    var varName = variable.name;
    if (block.getVars().indexOf(varName) == -1) {
      globals.push(
        Blockly.Python.nameDB_.getName(varName, Blockly.VARIABLE_CATEGORY_NAME)
      );
    }
  }
  globals = globals.length
    ? Blockly.Python.INDENT + "global " + globals.join(", ") + "\n"
    : "";
  Blockly.Python.provideFunction_("import_libraries", [
    "import random\nimport math\nimport time\n",
  ]);
  Blockly.Python.provideFunction_("mainFunction", [
    "def " +
      Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ +
      " ():\n" +
      globals +
      statementsSimulationSteps,
  ]);

  var code = "";
  code += "if __name__ == '__main__':\n";
  code += "\ttry:\n";
  code += "\t\tmainFunction()\n";
  code += "\texcept Exception as e:\n";
  code += "\t\tprint(e)\n";
  // TODO: Add the finally stuff for multithreading
  return code;
};

// TODO: init all developer variables with
// https://developers.google.com/blockly/reference/js/Blockly.Variables#.allDeveloperVariables

Blockly.Python["init_meta"] = function (block) {
  //This Block is currently not used and could probably be removed
  var globalVars = "var fittestInd = null;\nvar fittest = 0;\n";
  var statementsSimulationSteps = Blockly.Python.statementToCode(
    block,
    "init_statements"
  );
  return globalVars + statementsSimulationSteps;
};

Blockly.Python["init_run"] = function (block) {
  var statementsSimulationSteps = Blockly.Python.statementToCode(
    block,
    "init_statements"
  );
  return statementsSimulationSteps;
};

Blockly.Python["pop_init"] = function (block) {
  var valuePopInitStrategy = Blockly.Python.valueToCode(
    block,
    "INIT_STRATEGY",
    Blockly.Python.ORDER_ATOMIC
  );
  return [valuePopInitStrategy, Blockly.Python.ORDER_NONE];
};

Blockly.Python["jump_k"] = function (block) {
  //WARNING: jump_k uses hardcoded variables.
  var k = Blockly.Python.valueToCode(block, "K", Blockly.Python.ORDER_ATOMIC); // TODO: cache
  var variableIndividual = Blockly.Python.nameDB_.getName(
    block.getFieldValue("INDIVIDUAL"),
    Blockly.Variables.NAME_TYPE
  );
  var functionName = Blockly.Python.provideFunction_("jump_k", [
    "def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "(individual, k):",
    "   sum = sum(indiviual)",
    "   if (sum <= genome_length - k || sum == genome_length):",
    "       return sum",
    "   else:",
    "       return 0",
  ]);
  var code = functionName + "(" + variableIndividual + "," + k + ")";
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python["leading_ones"] = function (block) {
  var variableIndividual = Blockly.Python.nameDB_.getName(
    block.getFieldValue("INDIVIDUAL"),
    Blockly.Variables.NAME_TYPE
  );
  var functionName = Blockly.Python.provideFunction_("leading_ones", [
    "def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "(individual):",
    "   count, j = 0;",
    "   while(individual[j] == 1 and j<len(individual)):",
    "       count += 1",
    "       j+=1",
    "   return count;",
  ]);
  var code = functionName + "(" + variableIndividual + ")";
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python["init_uniform"] = function () {
  var functionName = Blockly.Python.provideFunction_("uniformInitPopulation", [
    "def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "():",
    "   fullArray = [0] * _C2_B5",
    "   for ind in fullArray:",
    "       tempArray = [0] * genome_length",
    "       for gene in tempArray:",
    "           gene = round(random.random())",
    "       ind = tempArray",
    "   return fullArray",
  ]);
  var code = functionName + "()";
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["individual_init_uniform"] = function () {
  var functionName = Blockly.Python.provideFunction_("uniformInitIndividual", [
    "def  " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "():",
    "   tempArray = [0] * genome_length",
    "   for gene in tempArray:",
    "       gene = round(random.random())",
    "   return tempArray;",
  ]);
  var code = functionName + "()";
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["init_constant"] = function (block) {
  //WARNING: init_constant uses hardcoded variables.
  var dropdownConstant = block.getFieldValue("CONSTANT");
  if (dropdownConstant == "ZERO") {
    dropdownConstant = "0";
  } else {
    dropdownConstant = "1";
  }
  var functionName = Blockly.Python.provideFunction_("zeroInitPopulation", [
    "def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "():",
    "   fullArray = [[" +
      dropdownConstant +
      "for x in range(genome_length)] for y in range(_C2_B5)]",
    "   return fullArray",
  ]);
  var code = functionName + "()";
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["individual_init_constant"] = function (block) {
  //WARNING: individual_init_constant uses hardcoded variables
  var dropdownConstant = block.getFieldValue("CONSTANT");
  if (dropdownConstant == "ZERO") {
    dropdownConstant = "0";
  } else {
    dropdownConstant = "1";
  }
  var functionName = Blockly.Python.provideFunction_("zeroInitIndividual", [
    "def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "() {",
    "   var tempArray = [" + dropdownConstant + "] * genome_length",
    "   return tempArray;",
  ]);
  var code = functionName + "()";
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

// all of the logging functionality of this block has been removed due to the modified messsage handling system used for
// multi-threading. The logging system needs to be re-implemented and potentially redesigned
Blockly.Python["run_loop"] = function (block) {
  var continueCondition = Blockly.Python.valueToCode(
    block,
    "continue_condition",
    Blockly.Python.ORDER_NONE
  );
  var exitNumber = Blockly.Python.valueToCode(
    block,
    "exit_number",
    Blockly.Python.ORDER_NONE
  );
  var statementsSimulationSteps = Blockly.Python.statementToCode(
    block,
    "loop_statement"
  );
  var loopVar = Blockly.Python.nameDB_.getDistinctName(
    "count",
    Blockly.VARIABLE_CATEGORY_NAME
  );
  var code = loopVar + " = 0\n";
  code +=
    "while ((" +
    continueCondition +
    ") and " +
    loopVar +
    " < " +
    exitNumber +
    "):\n";
  code += Blockly.Python.INDENT + loopVar + " += 1\n";
  code += statementsSimulationSteps;
  return code;
};

// a breeding loop designed to send a log message every time the best fitness is improved
// TODO: Implement this block
Blockly.Python["run_loop_logging"] = function (block) {
  // WARNING: the run_loop_logging block has had logging disabled while multi-threading is being worked on
  var continueCondition = Blockly.Python.valueToCode(
    block,
    "continue_condition",
    Blockly.Python.ORDER_NONE
  );
  var exitNumber = Blockly.Python.valueToCode(
    block,
    "exit_number",
    Blockly.Python.ORDER_NONE
  );
  // TODO Add validator checking whether algID exists
  var algId = block.getFieldValue("algId");
  var fnId = block.getFieldValue("fnId");
  var fitness = Blockly.Python.valueToCode(
    block,
    "fitness",
    Blockly.Python.ORDER_NONE
  );
  var dimension = Blockly.Python.valueToCode(
    block,
    "dim",
    Blockly.Python.ORDER_NONE
  );
  var run = Blockly.Python.valueToCode(block, "run", Blockly.Python.ORDER_NONE);
  var statementsSimulationSteps = Blockly.Python.statementToCode(
    block,
    "loop_statement"
  );
  var loopVar = Blockly.Python.nameDB_.getDistinctName(
    "count",
    Blockly.VARIABLE_CATEGORY_NAME
  );
  var logs = Blockly.Python.nameDB_.getDistinctName(
    "logs",
    Blockly.VARIABLE_CATEGORY_NAME
  );
  var bestFitness = Blockly.Python.nameDB_.getDistinctName(
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
    " || false) and " +
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

Blockly.Python["ea_run_breeding"] = function (block) {
  var loopNumber = Blockly.Python.valueToCode(
    block,
    "loop_number",
    Blockly.Python.ORDER_NONE
  );
  var loopVar = Blockly.Python.nameDB_.getDistinctName(
    "count",
    Blockly.VARIABLE_CATEGORY_NAME
  );
  var statements = Blockly.Python.statementToCode(block, "loop_statement");
  var code = "for " + loopVar + " in range(math.floor(" + loopNumber + ")):\n";
  code += statements;
  return code;
};

Blockly.Python["ea_addtopopulation"] = function (block) {
  // WARNING: ea_addtopopulation uses hardcoded variables and requires the fitness function
  var dropdownSelectionStrategy = block.getFieldValue("SELECTION_STRATEGY");
  var POPULATION = Blockly.Python.valueToCode(
    block,
    "POPULATION",
    Blockly.Python.ORDER_ATOMIC
  );

  var length = "_C2_B5"; //Blockly.Python.nameDB_.getName('µ');
  var code = "";
  if (dropdownSelectionStrategy == "FITNESS") {
    code +=
      "sorted(" + POPULATION + ",key=lambda x: fitness(x))[0:" + length + "]";
  } else if (dropdownSelectionStrategy == "CHANCE") {
    code += "random.shuffle(" + POPULATION + ")[0:" + length + "]";
  }
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python["ea_select_best"] = function (block) {
  //WARNING: ea_select_best requires the fitness function.
  var POPULATION = Blockly.Python.valueToCode(
    block,
    "POPULATION",
    Blockly.Python.ORDER_ATOMIC
  );
  var code = "max(" + POPULATION + ",key=lambda x: fitness(x))";
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python["max_diversity"] = function (block) {
  var POPULATION = Blockly.Python.valueToCode(
    block,
    "POPULATION",
    Blockly.Python.ORDER_ATOMIC
  );
  var functionDiversity = Blockly.Python.provideFunction_("diversity", [
    "def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "(ind1, ind2):",
    "   count = 0",
    "   for idx,gene in enumerate(ind1):",
    "       count += (gene ^ ind2[idx])",
    "   return count;",
  ]);
  var functionMaxDiversity = Blockly.Python.provideFunction_("maxDiversity", [
    "def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "(population):",
    "   maxDiversity = 0;",
    "   if (len(population) < 2) return 0",
    "   for j,ind in enumerate(population):",
    "       for k in range(j+1,len(population)-1):",
    "           maxDiversity = max(maxDiversity, " +
      functionDiversity +
      "(population[j], population[k]))",
    "   return maxDiversity;",
  ]);
  var code = functionMaxDiversity + "(" + POPULATION + ")";
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python["ea_select_parent"] = function (block) {
  // WARNING: ea_select_parent uses hardcoded variables.
  var dropdownName = block.getFieldValue("NAME");
  var variablePopulation = Blockly.Python.nameDB_.getName(
    block.getFieldValue("POPULATION"),
    Blockly.Variables.NAME_TYPE
  );
  var code;
  if (dropdownName == "UNIFORM") {
    code =
      variablePopulation +
      "[math.floor(random.random() * len(" +
      variablePopulation +
      "))]";
    return [code, Blockly.Python.ORDER_NONE];
  } else if (dropdownName == "FITNESSPROPORTIONATE") {
    var functionName = Blockly.Python.provideFunction_(
      "getIndividualFitnessproportionate",
      [
        "def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "(population):",
        "   overallFitness = 0",
        "   maxRandomNumber = [0] * len(population)",
        "   fitnesses = [0] * len(population)",
        "   for idx,individual in enumerate(population):",
        "       individualFitness = fitness(individual)",
        "       overallFitness += individualFitness",
        "       fitnesses[idx] = individualFitness",
        "   if (overallFitness == 0):",
        "       return population[math.floor(random.random() * len(population))]",
        "   previousProbability = 0",
        "   for idx,individual in enumerate(population):",
        "       maxRandomNumber[idx] = previousProbability + (fitnesses[idx] / overallFitness)",
        "       previousProbability = maxRandomNumber[idx]",
        "   r  = random.random()",
        "   for idx,individual in enumerate(population):",
        "       if(r < maxRandomNumber[idx]):",
        "           return population[idx]",
        "   #Due to rounding there is a small possibility of not selecting any individual.",
        "   #In this case the process is repeated.",
        "   return " +
          Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ +
          "(population)",
      ]
    );
    code = functionName + "(" + variablePopulation + ")";
    return [code, Blockly.Python.ORDER_NONE];
  }
};

Blockly.Python["ea_crossover"] = function (block) {
  var crossoverFunction = Blockly.Python.valueToCode(
    block,
    "NAME",
    Blockly.Python.ORDER_ATOMIC
  );
  var variableParent1 = Blockly.Python.nameDB_.getName(
    block.getFieldValue("PARENT1"),
    Blockly.Variables.NAME_TYPE
  );
  var variableParent2 = Blockly.Python.nameDB_.getName(
    block.getFieldValue("PARENT2"),
    Blockly.Variables.NAME_TYPE
  );
  var variableOffspring1 = Blockly.Python.nameDB_.getName(
    block.getFieldValue("OFFSPRING1"),
    Blockly.Variables.NAME_TYPE
  );
  var variableOffspring2 = Blockly.Python.nameDB_.getName(
    block.getFieldValue("OFFSPRING2"),
    Blockly.Variables.NAME_TYPE
  );
  var code =
    "offspring_list = " +
    crossoverFunction +
    "(" +
    variableParent1 +
    "," +
    variableParent2 +
    ")\n";
  code += variableOffspring1 + " = offspring_list[0]\n";
  code += variableOffspring2 + " = offspring_list[1]\n";
  return code;
};

Blockly.Python["lists_append"] = function (block) {
  var variableIndividual = Blockly.Python.nameDB_.getName(
    block.getFieldValue("INDIVIDUAL"),
    Blockly.Variables.NAME_TYPE
  );
  var variablePopulation = Blockly.Python.nameDB_.getName(
    block.getFieldValue("POPULATION"),
    Blockly.Variables.NAME_TYPE
  );
  var code = variablePopulation + ".append(" + variableIndividual + ")\n";
  return code;
};

Blockly.Python["lists_concat"] = function (block) {
  var variablePopulation1 = Blockly.Python.nameDB_.getName(
    block.getFieldValue("POPULATION1"),
    Blockly.Variables.NAME_TYPE
  );
  var variablePopulation2 = Blockly.Python.nameDB_.getName(
    block.getFieldValue("POPULATION2"),
    Blockly.Variables.NAME_TYPE
  );
  var code = variablePopulation1 + " + " + variablePopulation2;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python["ea_mutate_prob"] = function (block) {
  var variableIndividual = Blockly.Python.valueToCode(
    block,
    "individual",
    Blockly.Python.ORDER_ATOMIC
  );
  var variableProbability = Blockly.Python.valueToCode(
    block,
    "probability",
    Blockly.Python.ORDER_ATOMIC
  );
  var code =
    "[(1-x) if random.random() < " +
    variableProbability +
    " else x for x in " +
    variableIndividual +
    "]";
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python["ea_mutate_bit"] = function (block) {
  // WARNING: ea_mutate_bit uses hardcoded variables.
  var variableIndividual = Blockly.Python.valueToCode(
    block,
    "individual",
    Blockly.Python.ORDER_ATOMIC
  );
  var code =
    "ind_index = floor(random.random() * genome_length\n" +
    variableIndividual +
    "[ind_index] = 1 - " +
    variableIndividual +
    "[ind_index]";
  // var code =
  //     "function(i) {var ind_index = Math.floor(Math.random()*genome_length); i[ind_index] = (1-i[ind_index]); return i}(" +
  //     variableIndividual +
  //     ")";
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python["sample_normal_positive"] = function (block) {
  let variableMean = Blockly.Python.valueToCode(
    block,
    "mean",
    Blockly.Python.ORDER_ATOMIC
  );
  let variableVariance = Blockly.Python.valueToCode(
    block,
    "variance",
    Blockly.Python.ORDER_ATOMIC
  );

  var functionName = Blockly.Python.provideFunction_("sampleNormalPositive", [
    "def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "():",
    "   sample = 0",
    "   while (sample <= 0) sample = math.round(random.normal(loc=" +
      variableMean +
      ",scale=" +
      variableVariance +
      "))",
    "   return sample",
  ]);
  var code = functionName + "()";
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["ea_debug_all"] = function () {
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
Blockly.Python["ea_debug"] = function (block) {
  var variable_ = Blockly.Python.valueToCode(
    block,
    "logging_variable",
    Blockly.Python.ORDER_ATOMIC
  );

  // Add new line characters if the logging_variable is a two-dimensional array

  var functionName = Blockly.Python.provideFunction_("printToOutput", [
    "def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "(output):",
    "   print_var = output;",
    "   if (len(output) != 0 and isinstance(output, list)):",
    "       if (isinstance(output[0], list)):",
    "           print_var = output.join('\\n')",
    "   print(print_var)",
  ]);

  var code = functionName + "(" + variable_ + ")\n";
  return code;
};

Blockly.Python["ea_crossover_onepoint"] = function () {
  var functionCrossover = Blockly.Python.provideFunction_("crossoverOnepoint", [
    "def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "(p1, p2):",
    "   index = math.floor(random.random() * len(p1))",
    "   child1 = p1[0:index]",
    "   child1 = child1 + p2[index:len(p2)]",
    "   child2 = p2[0:index]",
    "   child2 = child2 + p1[index:len(p1)]",
    "   return [child1, child2]",
  ]);
  return [functionCrossover, Blockly.Python.ORDER_NONE];
};

Blockly.Python["ea_crossover_twopoint"] = function () {
  var functionCrossover2 = Blockly.Python.provideFunction_(
    "crossoverTwopoint",
    [
      "def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "(p1, p2):",
      "   childrenList = crossoverOnepoint(p1,p2)",
      "   return crossoverOnepoint(childrenList[0], childrenList[1])",
    ]
  );
  return [functionCrossover2, Blockly.Python.ORDER_NONE];
};

Blockly.Python["ea_crossover_uniform"] = function () {
  var functionCrossover3 = Blockly.Python.provideFunction_("crossoverUniform", [
    "def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "(p1, p2):",
    "   child1 = p1;",
    "   child2 = p2;",
    "   for idx, gene in enumerate(p1):",
    "       if (math.round(random.random())):",
    "           child1[idx] = p2[idx]",
    "           child2[idx] = p1[idx]",
    "  return [child1, child2]",
  ]);
  return [functionCrossover3, Blockly.Python.ORDER_NONE];
};

Blockly.Python["variables_get_individual"] = function (block) {
  var variableIndividual = Blockly.Python.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Variables.NAME_TYPE
  );

  var code = variableIndividual;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python["variables_set_individual"] = function (block) {
  var variableIndividual = Blockly.Python.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Variables.NAME_TYPE
  );
  var newValueIndividual = Blockly.Python.valueToCode(
    block,
    "VALUE",
    Blockly.Python.ORDER_ATOMIC
  );
  var code = variableIndividual + " = " + newValueIndividual + "\n";
  return code;
};

Blockly.Python["variables_get_population"] = function (block) {
  var variablePopulation = Blockly.Python.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Variables.NAME_TYPE
  );

  var code = variablePopulation;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python["variables_set_population"] = function (block) {
  var variablePopulation = Blockly.Python.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Variables.NAME_TYPE
  );
  var newValuePopulation = Blockly.Python.valueToCode(
    block,
    "VALUE",
    Blockly.Python.ORDER_ATOMIC
  );

  var code = variablePopulation + " = " + newValuePopulation + "\n";
  return code;
};

Blockly.Python["wait"] = function (block) {
  var waitPeriod = block.getFieldValue("PERIOD");
  var code = "time.wait(" + waitPeriod + ")";
  return code;
};

Blockly.Python["check_fitness"] = function (block) {
  var variablePopulation = Blockly.Python.nameDB_.getName(
    block.getFieldValue("POPULATION"),
    Blockly.Variables.NAME_TYPE
  );
  var variableMinFitness = Blockly.Python.valueToCode(
    block,
    "MIN_FITNESS",
    Blockly.Python.ORDER_ATOMIC
  );
  var functionCheckFitness = Blockly.Python.provideFunction_(
    "populationHasNotRequiredFitness",
    [
      "def " +
        Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ +
        "(population, fitnessRequired):",
      "   bestFitness = 0",
      "   for ind in population:",
      "       if(fitness(ind)>bestFitness):",
      "           bestFitness = fitness(ind)",
      "   return bestFitness < fitnessRequired",
    ]
  );
  var code =
    functionCheckFitness +
    "(" +
    variablePopulation +
    "," +
    variableMinFitness +
    ")";
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

// TODO: Actually write the python plotting Code
Blockly.Python["plotting_one_value"] = function (block) {
  var variableYValue = Blockly.Python.valueToCode(
    block,
    "yValue",
    Blockly.Python.ORDER_ATOMIC
  );
  var variableDatasetNumber = Blockly.Python.valueToCode(
    block,
    "datasetNumber",
    Blockly.Python.ORDER_ATOMIC
  );
  var variablePlotName = Blockly.Python.valueToCode(
    block,
    "plotName",
    Blockly.Python.ORDER_ATOMIC
  );
  var variablePlotType = block.getFieldValue("plotType");

  var code = "#plot({xValue: null, yValue: ";
  code += variableYValue + ", datasetNumber: ";
  code += variableDatasetNumber + ", plotName: ";
  code += variablePlotName + ", plotType: ";
  code += "'" + variablePlotType + "'});\n";
  return code;
};

//TODO: Implementation in Python
Blockly.Python["save_in_csv"] = function (block) {
  var variableValue = Blockly.Python.valueToCode(
    block,
    "value",
    Blockly.Python.ORDER_ATOMIC
  );
  var variableDatasetName = Blockly.Python.valueToCode(
    block,
    "datasetname",
    Blockly.Python.ORDER_ATOMIC
  );
  var variablePlotName = block.getFieldValue("filename");

  var code = "#saveInCSV({value: ";
  code += variableValue + ", datasetname: ";
  code += variableDatasetName + ", filename: ";
  code += "'" + variablePlotName + "'});\n";
  return code;
};

Blockly.Python["individual_hamming_distance"] = function (block) {
  var variableInidividual1 = Blockly.Python.nameDB_.getName(
    block.getFieldValue("FIRST_INDIVIDUAL"),
    Blockly.Variables.NAME_TYPE
  );
  var variableIndividual2 = Blockly.Python.nameDB_.getName(
    block.getFieldValue("SECOND_INDIVIDUAL"),
    Blockly.Variables.NAME_TYPE
  );
  var functionName = Blockly.Python.provideFunction_(
    "individualHammingDistance",
    [
      "def " +
        Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ +
        "(individual_1, individual_2):",
      "   if(len(individual_1) != len(individual_2))  return 0",
      "   count = 0",
      "   for idx, ind in enumerate(individual_1):",
      "       if(individual_1[idx] == individual_2[idx])  count += 1",
      "   return count;",
    ]
  );
  var code =
    functionName + "(" + variableInidividual1 + "," + variableIndividual2 + ")";
  return [code, Blockly.Python.ORDER_NONE];
};

//TODO: Add Python Implementierung
Blockly.Python["plotting_two_values"] = function (block) {
  var variableXValue = Blockly.Python.valueToCode(
    block,
    "xValue",
    Blockly.Python.ORDER_ATOMIC
  );
  var variableYValue = Blockly.Python.valueToCode(
    block,
    "yValue",
    Blockly.Python.ORDER_ATOMIC
  );
  var variableDatasetNumber = Blockly.Python.valueToCode(
    block,
    "datasetNumber",
    Blockly.Python.ORDER_ATOMIC
  );
  var variablePlotName = Blockly.Python.valueToCode(
    block,
    "plotName",
    Blockly.Python.ORDER_ATOMIC
  );
  var variablePlotType = block.getFieldValue("plotType");

  var code = "#plot({xValue: " + variableXValue + ", yValue: ";
  code += variableYValue + ", datasetNumber: ";
  code += variableDatasetNumber + ", plotName: ";
  code += variablePlotName + ", plotType: ";
  code += "'" + variablePlotType + "'});\n";
  return code;
};

Blockly.Python["iteration_counter_loop"] = function (block) {
  var variableLoopMode = block.getFieldValue("loop_mode");
  var variableCondition = Blockly.Python.valueToCode(
    block,
    "loop_condition",
    Blockly.Python.ORDER_ATOMIC
  );
  var statements = Blockly.Python.statementToCode(block, "loop_statement");
  var variableCounter = Blockly.Python.nameDB_.getName(
    block.getFieldValue("counter_variable"),
    Blockly.Variables.NAME_TYPE
  );

  var code = "";
  if (variableLoopMode == "while") {
    code += variableCounter + " = 0\n";
    code += "while(" + variableCondition + "):\n";
    code += statements + Blockly.Python.INDENT + variableCounter + "+= 1\n";
    return code;
  } else {
    code += variableCounter + " = 0\n";
    code += "while(!" + variableCondition + "):\n";
    code += statements + Blockly.Python.INDENT + variableCounter + "+= 1\n";
    return code;
  }
};

Blockly.Python["functions_basic_fitness"] = function (block) {
  var variableIndividual = Blockly.Python.valueToCode(
    block,
    "individual",
    Blockly.Python.ORDER_ATOMIC
  );
  var code = "";
  code += "fitness(" + variableIndividual + ")";
  return [code, Blockly.Python.ORDER_NONE];
};
