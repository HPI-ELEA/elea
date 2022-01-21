import * as Blockly from "blockly";

function get_block_name(json_object) {
  let block_name = "";
  let num_args = 1;
  for (let substr in json_object.message0.split(" ")) {
    if (!substr.match(/%\d+/g)) {
      block_name.concat(substr + " ");
    } else if (
      json_object.args0[parseInt(substr.substring(1)) - 1].type == "input_dummy"
    ) {
      block_name.concat("%" + num_args++ + " ");
    }
  }
  return block_name;
}

function get_tooltip(json_object) {
  return json_object.tooltip || false;
}

function get_category(json_object) {
  return json_object.category || "moreblocks";
}

function get_output_type(json_object) {
  return json_object.output || false;
}

function get_input(json_object) {
  let inputs = [];
  for (let input in json_object.args0) {
    if (input.type == "input_dummy")
      inputs.push({
        name: input.name,
        type: input.type,
        comment: input.comment || false,
      });
  }
  return inputs;
}

function set_block_image(json_object, div_element) {
  var workspace = Blockly.inject(div_element, {
    comments: false,
    toolbox: false,
    trashcan: false,
    readOnly: true,
    scrollbars: false,
    zoom: false,
  });

  Blockly.Blocks["tmp_block"] = {
    init: function () {
      this.jsonInit(json_object);
    },
  };
  workspace.newBlock("tmp_block");

  var metrics = workspace.getMetrics();
  div_element.style.height = metrics.contentHeight + "px";
  div_element.style.width = metrics.contentWidth + "px";
  Blockly.svgResize(workspace);
}

export {
  get_block_name,
  get_tooltip,
  get_category,
  get_input,
  get_output_type,
  set_block_image,
};
