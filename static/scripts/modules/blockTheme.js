import * as Blockly from "blockly";

/*eslint-disable camelcase -- arguments provided by Blockly */
var theme = Blockly.Theme.defineTheme("eleaTheme", {
  base: Blockly.Themes.Classic,
  blockStyles: {
    indiv_blocks: { colourPrimary: "120" },
    pop_blocks: { colourPrimary: "330" },
    fitness_blocks: { colourPrimary: "180" },
    primitive_blocks: { colourPrimary: "230" },
    logic_blocks: { colourPrimary: "230" },
    loop_blocks: { colourPrimary: "230" },
    text_blocks: { colourPrimary: "230" },
    variable_blocks: { colourPrimary: "230" },
    list_blocks: { colourPrimary: "330" },
    logging_blocks: { colourPrimary: "#777" },
    experimental_blocks: { colourPrimary: "#111111" },
    timer_blocks: { colourPrimary: "0" },
    thread_blocks: { colourPrimary: "389" },
  },
});

export { theme };
