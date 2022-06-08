import { blockDefinitions as normalBlocks } from "../blockDefinition/normalBlocks";
import { blockDefinitions as threadBlocks } from "../blockDefinition/threadBlocks";
import {
  getBlockName,
  getCategory,
  getInput,
  getOutputType,
  getTooltip,
  setBlockImage,
} from "./modules/blockDocumentation";
import $ from "jquery";

normalBlocks.concat(threadBlocks).forEach((block) => {
  // For each definied block generate and add a documentation entry
  // to the specified category
  let entry = documentationEntryDiv(block);
  let category = getCategory(block);
  if (category == "moreblocks" && $("#cat-moreblocks").length == 0) {
    // more blocks category doesn't exists, then add it
    $(
      '<div class="display-5 alert alert-info" id="cat-moreblocks"><h2><strong>More blocks</strong></h2><p>Blocks without categorization. That means, you can\'t use them.</p></div>\
        <hr id="cat-moreblocks-separator">'
    ).insertAfter("#cat-experimental_blocks-separator");
  }
  // Appending to the category means
  // inserting the entry before the seperator to the next category
  $(entry).insertBefore("#cat-" + category + "-separator");
  setBlockImage(block, document.getElementById("block-" + block.type + "-svg"));
});

// remove loading icon and show content
document.getElementById("spinner").style.display = "none";
document.getElementById("content-container").style.display = "block";

function documentationEntryDiv(block) {
  // A documentation entry contains the name, input-, output-information and image
  let div =
    '<ul class="list-group" id="' +
    block.type +
    '" style="margin-bottom: 2rem">';
  div = addListItem(
    div,
    blockHeaderDiv(getBlockName(block), block.type),
    "list-group-item-secondary"
  );
  div = addListItem(div, blockCommentDiv(getTooltip(block)));
  div = addListItem(div, blockInputsDiv(getInput(block)));
  div = addListItem(div, blockOutputDiv(getOutputType(block)));
  div += "</ul>";
  div +=
    '<div class="block-svg"><div id="block-' +
    block.type +
    '-svg"></div></div>';

  return div;
}

function addListItem(list, item, config = "") {
  if (item == "") return list;
  list += '<li class="list-group-item ' + config + '">' + item + "</li>";
  return list;
}

// Generates header containing the name
function blockHeaderDiv(blockName, blockType) {
  /* TODO Click to copy the URL
  let hostname = "(new Url(document.location)).hostname"
  let url = '"' + hostname + "/documentation#block-" + blockType + '"'
  let link = 
    '<svg onclick="()=>navigator.clipboard.writeText(' + url +')" xmlns="http://www.w3.org/2000/svg" width="30" height="30  " fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">\
    <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>\
    <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>\
    </svg>'
  return '<h3 class="h4" id="' + blockType + '">' + blockName + link + '</h3>';
  */

  return '<h3 class="h4" id="' + blockType + '">' + blockName + "</h3>";
}

function blockCommentDiv(blockTooltip) {
  if (!blockTooltip) return "";
  let header = '<h3 class="h5">Tooltip</h3>';
  let comment = "<p>" + (blockTooltip || "") + "</p>";
  return header + comment;
}

// Generates the list with input arguments
function blockInputsDiv(blockInputs) {
  if (blockInputs.length == 0) return "";
  let header = '<h3 class="h5">Inputs</h3>';
  let list = "<ul>";
  blockInputs.forEach((input) => (list += blockSingleInputDiv(input)));
  list += "</ul>";
  return header + list;
}

// Generates an entry of the input argument list
function blockSingleInputDiv(blockInput) {
  if (!blockInput) return "";
  let description = "<li>";
  description +=
    "<p><i>" +
    blockInput.name +
    "</i> (type: " +
    (blockInput.type || "<i>no type</i>") +
    ")<br/>";
  description += (blockInput.comment || "") + "</p>";
  return description + "</li>";
}

function blockOutputDiv(blockOutput) {
  if (!blockOutput) return "";
  let header = '<h3 class="h5">Output</h3>';
  let type = "<p>" + blockOutput + "</p>";
  return header + type;
}
