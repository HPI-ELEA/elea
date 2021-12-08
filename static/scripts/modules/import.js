import * as Blockly from "blockly";
import { HAS_UNSAVED_CHANGES, workspace } from "./blocklyHandling";
import { waitForFinishedLoading } from "./unsavedChangesHandling";

function replaceWorkspaceQuestion(xml) {
  // TODO: Ask for unsaved changes
  replaceWorkspaceWithXml(xml);
}

function replaceWorkspaceWithXml(xml) {
  if (HAS_UNSAVED_CHANGES) {
    if (!window.confirm("Are you sure you want to exit without saving?"))
      return;
  }
  workspace.clear();
  Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
  workspace.addChangeListener(waitForFinishedLoading);
}

function promptForXML() {
  var xml = prompt();
  if (xml == null) return;
  console.warn(xml);
  replaceWorkspaceWithXml(xml);
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
