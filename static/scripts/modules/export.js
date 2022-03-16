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

function downloadWorkspaceAsJS() {
  var js = getCode();
  download(js, "algorithm.js", "text/javascript");
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
