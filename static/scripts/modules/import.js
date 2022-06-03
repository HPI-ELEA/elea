import * as Blockly from "blockly";
import { workspace } from "./blocklyHandling";
import {
  HAS_UNSAVED_CHANGES,
  setupUnsavedChangesHandling,
} from "./unsavedChangesHandling";
import { PARAMETERS, update_url } from "./exampleHandling";

// Check if you can replace the workspace
// If true, replace the workspace with an xml string
// and update the query in the URL
function replaceWorkspaceQuestion(xml) {
  if (!replaceWorkspaceWithXml(xml)) return;
  document.getElementById("workspace-title").innerHTML = "Untitled";
  PARAMETERS.delete("example");
  update_url();
}

// Check if the workspace has unsaved changes and replace the workspace
function replaceWorkspaceWithXml(xml) {
  if (HAS_UNSAVED_CHANGES) {
    if (!window.confirm("Are you sure you want to exit without saving?"))
      return false;
  }
  workspace.clear();
  Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
  setupUnsavedChangesHandling();
  return true;
}

function promptForXML() {
  var xml = prompt();
  if (xml == null) return;
  console.warn(xml);
  replaceWorkspaceQuestion(xml);
}

// Get file, read XML and load workspace and update the workspace title
function selectedFileChanged() {
  console.log("fileChanged");
  // Get files
  var input = document.getElementById("upload_xml_input");
  if (input.files.length === 0) {
    console.log("No file selected.");
    return;
  }

  // Read XML
  const reader = new FileReader();
  reader.onload = function fileReadCompleted() {
    // Replace workspace
    replaceWorkspaceQuestion(reader.result);
    console.log("algorithm updated");
    document.getElementById("workspace-title").innerHTML = input.files[0].name;
  };
  reader.readAsText(input.files[0]);
}

export { replaceWorkspaceWithXml, selectedFileChanged, promptForXML };
