import { saveFileBrowser as saveFile } from "./fileUtils";
import JSZip from "../jszip.js";

var logDB = {};

// clear the database
function clearLog() {
  logDB = {};
}

// parse the log from the the worker threads and save the results into the database
function handleLogFromWorker(log) {
  if (!logDB[log.algorithm]) logDB[log.algorithm] = {};

  if (!logDB[log.algorithm][log.function])
    logDB[log.algorithm][log.function] = {};

  if (!logDB[log.algorithm][log.function][log.dimension])
    logDB[log.algorithm][log.function][log.dimension] = {};

  if (!logDB[log.algorithm][log.function][log.dimension][log.run])
    logDB[log.algorithm][log.function][log.dimension][log.run] = new Array();

  logDB[log.algorithm][log.function][log.dimension][log.run]["budget"] =
    log.budget;

  for (let i = 0; i < log.length; i++) {
    logDB[log.algorithm][log.function][log.dimension][log.run].push({
      evaluation: log[i].evaluation,
      fitness: log[i].fitness,
    });
  }
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

  let FILE_NAME = "log.zip";
  if (!globalThis.window) {
    zip.generateAsync({ type: "nodebuffer" }).then(function (content) {
      //eslint-disable-next-line no-undef -- is imported in nodejs env
      fs.writeFile(FILE_NAME, content, function (e) {
        if (e) return console.error(e);
      });
    });
  } else {
    let file = await zip.generateAsync({ type: "blob" });
    saveFile(file, FILE_NAME);
  }
}

export { clearLog, handleLogFromWorker, downloadLog };
