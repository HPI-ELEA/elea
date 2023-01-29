import * as Blockly from "blockly";
import { resetHasUnsavedChangesHandling } from "./unsavedChangesHandling";
import { workspace, getCode } from "./blocklyHandling";
import {
  saveFileBrowser as saveFile,
  copyToClipboard,
  readFile,
} from "./fileUtils";
import JSZip from "../jszip";

function copyXMLToClipboard() {
  var xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
  copyToClipboard(xml);
  resetHasUnsavedChangesHandling();
}

function download(text, name, type) {
  var file = new Blob([text], { type: type });
  saveFile(file, name);
  resetHasUnsavedChangesHandling();
}

function downloadWorkspace() {
  var xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
  download(xml, "algorithm.xml", "text/xml");
}

async function downloadWorkspaceAsJS() {
  // Read needed files for the project and prepare the files if necessary
  let algorithm = await prepareAlgorithm();
  let messageHandler = await prepareMessageHandler();
  let csvHandler = prepareCSVHandler();
  let readme = await readFile("./export/README.md");
  let main = await readFile("./export/main.mjs");
  let logging = await prepareIOHAnalyzerHandler();
  let jszip = await readFile("./scripts/jszip.js");
  let fileutils = await prepareFileUtils();
  let plotHandler = await preparePlotting();
  // Check if everything worked out
  if (
    ![
      algorithm,
      messageHandler,
      csvHandler,
      readme,
      main,
      logging,
      plotHandler,
    ].every((f) => f != false)
  ) {
    alert("Something went wrong, please try again.");
    return;
  }
  // Zip and download the files
  let zip = new JSZip();
  zip.file("algorithm.js", algorithm);
  zip.file("MessageHandler.js", messageHandler);
  zip.file("CSVHandler.mjs", csvHandler);
  zip.file("README.md", readme);
  zip.file("main.mjs", main);
  zip.file("modules/IOHAnalyzerHandler.mjs", logging);
  zip.file("jszip.js", jszip);
  zip.file("PlotHandler.mjs", plotHandler);
  zip.folder("modules");
  zip.file("modules/fileUtils.mjs", fileutils);
  let zipFile = await zip.generateAsync({ type: "blob" });
  saveFile(zipFile, "elea.zip");
}

async function prepareMessageHandler() {
  // Add import statements for thread API
  // Add message handling of the current thread
  // Add export statement of the module
  let file;
  if (!(file = await readFile("./scripts/MessageHandler.js"))) return false;
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
    ` saveInCSV,\n` +
    ` plot,\n` +
    ` Handler,\n` +
    ` RecvRequest,\n` +
    `};`;
  return code;
}

function prepareAlgorithm() {
  // Add import statements for thread handling and needed functions from the MessageHandler
  // Setting the parent port to forward messages to the main thread
  let setup =
    `const {parentPort, Worker} = require("worker_threads");\n` +
    `const {Handler, consolelog, saveInCSV, plot, consoleerror, Message, RecvRequest} = require("./MessageHandler.js");\n` +
    `const {cpus} = require("os");\n` +
    `Handler.setParentPort(parentPort);\n`;

  let js = getCode();
  // remove "var" and add globalThis to the big variable declaration
  // at the beginning of the file
  let varDeclaration = js
    .split("\n")
    .shift()
    .replace("var", "")
    .replace(";", "")
    .split(" ")
    .join(" globalThis.");
  js = js.split("\n");
  js.shift();
  js = js.join("\n");
  let tmp = setup + varDeclaration + "\n" + js;
  return tmp;
}

async function prepareCSVHandler() {
  let file, code;
  if (!(file = await readFile("./scripts/CSVHandler.js"))) return false;
  // remove importstatement of workspace.js
  code = removeFirstLine(file);
  // rename fileUtils to fileUtils.mjs
  code = code.replace("/fileUtils", "/fileUtils.mjs");
  return code;
}

async function prepareFileUtils() {
  // Import fs for the node env
  let file;
  if (!(file = await readFile("./scripts/modules/fileUtils.js"))) return false;
  let code = `import fs from "fs";\n`;
  code += file;
  return code;
}

async function prepareIOHAnalyzerHandler() {
  let file, code;
  if (!(file = await readFile("./scripts/modules/IOHAnalyzerHandler.js")))
    return false;
  file = removeFirstLine(file);
  // rename fileUtils to fileUtils.mjs
  code = file.replace("/fileUtils", "/fileUtils.mjs");
  return code;
}

async function preparePlotting() {
  let file, code;
  if (!(file = await readFile("./scripts/PlotHandler.js"))) return false;
  file = removeFirstLine(file);
  // I will create a link to some helpfull starting points on how to plot with Python/R
  code =
    "//Plotting is currently only supported on the website. Use the CSV-generation to create CSV-files.";
  code += file;
  code = code.replace("/fileUtils", "/fileUtils.mjs");
  return code;
}

function removeFirstLine(file) {
  let lines = file.split("\n");
  lines.shift();
  return lines.join("\n");
}

export { downloadWorkspace, copyXMLToClipboard, downloadWorkspaceAsJS };
