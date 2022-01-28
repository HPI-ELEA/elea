import { blockDefinitions as normalBlocks } from "../blockDefinition/normalBlocks";
import { blockDefinitions as threadBlocks } from "../blockDefinition/threadBlocks";
import {
  get_block_name,
  get_category,
  get_input,
  get_output_type,
  get_tooltip,
  set_block_image,
} from "./modules/blockDocumentation";
import $ from "jquery";

normalBlocks.concat(threadBlocks).forEach((block) => {
  let entry = documentation_entry_div(block);
  let category = get_category(block);
  if (category == "moreblocks" && $("#cat-moreblocks").length == 0) {
    // more blocks category doesn't exists
    $(
      '\
        <h2 class="display-5 alert alert-info" id="cat-moreblocks"><strong>More blocks</strong></h2>\
        <hr id="cat-moreblocks-separator"></hr>\
        '
    ).insertAfter("#cat-experimental-separator");
  }
  console.log(entry);
  $(entry).insertBefore("#cat-" + category + "-separator");
  set_block_image(
    block,
    document.getElementById("block-" + block.type + "-svg")
  );
});

function documentation_entry_div(block) {
  let div =
    '<ul class="list-group" id="' +
    block.type +
    '" style="margin-bottom: 2rem">';
  div = add_list_item(
    div,
    block_header_div(get_block_name(block)),
    "list-group-item-secondary"
  );
  div = add_list_item(div, block_comment_div(get_tooltip(block)));
  div = add_list_item(div, block_inputs_div(get_input(block)));
  div = add_list_item(div, block_output_div(get_output_type(block)));
  div += "</ul>";
  div +=
    '<div class="block-svg"><div id="block-' +
    block.type +
    '-svg"></div></div>';

  return div;
}

function add_list_item(list, item, config = "") {
  if (item == "") return list;
  list += '<li class="list-group-item ' + config + '">' + item + "</li>";
  return list;
}

function block_header_div(block_name) {
  return '<h3 class="h4">' + block_name + "</h3>";
}

function block_comment_div(block_tooltip) {
  if (!block_tooltip) return "";
  let header = '<h3 class="h5">Tooltip</h3>';
  let comment = "<p>" + (block_tooltip || "") + "</p>";
  return header + comment;
}

function block_inputs_div(block_inputs) {
  if (block_inputs.length == 0) return "";
  let header = '<h3 class="h5">Inputs</h3>';
  let list = "<ul>";
  block_inputs.forEach((input) => (list += block_single_input_div(input)));
  list += "</ul>";
  return header + list;
}

function block_single_input_div(block_input) {
  if (!block_input) return "";
  let description = "<li>";
  description +=
    "<p>" +
    block_input.name +
    " (" +
    (block_input.type || "<i>no type</i>") +
    ")</p>";
  description += "<p>" + (block_input.comment || "") + "</p>";
  return description + "</li>";
}

function block_output_div(block_output) {
  if (!block_output) return "";
  let header = '<h3 class="h5">Output</h3>';
  let type = "<p>" + block_output + "</p>";
  return header + type;
}
