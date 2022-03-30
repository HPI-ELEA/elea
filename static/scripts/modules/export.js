import * as Blockly from "blockly";
import { resetHasUnsavedChangesHandling } from "./unsavedChangesHandling";
import { workspace, getCode } from "./blocklyHandling";
import { logDB } from "./logging";
import { downloadFile, copyToClipboard } from "./fileUtils";
import JSZip from "../jszip";

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

async function downloadWorkspaceAsJS() {
  let algorithm = await prepare_algorithm();
  let message_handler = await prepare_messagerhandler();
  let readme = await read_file("./export/README.md");
  let main = await read_file("./export/main.mjs");
  let logging = await read_file("./scripts/modules/logging.mjs");
  if (
    ![algorithm, message_handler, readme, main, logging].every(
      (f) => f != false
    )
  ) {
    alert("Something went wrong, please try again.");
    return;
  }
  let zip = new JSZip();
  zip.file("algorithm.js", algorithm);
  zip.file("MessageHandler.js", message_handler);
  zip.file("README.md", readme);
  zip.file("main.mjs", main);
  zip.file("logging.mjs", logging);
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
    ` Handler,\n` +
    ` RecvRequest,\n` +
    `};`;
  return code;
}

function prepare_algorithm() {
  let setup =
    `const {parentPort, Worker} = require("worker_threads");\n` +
    `const {Handler, consolelog, consoleerror, Message, RecvRequest} = require("./MessageHandler.js");\n` +
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

async function read_file(path) {
  let response = await fetch(path);
  if (!response.ok) return false;
  return await response.text();
}

// parse the logs for a specific algorithm, and create the meta and data files in the zip
function zipAlgorithm(zip, db, algorithm) {
  // Creating each function
  for (const fn in db) {
    const fnDB = db[fn];

    /////////////////////////////
    // CREATING THE META FILE  //
    /////////////////////////////
    zip.folder(algorithm + "/data_f" + fn + "");
    let contents = "";
    for (const dim in fnDB) {
      const dimDB = fnDB[dim];

      contents +=
        "suite = 'elea', funcId = " +
        fn +
        ", DIM = " +
        dim +
        ", algId = '" +
        algorithm +
        "'\n";
      contents += "%\n";
      contents += "data_f" + fn + "/IOHprofiler_f" + fn + "_DIM" + dim + ".dat";

      // adding the meta-info for each run in each data file
      for (const run in dimDB) {
        const runDB = dimDB[run];
        contents +=
          ", 1:" + runDB.budget + "|" + runDB[runDB.length - 1].fitness;
      }
      contents += "\n";

      /////////////////////////////////////////
      // CREATING THE DATA FILE FOR EACH DIM //
      /////////////////////////////////////////
      const header = '"function evaluation" "best-so-far f(x)"\n';
      let contentsData = "";
      for (const run in dimDB) {
        contentsData += header;

        // we can't use 'for (const in ...' because the run object also contains a budget field
        for (let i = 0; i < dimDB[run].length; i++) {
          const element = dimDB[run][i];
          contentsData += element.evaluation + " " + element.fitness + "\n";
        }
      }
      zip.file(
        algorithm +
          "/data_f" +
          fn +
          "/IOHprofiler_f" +
          fn +
          "_DIM" +
          dim +
          ".dat",
        contentsData
      );
      /////////////////////////////////////////
      /////////////////////////////////////////
    }

    zip.file(algorithm + "/IOHprofiler_f" + fn + ".info", contents);
  }
}

// compile the zip file and give it to the user as a download
async function downloadLog() {
  console.warn("creating zip archive in IOHprofiler format");
  var zip = JSZip();
  zip.file("raw.json", JSON.stringify(logDB));

  for (const algorithm in logDB) {
    zip.folder(algorithm);
    zipAlgorithm(zip, logDB[algorithm], algorithm);
  }

  let file = await zip.generateAsync({ type: "blob" });
  downloadFile(file, "log.zip");
}

export {
  downloadWorkspace,
  copyXMLToClipboard,
  downloadWorkspaceAsJS,
  copyJSToClipboard,
  downloadFile,
  downloadLog,
};
