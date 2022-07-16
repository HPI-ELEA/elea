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
    style: "procedure_blocks",
    tooltip: "This block runs if you click 'Run'.",
    helpUrl: "",
  },
  {//legacy
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
  {//legacy
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
    style: "pop_blocks",
    tooltip:
      "An initialization strategy, which generates a population with individuals whos values are set randomly.",
    helpUrl: "",
  },
  {
    type: "individual_init_uniform",
    message0: "individual uniform random init",
    output: "Individual",
    style: "indiv_blocks",
    tooltip:
      "An initialization strategy, which generates an individual whos values are set randomly.",
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
    style: "pop_blocks",
    tooltip:
      "An initialization strategy, which generates a population with constant individuals.",
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
    output: "Individual",
    style: "indiv_blocks",
    tooltip:
      "An initialization strategy, which generates an individual with given constants.",
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
        check: "init_strategy",
        comment:
          "A strategy that specifies how a population is generated. Use 'init_constant' or 'init_uniform' for example.",
      },
    ],
    inputsInline: true,
    output: "Array",
    style: "pop_blocks",
    tooltip:
      "Use this function to initialize your population of individuals with a specific initialization strategy.",
    helpUrl: "",
  },
  {//legacy
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
    style: "loop_blocks",
    tooltip:
      "Repeats instructions as often as a condition applies and the number of iterations isn't exceeded.",
    helpUrl: "",
  },
  {
    type: "run_loop_logging",
    message0:
      "While %1 Budget %2 Algorithm ID %3 %4 Function ID %5 %6 %7 %8 Log: %9 fitness %10 dimension %11 run %12 for the IOHanalyzer",
    args0: [
      {
        type: "input_value",
        name: "continue_condition",
        check: "Boolean",
        comment: "Condition for the loop",
      },
      {
        type: "input_value",
        name: "exit_number",
        check: "Number",
        comment: "Maximum number of iterations",
      },
      {
        type: "field_input",
        name: "algId",
        text: "elea",
        comment: "ID of the algorithm for IOHanalyzer",
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
        comment:
          "ID of the used fitness function in the algorithm for the IOHanalyzer.",
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
        comment: "Current fitness function.",
      },
      {
        type: "input_value",
        name: "dim",
        check: "Number",
        comment: "Number of the dimension (mostly 1).",
      },
      {
        type: "input_value",
        name: "run",
        check: "Number",
        comment: "ID of the run.",
      },
    ],
    inputsInline: false,
    previousStatement: null,
    nextStatement: null,
    style: "loop_blocks",
    tooltip:
      "An experimental breeding loop with integrated logging for IOHprofiler. After you execute the program, download the data for the IOHanalyzer, go to page of the <a href='https://iohanalyzer.liacs.nl/'>IOHanalyzer</a> and analyze your data.",
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
    style: "fitness_blocks",
    tooltip: "Calculate jump-k value on individual.",
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
        variableTypes: ["Individual"],
        defaultType: "Individual",
      },
    ],
    inputsInline: true,
    output: "Number",
    style: "fitness_blocks",
    tooltip: "Calculate leading ones value on an individual.",
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
    style: "pop_blocks",
    tooltip: "Adds an individual to a population.",
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
    style: "pop_blocks",
    tooltip: "Returns the entirety of the two populations.",
    helpUrl: "",
  },
  {
    type: "ea_select_parent",
    message0: "select individual based on %1 from %2",
    args0: [
      {
        type: "field_dropdown",
        name: "NAME",
        options: [
          ["fitnessproportionately", "FITNESSPROPORTIONATE"],
          ["chance", "CHANCE"],
        ],
        comment: "Strategy to select an individual from a population.",
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
    style: "pop_blocks",
    tooltip:
      "Selects an individual from a population based on given selection strategy.",
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
    style: "indiv_blocks",
    tooltip: "Returns a copy of an individual.",
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
    style: "loop_blocks",
    tooltip: "Runs breeding instructions for given number of iterations.",
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
    style: "indiv_blocks",
    tooltip:
      "Generates two offspring individuals from parent individuals based on given crossover instructions.",
    helpUrl: "",
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
    style: "indiv_blocks",
    tooltip: "Mutate an individual randomly.",
    helpUrl: "",
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
    style: "indiv_blocks",
    tooltip: "Mutate given individual bitwise using given probability.",
    helpUrl: "",
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
    style: "indiv_blocks",
    tooltip: "Mutate random single bit of given individual.",
    helpUrl: "",
  },
  {
    type: "ea_addtopopulation",
    message0: "generate new population based on %1 from %2 ",
    args0: [
      {
        type: "field_dropdown",
        name: "SELECTION_STRATEGY",
        options: [
          ["fitness", "FITNESS"],
          ["chance", "CHANCE"],
        ],
      },
      {
        type: "input_value",
        name: "POPULATION",
        check: "Array",
      },
    ],
    inputsInline: false,
    output: "Array",
    style: "pop_blocks",
    tooltip:
      "Generates a new population from a given one by selecting individuals based on given selection strategy.",
    helpUrl: "",
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
    style: "pop_blocks",
    tooltip:
      "Selects the best individuals from a population using the given 'fitness'-function.",
    helpUrl: "",
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
    style: "fitness_blocks",
    tooltip: "Calculates the maximum pairwise diversity of a population.",
    helpUrl: "",
  },
  {
    type: "ea_crossover_onepoint",
    message0: "one-point",
    output: "crossover_strategy",
    style: "indiv_blocks",
    tooltip:
      "A crossover strategy in which two individuals are cut and joined at a point.",
    helpUrl: "",
  },
  {
    type: "ea_crossover_twopoint",
    message0: "two-point",
    output: "crossover_strategy",
    style: "indiv_blocks",
    tooltip:
      "A crossover strategy where two individuals are cut and joined at two points",
    helpUrl: "",
  },
  {
    type: "ea_crossover_uniform",
    message0: "uniform",
    output: "crossover_strategy",
    style: "indiv_blocks",
    tooltip: "A crossover strategy where each bit is exchanged uniformly.",
    helpUrl: "",
  },

  {//legacy
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
    style: "logging_blocks",
    tooltip: "Print given value to output.",
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
    style: "logging_blocks",
    tooltip: "Adds input text as comment.",
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
        variableTypes: ["Number"],
        defaultType: "Number",
      },
    ],
    inputsInLine: true,
    previousStatement: true,
    nextStatement: true,
    style: "timer_blocks",
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
    style: "experimental_blocks",
    tooltip: "Enter raw line of code to execute.",
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
    style: "experimental_blocks",
    tooltip: "Enter raw code value to use.",
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
    style: "indiv_blocks",
    tooltip: "References value of given item.",
    helpUrl: "",
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
    style: "indiv_blocks",
    tooltip: "Sets value of given individual according to following block.",
    helpUrl: "",
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
    style: "pop_blocks",
    tooltip: "References given population.",
    helpUrl: "",
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
    style: "pop_blocks",
    tooltip: "Overwrites population values according to following block.",
    helpUrl: "",
  },
  {
    type: "wait",
    message0: "wait for %1 seconds",
    args0: [
      {
        type: "field_number",
        name: "PERIOD",
        check: "Number",
        comment: "Period of time to wait for.",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "timer_blocks",
    tooltip: "Stops the execution for given period of time.",
    helpUrl: "",
  },
  {
    type: "check_fitness",
    message0: "no individual from %1 has fitness of at least %2",
    args0: [
      {
        type: "field_variable",
        name: "POPULATION",
        variable: "%{BKY_VARIABLES_DEFAULT_NAME}",
        variableTypes: ["Array"],
        defaultType: "Array",
      },
      {
        type: "input_value",
        name: "MIN_FITNESS",
        check: "Number",
        comment: "minimum fitness of an individual",
      },
    ],
    inputsInline: true,
    output: "Boolean",
    style: "pop_blocks",
    tooltip:
      "Returns true when no individual from given population has the requested fitness.",
    helpUrl: "",
  },
  {
    type: "plotting_one_value",
    message0: "Plot %1 Dataset: %2 in Plot: %3 as %4",
    args0: [
      {
        type: "input_value",
        name: "yValue",
        check: "Number",
        comment: "value of the new datapoint",
      },
      {
        type: "input_value",
        name: "datasetNumber",
        check: ["String", "Number"],
        comment:
          "Determines to which dataset of the plot this data will be added.",
      },
      {
        type: "field_input",
        name: "plotName",
        text: "fitness",
        check: "String",
        comment: "Determines which plot this datapoint will be added to.",
      },
      {
        type: "field_dropdown",
        name: "plotType",
        options: [
          ["scatterplot", "scatter"],
          ["linegraph", "line"],
          ["barchart", "bar"],
        ],
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: "logging_blocks",
    helpUrl: "",
    tooltip: "Use this block to create plots with given data from your EA.",
  },
  {
    type: "save_in_csv",
    message0: "Save %1 Dataset: %2 in CSV-file: %3",
    args0: [
      {
        type: "input_value",
        name: "value",
        check: "Number",
        comment:
          "value of the new datapoint. A datapoint is part of a dataset.",
      },
      {
        type: "input_value",
        name: "datasetname",
        check: ["String", "Number"],
        comment:
          "Determines to which column of the CSV-file this value will be added. A dataset contains a number of datapoints.",
      },
      {
        type: "field_input",
        name: "filename",
        text: "fitness",
        check: "String",
        comment:
          "Determines which CSV-file this datapoint will be added to. A CSV-file contains a number of datasets represented as columns.",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: "logging_blocks",
    helpUrl: "",
    tooltip: "Use this block to create CSV-Files with the data from your EA.",
  },
  {
    type: "individual_hamming_distance",
    message0: "diversity between %1 and %2",
    args0: [
      {
        type: "field_variable",
        name: "FIRST_INDIVIDUAL",
        variable: "individual",
        variableTypes: ["Individual"],
        defaultType: "Individual",
      },
      {
        type: "field_variable",
        name: "SECOND_INDIVIDUAL",
        variable: "individual",
        variableTypes: ["Individual"],
        defaultType: "Individual",
      },
    ],
    inputsInline: true,
    output: "Number",
    style: "fitness_blocks",
    tooltip: "Calculate the hemming distance between two individuals.",
    helpUrl: "",
  },
  {
    type: "plotting_two_values",
    message0: "Plot x: %1 y: %2 in Dataset: %3 in Plot: %4 as %5",
    args0: [
      {
        type: "input_value",
        name: "xValue",
        check: "Number",
        comment: "x-value of the new datapoint",
      },
      {
        type: "input_value",
        name: "yValue",
        check: "Number",
        comment: "y-value of the new datapoint",
      },
      {
        type: "input_value",
        name: "datasetNumber",
        check: ["String", "Number"],
        comment:
          "Determines to which dataset of the plot this data will be added.",
      },
      {
        type: "field_input",
        name: "plotName",
        text: "fitness",
        check: "String",
        comment: "Determines which plot this datapoint will be added to.",
      },
      {
        type: "field_dropdown",
        name: "plotType",
        options: [
          ["scatterplot", "scatter"],
          ["linegraph", "line"],
          ["barchart", "bar"],
        ],
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: "#777",
    helpUrl: "",
    category: "logging",
    tooltip: "Use this block to create plots with given x and y data from your EA.",
  },
];
