import { addNewOutputEntry } from "./workspace";
import { saveFileBrowser, saveFileNode } from "./modules/fileUtils";
import JSZip from "./jszip.js";

class CSVHandler {
  constructor() {
    this.csvMap = new Map();
  }
  //the data forwarded contains a single object of type {value,datasetname,filename}
  //because of the message handling this object is the first element of the data-array
  //forward the data to the correct CSVWorker or create one if necessary
  updateValue(data) {
    if (!this.print) {
      if (!globalThis.window) {
        //node env
        this.print = (msg) => console.log(msg);
      } else {
        // Browser env
        let output = addNewOutputEntry(
          '<pre id="csv-print-area" class="print-area"></pre>',
          "csv-print-area",
          "CSV Log"
        );
        this.print = (msg) => (output.innerHTML += msg + "\n");
      }
    }

    let filename = data.filename;
    let requestedCSV = this.csvMap.get(filename);
    if (!requestedCSV) {
      console.log("created new worker " + filename);
      requestedCSV = new CSVWorker(filename);
      this.csvMap.set(filename, requestedCSV);
    }
    requestedCSV.updateValue(data);
  }

  async download() {
    let zip = JSZip();
    this.csvMap.forEach((value) => value.downloadCSV(zip));
    await downloadZIP(zip, "elea.zip");
  }

  clear() {
    this.csvMap = new Map();
  }

  printDoneMessage() {
    if (!this.print) return;
    this.csvMap.forEach((_, key) =>
      this.print("CSV file " + key + " generated\n")
    );
    this.print("You can download the files at 'Save/Restore Algorithm'");
  }

  hasEntries() {
    return this.csvMap.size != 0;
  }
}

class CSVWorker {
  constructor(name) {
    this.filename = name;
    this.csvData = new Map();
    this.iteration = 0;
    this.labels = [];
  }

  //collect data during runtime
  updateValue(data) {
    let datasetName = data.datasetname;
    if (this.iteration > 0) {
      // new runs produce new datasets which can be distinguished by their ending
      datasetName += "_" + this.iteration;
    }
    let dataset = this.csvData.get(datasetName);
    if (!dataset) {
      dataset = {
        label: "Dataset" + datasetName,
        data: [data.value],
      };
      this.csvData.set(datasetName, dataset);
      this.labels.push(datasetName);
    } else {
      this.csvData.get(datasetName).data.push(data.value);
    }
  }

  downloadCSV(zip) {
    this.iteration++;

    let heading = this.labels.join(";") + "\n";

    // max number of datapoints in all datasets
    let maxColumnLength = Math.max(
      ...this.labels.map((l) => this.csvData.get(l).data.length)
    );
    let rows = [];
    for (let i = 0; i < maxColumnLength; ++i) {
      let column = [];
      for (const lab of this.labels) {
        // create a single row with one datapoint from each dataset
        // if a dataset is empty, add an empty string
        let data = this.csvData.get(lab).data;
        if (data.length > i) column.push(data[i]);
        else column.push("");
      }
      rows.push(column.join(";"));
    }
    let csvContent = heading + rows.join("\n");
    zip.file(this.filename + ".csv", csvContent);
  }
}

async function downloadZIP(zip) {
  if (!globalThis.window) {
    // Nodejs environment
    zip.generateAsync({ type: "nodebuffer" }).then(function (content) {
      saveFileNode(content, "elea-csv.zip");
    });
  } else {
    // Browser environment
    let file = await zip.generateAsync({ type: "blob" });
    saveFileBrowser(file, "elea-csv.zip");
  }
}

var csvHandler = new CSVHandler();

function updateValueCSV(data) {
  csvHandler.updateValue(data);
}

function downloadCSV() {
  csvHandler.download();
}

function clearCSV() {
  csvHandler.clear();
}

function printDoneMessageCSV() {
  csvHandler.printDoneMessage();
}

function hasEntriesCSV() {
  return csvHandler.hasEntries();
}

export {
  updateValueCSV,
  downloadCSV,
  clearCSV,
  printDoneMessageCSV,
  hasEntriesCSV,
};
