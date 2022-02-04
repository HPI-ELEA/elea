import * as Blockly from "blockly";

function get_block_name(json_object) {
  let block_name = "";
  json_object.message0.split(" ").forEach((substr) => {
    if (!substr.match(/%\d+/g)) {
      block_name += substr + " ";
    } else if (
      json_object.args0 &&
      json_object.args0[parseInt(substr.substring(1)) - 1].type != "input_dummy"
    ) {
      let input_name =
        json_object.args0[parseInt(substr.substring(1)) - 1].name;
      block_name +=
        "<small><strong>" + input_name.toUpperCase() + "</strong></small> ";
    }
  });
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
  let args0 = json_object.args0 || [];
  let inputs = [];
  args0.forEach((input) => {
    if (input.type != "input_dummy")
      inputs.push({
        name: input.name.toUpperCase(),
        type: input.type,
        comment: input.comment || false,
      });
  });
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

  Blockly.Blocks[json_object.type] = {
    init: function () {
      this.jsonInit(json_object);
    },
  };
  var block = workspace.newBlock(json_object.type);
  block.initSvg();
  block.render();

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
