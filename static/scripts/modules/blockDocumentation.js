import * as Blockly from "blockly";
import { theme } from "./blockTheme";

// Selects the name of a block for the documentation.
function getBlockName(jsonObject) {
  let blockName = "";
  jsonObject.message0.split(" ").forEach((substr) => {
    if (!substr.match(/%\d+/g)) {
      // If the substring isn't "%x", just add it to the block name
      blockName += substr + " ";
    } else if (
      jsonObject.args0 &&
      jsonObject.args0[parseInt(substr.substring(1)) - 1].type != "input_dummy"
    ) {
      // If the substring is an argument, add the the name of the argument to the block name
      let inputName = jsonObject.args0[parseInt(substr.substring(1)) - 1].name;
      blockName +=
        "<small><strong>" + inputName.toUpperCase() + "</strong></small> ";
    }
  });
  return blockName;
}

function getTooltip(jsonObject) {
  return jsonObject.tooltip || false;
}

function getCategory(jsonObject) {
  return jsonObject.style || "moreblocks";
}

function getOutputType(jsonObject) {
  return getType(jsonObject.output) || false;
}

// Returns a list containing information about the arguments.
// Each entry contains name, type and a comment of an argument
function getInput(jsonObject) {
  let args0 = jsonObject.args0 || [];
  let inputs = [];
  args0.forEach((input) => {
    if (input.type != "input_dummy") {
      let type;
      if (input.type == "field_variable") type = input.variableTypes;
      if (input.type == "input_value") type = input.check;
      if (input.type == "input_statement") type = "Statements";

      inputs.push({
        name: input.name.toUpperCase(),
        type: getType(type),
        comment: input.comment || false,
      });
    }
  });
  return inputs;
}

// Generate a div with an image of the block
// by constructing a small workspace and adding the block
function setBlockImage(jsonObject, divElement) {
  var workspace = Blockly.inject(divElement, {
    comments: false,
    toolbox: false,
    trashcan: false,
    readOnly: true,
    scrollbars: false,
    zoom: false,
    theme: theme,
  });

  Blockly.Blocks[jsonObject.type] = {
    init: function () {
      this.jsonInit(jsonObject);
    },
  };
  var block = workspace.newBlock(jsonObject.type);
  block.initSvg();
  block.render();

  var metrics = workspace.getMetrics();
  divElement.style.height = metrics.contentHeight + "px";
  divElement.style.width = metrics.contentWidth + "px";
  Blockly.svgResize(workspace);
}

// Replace internal representations of datastructures by users one
function getType(typeString) {
  if (typeString == "Array") return "Population";
  return typeString;
}

export {
  getBlockName,
  getTooltip,
  getCategory,
  getInput,
  getOutputType,
  setBlockImage,
};
