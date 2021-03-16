Blockly.defineBlocksWithJsonArray([
  //
  {
    "type": "ea_crossover_detail",
    "message0": "crossover | used variables: %1 %2 %3 %4 %5 Make sure to use the copy functions %6 child1 and child2 should contain the offsprings %7 %8",
    "args0": [
      {
        "type": "field_variable",
        "name": "parent1",
        "variable": "parent1"
      },
      {
        "type": "field_variable",
        "name": "parent2",
        "variable": "parent2"
      },
      {
        "type": "field_variable",
        "name": "child1",
        "variable": "child1"
      },
      {
        "type": "field_variable",
        "name": "child2",
        "variable": "child2"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "crossover"
      },
    ]
  },
]);

/*

  {
    "type": "test",
    "message0": "Copy X",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "test1",
    "message0": "Copy Y",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "test2",
    "message0": "Crossover",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 150,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "test3",
    "message0": "Mutate X",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "test5",
    "message0": "Mutate Y",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "test4",
    "message0": "Replace",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 150,
    "tooltip": "",
    "helpUrl": ""
  }
  */

/*
Blockly.JavaScript['ea_crossover'] = function(block) {
  var variable_parent1 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('parent1'), Blockly.Variables.NAME_TYPE);
  var variable_parent2 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('parent2'), Blockly.Variables.NAME_TYPE);
  var variable_child1 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('child1'), Blockly.Variables.NAME_TYPE);
  var variable_child2 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('child2'), Blockly.Variables.NAME_TYPE);
  var statements_crossover = Blockly.JavaScript.statementToCode(block, 'crossover');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};



Blockly.JavaScript['play_sound'] = function(block) {
let value = '\'' + block.getFieldValue('VALUE') + '\'';
return 'MusicMaker.queueSound(' + value + ');\n';
};*/