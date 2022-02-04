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
      '<div class="display-5 alert alert-info" id="cat-moreblocks"><h2><strong>More blocks</strong></h2><p>Blocks without categorization. That means, you can\'t use them.</p></div>\
        <hr id="cat-moreblocks-separator">'
    ).insertAfter("#cat-experimental-separator");
  }
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
    block_header_div(get_block_name(block), block.type),
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

function block_header_div(block_name, block_type) {
  /* TODO Click to copy
  let hostname = "(new Url(document.location)).hostname"
  let url = '"' + hostname + "/documentation#block-" + block_type + '"'
  let link = 
    '<svg onclick="()=>navigator.clipboard.writeText(' + url +')" xmlns="http://www.w3.org/2000/svg" width="30" height="30  " fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">\
    <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>\
    <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>\
    </svg>'
  return '<h3 class="h4" id="' + block_type + '">' + block_name + link + '</h3>';
  */

  return '<h3 class="h4" id="' + block_type + '">' + block_name + "</h3>";
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
    "<p><i>" +
    block_input.name +
    "</i> (type: " +
    (block_input.type || "<i>no type</i>") +
    ")<br/>";
  description += (block_input.comment || "") + "</p>";
  return description + "</li>";
}

function block_output_div(block_output) {
  if (!block_output) return "";
  let header = '<h3 class="h5">Output</h3>';
  let type = "<p>" + block_output + "</p>";
  return header + type;
}
