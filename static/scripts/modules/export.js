import * as Blockly from "blockly";
import { resetHasUnsavedChanges } from "./unsavedChangesHandling";
import { workspace, getCode } from "./blocklyHandling";

function copyToClipboard(str) {
  const el = document.createElement("textarea");
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

// this function was taken from: https://stackoverflow.com/a/52829183
const downloadFile = (blob, fileName) => {
  const link = document.createElement("a");
  // create a blobURI pointing to our Blob
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  // some browser needs the anchor to be in the doc
  document.body.append(link);
  link.click();
  link.remove();
  // in case the Blob uses a lot of memory
  setTimeout(() => URL.revokeObjectURL(link.href), 7000);
};

function copyXMLToClipboard() {
  var xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
  copyToClipboard(xml);
  resetHasUnsavedChanges();
}

function copyJSToClipboard() {
  var js = getCode();
  copyToClipboard(js);
  resetHasUnsavedChanges();
}

function showXMLInPopup() {
  var xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
  window.alert(xml);
}

function download(text, name, type) {
  var file = new Blob([text], { type: type });
  downloadFile(file, name);
  resetHasUnsavedChanges();
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
};
