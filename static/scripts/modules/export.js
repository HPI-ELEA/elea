import * as Blockly from "blockly";
import { resetHasUnsavedChangesHandling } from "./unsavedChangesHandling";
import { workspace, getCode } from "./blocklyHandling";
import { logDB } from "./logging";
import { downloadFile, copyToClipboard, readFile } from "./fileUtils";
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
  // Read needed files for the project and prepare the files if necessary
  let algorithm = await prepare_algorithm();
  let message_handler = await prepare_messagerhandler();
  let csv_handler = await prepare_csvhandler();
  let readme = await readFile("./export/README.md");
  let main = await readFile("./export/main.mjs");
  let logging = await readFile("./scripts/modules/logging.js");
  let jszip = await readFile("./scripts/jszip.js");
  let fileutils = await readFile("./scripts/modules/fileUtils.js");
  // Check if everything worked out
  if (
    ![algorithm, message_handler, csv_handler, readme, main, logging].every(
      (f) => f != false
    )
  ) {
    alert("Something went wrong, please try again.");
    return;
  }
  // Zip and download the files
  let zip = new JSZip();
  zip.file("algorithm.js", algorithm);
  zip.file("MessageHandler.js", message_handler);
  zip.file("CSVHandler.mjs", csv_handler);
  zip.file("README.md", readme);
  zip.file("main.mjs", main);
  zip.file("logging.mjs", logging);
  zip.file("jszip.js", jszip);
  zip.folder("modules");
  zip.file("modules/fileUtils.js", fileutils);
  let zip_file = await zip.generateAsync({ type: "blob" });
  downloadFile(zip_file, "elea.zip");
}

async function prepare_messagerhandler() {
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
    ` save_in_csv,\n` +
    ` Handler,\n` +
    ` RecvRequest,\n` +
    `};`;
  return code;
}

function prepare_algorithm() {
  // Add import statements for thread handling and needed functions from the MessageHandler
  // Setting the parent port to forward messages to the main thread
  let setup =
    `const {parentPort, Worker} = require("worker_threads");\n` +
    `const {Handler, consolelog, save_in_csv, consoleerror, Message, RecvRequest} = require("./MessageHandler.js");\n` +
    `const {cpus} = require("os");\n` +
    `Handler.setParentPort(parentPort);\n`;

  let js = getCode();
  // remove "var" and add globalThis to the big variable declaration
  // at the beginning of the file
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
  // Import fs for the node env
  let file;
  if (!(file = await readFile("./scripts/CSVHandler.js"))) return false;
  let code = `import fs from "fs";\n`;
  code += file;
  return code;
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
  downloadFile,
  downloadLog,
};
