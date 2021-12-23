import * as Blockly from "blockly";
import { workspace } from "./blocklyHandling";
import {
  HAS_UNSAVED_CHANGES,
  setupUnsavedChangesHandling,
} from "./unsavedChangesHandling";

function replaceWorkspaceQuestion(xml) {
  if (!replaceWorkspaceWithXml(xml)) return;
  document.getElementById("workspace-title").innerHTML = "Untitled";
}

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

function selectedFileChanged() {
  console.log("fileChanged");
  var input = document.getElementById("upload_xml_input");
  if (input.files.length === 0) {
    console.log("No file selected.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function fileReadCompleted() {
    replaceWorkspaceQuestion(reader.result);
    console.log("algorithm updated");
    document.getElementById("workspace-title").innerHTML = input.files[0].name;
  };
  reader.readAsText(input.files[0]);
}

export { replaceWorkspaceWithXml, selectedFileChanged, promptForXML };
