export const blockDefinitions = [
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
    tooltip: "This block runs if you click 'Run Javascript'.",
    helpUrl: "",
    category: "algorithm-parts",
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
    tooltip:
      "An initialization strategy, which generates a population uniformly.",
    helpUrl: "",
    category: "algorithm-parts",
  },
  {
    type: "individual_init_uniform",
    message0: "individual uniform random init",
    output: "Individual",
    colour: 230,
    tooltip:
      "An initialization strategy, which generates an individual uniformly.",
    helpUrl: "",
    category: "individuals",
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
    tooltip:
      "An initialization strategy, which generates a population with constant individuals.",
    helpUrl: "",
    category: "algorithm-parts",
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
    output: "Individual",
    colour: 230,
    tooltip:
      "An initialization strategy, which generates an individual with constants.",
    helpUrl: "",
    category: "individuals",
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
        check: "init_strategy",
        comment:
          "A strategy that specifies how a population is generated. Use for example 'init_constant' or 'init_uniform'.",
      },
    ],
    inputsInline: true,
    output: "Array",
    colour: 230,
    tooltip:
      "Use this function to init your population of individuals with a specific initialization strategy.",
    helpUrl: "",
    category: "algorithm-parts",
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
        comment: "Maximum number of iterations.",
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
    tooltip:
      "Repeats instructions as often as a condition applies and the number of iterations isn't exceeded.",
    helpUrl: "",
    category: "algorithm-parts",
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
    category: "algorithm-parts",
  },
  {
    type: "jump_k",
    message0: "jump k fitness for %1 with k = %2",
    args0: [
      {
        type: "field_variable",
        name: "INDIVIDUAL",
        variable: "individual",
        variableTypes: ["Individual"],
        defaultType: ["Individual"],
      },
      {
        type: "input_value",
        name: "K",
        check: "Number",
      },
    ],
    inputsInline: true,
    output: "Number",
    colour: 180,
    tooltip: "Calculate jump-k value on individual.",
    helpUrl: "",
    category: "measures",
  },

  {
    type: "leading_ones",
    message0: "leading ones fitness for %1",
    args0: [
      {
        type: "field_variable",
        name: "INDIVIDUAL",
        variable: "individual",
        variableTypes: ["Individual"],
        defaultType: "Individual",
      },
    ],
    inputsInline: true,
    output: "Number",
    colour: 180,
    tooltip: "Calculate leading ones value on an individual.",
    helpUrl: "",
    category: "measures",
  },

  {
    type: "lists_append",
    message0: "add %1 to %2",
    args0: [
      {
        type: "field_variable",
        name: "INDIVIDUAL",
        variable: "offspring1",
        variableTypes: ["Individual"],
        defaultType: "Individual",
      },
      {
        type: "field_variable",
        name: "POPULATION",
        variable: "offspring_population",
        variableTypes: ["Array"],
        defaultType: "Array",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 260,
    tooltip: "Adds an individual to an population.",
    helpUrl: "",
    category: "list",
  },
  {
    type: "lists_concat",
    message0: "merge %1 with %2",
    args0: [
      {
        type: "field_variable",
        name: "POPULATION1",
        variable: "parent_population",
        variableTypes: ["Array"],
        defaultType: "Array",
      },
      {
        type: "field_variable",
        name: "POPULATION2",
        variable: "offspring_population",
        variableTypes: ["Array"],
        defaultType: "Array",
      },
    ],
    output: "Array",
    colour: 260,
    tooltip: "Returns the of entirely of two two populations.",
    helpUrl: "",
    category: "list",
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
        comment: "Strategy to select an individual.",
      },
      {
        type: "field_variable",
        name: "POPULATION",
        variable: "parent_population",
        variableTypes: ["Array"],
        defaultType: "Array",
      },
    ],
    output: "Individual",
    colour: 230,
    tooltip:
      "Selects an individuals from a population with an an selection strategy.",
    helpUrl: "",
    category: "algorithm-parts",
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
    tooltip: "Returns a copy of an individual.",
    helpUrl: "",
    category: "individuals",
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
    category: "algorithm-parts",
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
        check: "crossover_strategy",
        comment:
          "A crossover strategy two transform two individuals into two new one.",
      },
      {
        type: "field_variable",
        name: "PARENT1",
        variable: "parent1",
        variableTypes: ["Individual"],
        defaultType: "Individual",
        comment:
          "One of two individuals from which two new individuals emerge.",
      },
      {
        type: "field_variable",
        name: "PARENT2",
        variable: "parent2",
        variableTypes: ["Individual"],
        defaultType: "Individual",
        comment:
          "One of two individuals from which two new individuals emerge.",
      },
      {
        type: "field_variable",
        name: "OFFSPRING1",
        variable: "offspring1",
        variableTypes: ["Individual"],
        defaultType: "Individual",
        comment:
          "One of two individuals that emerge from the crossover with the crossover strategy.",
      },
      {
        type: "field_variable",
        name: "OFFSPRING2",
        variable: "offspring2",
        variableTypes: ["Individual"],
        defaultType: "Individual",
        comment:
          "One of two individuals that emerge from the crossover with the crossover strategy.",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip:
      "Generates from two individuals two new one with an crossover strategy.",
    helpUrl: "",
    category: "individuals",
  },
  {
    type: "ea_mutate",
    message0: "mutate %1",
    args0: [
      {
        type: "input_value",
        name: "individual",
        check: "Individual",
      },
    ],
    inputsInline: true,
    output: null,
    colour: 120,
    tooltip: "Mutate an individual randomly.",
    helpUrl: "",
    category: "individuals",
  },
  {
    type: "ea_mutate_prob",
    message0: "mutate %1 with a bitwise probability of %2",
    args0: [
      {
        type: "input_value",
        name: "individual",
        check: "Individual",
      },
      {
        type: "input_value",
        name: "probability",
        check: "Number",
      },
    ],
    inputsInline: true,
    output: "Individual",
    colour: 120,
    tooltip: "",
    helpUrl: "",
    category: "individuals",
  },
  {
    type: "ea_mutate_bit",
    message0: "mutate a random bit in %1 ",
    args0: [
      {
        type: "input_value",
        name: "individual",
        check: "Individual",
      },
    ],
    inputsInline: true,
    output: "Individual",
    colour: 120,
    tooltip: "",
    helpUrl: "",
    category: "individuals",
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
        check: "Array",
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
    output: "Array",
    colour: 230,
    tooltip:
      "Generates from a given population a new one by selecting some individuals with a selection strategy.",
    helpUrl: "",
    category: "individuals",
  },
  {
    type: "ea_select_best",
    message0: "select best individual from %1",
    args0: [
      {
        type: "input_value",
        name: "POPULATION",
        check: "Array",
      },
    ],
    inputsInline: false,
    output: "Individual",
    colour: 230,
    tooltip:
      "Selects the best individuals from an population using the user-definied 'fitness'-function.",
    helpUrl: "",
    category: "individuals",
  },
  {
    type: "max_diversity",
    message0: "max pairwise diversity of %1",
    args0: [
      {
        type: "input_value",
        name: "POPULATION",
        check: "Array",
      },
    ],
    inputsInline: false,
    output: "Number",
    colour: 180,
    tooltip: "Calculates the maximum pairwise diversity of an population.",
    helpUrl: "",
    category: "measures",
  },
  {
    type: "ea_crossover_onepoint",
    message0: "one-point",
    output: "crossover_strategy",
    colour: 120,
    tooltip:
      "A crossover strategy in which two individuals are cut and joined at a point.",
    helpUrl: "",
    category: "individuals",
  },
  {
    type: "ea_crossover_twopoint",
    message0: "two-point",
    output: "crossover_strategy",
    colour: 120,
    tooltip:
      "A crossover strategy in which two individuals are cut and joined at two points",
    helpUrl: "",
    category: "individuals",
  },
  {
    type: "ea_crossover_uniform",
    message0: "uniform",
    output: "crossover_strategy",
    colour: 120,
    tooltip: "A crossover strategy in which each bit is exchanged uniformly.",
    helpUrl: "",
    category: "individuals",
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
        comment: "Printed value.",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: "#777",
    tooltip: "",
    helpUrl: "",
    category: "logging",
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
    message0: '// " %1 "',
    args0: [
      {
        type: "field_multilinetext",
        name: "text",
        text: "Add comment",
        comment: "Content of the comment.",
      },
    ],
    inputsInLine: true,
    previousStatement: true,
    nextStatement: true,
    colour: 60,
    tooltip: "",
    helpUrl: "",
    category: "logging",
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
        variableTypes: ["Number"],
        defaultType: "Number",
      },
    ],
    inputsInLine: true,
    previousStatement: true,
    nextStatement: true,
    colour: 0,
    category: "experimental",
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
    category: "experimental",
  },
  {
    type: "variables_get_individual",
    message0: "individual %1",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: "%{BKY_VARIABLES_DEFAULT_NAME}",
        variableTypes: ["Individual"],
        defaultType: "Individual",
      },
    ],
    output: "Individual",
    colour: 330,
    tooltip: "",
    helpUrl: "",
    category: "variable",
  },
  {
    type: "variables_set_individual",
    message0: "set individual %1 to %2",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: "%{BKY_VARIABLES_DEFAULT_NAME}",
        variableTypes: ["Individual"],
        defaultType: "Individual",
      },
      {
        type: "input_value",
        name: "VALUE",
        check: "Individual",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 330,
    tooltip: "",
    helpUrl: "",
    category: "variable",
  },
  {
    type: "variables_get_population",
    message0: "population %1",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: "%{BKY_VARIABLES_DEFAULT_NAME}",
        variableTypes: ["Array"],
        defaultType: "Array",
      },
    ],
    output: "Array",
    colour: 330,
    tooltip: "",
    helpUrl: "",
    category: "variable",
  },
  {
    type: "variables_set_population",
    message0: "set population %1 to %2",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: "%{BKY_VARIABLES_DEFAULT_NAME}",
        variableTypes: ["Array"],
        defaultType: "Array",
      },
      {
        type: "input_value",
        name: "VALUE",
        check: "Array",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 330,
    tooltip: "",
    helpUrl: "",
    category: "variable",
  },
];
