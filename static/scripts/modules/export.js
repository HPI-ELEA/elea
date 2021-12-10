import * as Blockly from "blockly";
import { resetHasUnsavedChangesHandling } from "./unsavedChangesHandling";
import { workspace, getCode } from "./blocklyHandling";
import { downloadFile, copyToClipboard } from "./fileUtils";

function copyXMLToClipboard() {
  var xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
  copyToClipboard(xml);
  resetHasUnsavedChangesHandling();
}

function copyJSToClipboard() {
  var js = getCode();
  copyToClipboard(js);
  resetHasUnsavedChangesHandling();
}

function download(text, name, type) {
  var file = new Blob([text], { type: type });
  downloadFile(file, name);
  resetHasUnsavedChangesHandling();
}

function downloadWorkspace() {
  var xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
  download(xml, "algorithm.xml", "text/xml");
}

function downloadWorkspaceAsJS() {
  var js = getCode();
  download(js, "algorithm.js", "text/javascript");
}

export {
  downloadWorkspace,
  copyXMLToClipboard,
  downloadWorkspaceAsJS,
  copyJSToClipboard,
  downloadFile,
};
