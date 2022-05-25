import * as Blockly from "blockly";
import { resetHasUnsavedChangesHandling } from "./unsavedChangesHandling";
import { workspace, getCode } from "./blocklyHandling";
import { downloadFile, copyToClipboard } from "./fileUtils";
import JSZip from "../jszip";

function copyXMLToClipboard() {
  var xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
  copyToClipboard(xml);
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

async function downloadWorkspaceAsJS() {
  let algorithm = await prepare_algorithm();
  let message_handler = await prepare_messagerhandler();
  let csv_handler = await prepare_csvhandler();
  let readme = await read_file("./export/README.md");
  let main = await read_file("./export/main.mjs");
  let logging = await read_file("./scripts/modules/logging.js");
  let jszip = await read_file("./scripts/jszip.js");
  if (
    ![algorithm, message_handler, csv_handler, readme, main, logging].every(
      (f) => f != false
    )
  ) {
    alert("Something went wrong, please try again.");
    return;
  }
  let zip = new JSZip();
  zip.file("algorithm.js", algorithm);
  zip.file("MessageHandler.js", message_handler);
  zip.file("CSVHandler.mjs", csv_handler);
  zip.file("README.md", readme);
  zip.file("main.mjs", main);
  zip.file("modules/logging.mjs", logging);
  zip.file("jszip.js", jszip);
  let zip_file = await zip.generateAsync({ type: "blob" });
  downloadFile(zip_file, "elea.zip");
}

async function prepare_messagerhandler() {
  let file;
  if (!(file = await read_file("./scripts/MessageHandler.js"))) return false;
  let code =
    `const { Worker, parentPort } = require("worker_threads");\n` +
    file +
    `// redirect messages from the parent to the message handler\n` +
    `// labels the source as having an ID of 0 - the parent's ID\n` +
    `parentPort.onmessage = function (msg) {\n` +
    `msg.data.source = Handler.PARENT_ID;\n` +
    `Handler.handleIncomingMessage(msg.data);\n` +
    `};\n` +
    `module.exports = {\n` +
    ` Message,\n` +
    ` MessageHandler,\n` +
    ` consolelog,\n` +
    ` consoleerror,\n` +
    ` save_in_csv,\n` +
    ` Handler,\n` +
    ` RecvRequest,\n` +
    `};`;
  return code;
}

function prepare_algorithm() {
  let setup =
    `const {parentPort, Worker} = require("worker_threads");\n` +
    `const {Handler, consolelog, save_in_csv, consoleerror, Message, RecvRequest} = require("./MessageHandler.js");\n` +
    `const {cpus} = require("os");\n` +
    `Handler.setParentPort(parentPort);\n`;

  let js = getCode();
  let var_declaration = js
    .split("\n")
    .shift()
    .replace("var", "")
    .replace(";", "")
    .split(" ")
    .join(" globalThis.");
  js = js.split("\n");
  js.shift();
  js = js.join("\n");
  let tmp = setup + var_declaration + "\n" + js;
  return tmp;
}

async function prepare_csvhandler() {
  let file;
  if (!(file = await read_file("./scripts/CSVHandler.js"))) return false;
  let code = `import fs from "fs";\n`;
  code += file;
  return code;
}

async function read_file(path) {
  let response = await fetch(path);
  if (!response.ok) return false;
  return await response.text();
}

export {
  downloadWorkspace,
  copyXMLToClipboard,
  downloadWorkspaceAsJS,
  downloadFile,
};
