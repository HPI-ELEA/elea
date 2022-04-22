class CSVHandler {
  constructor() {
    this.csvMap = new Map();
  }
  //the data forwarded contains a single object of type {value,datasetname,filename}
  //because of the message handling this object is the first element of the data-array
  //forward the data to the correct CSVWorker or create one if necessary
  updateValue(data) {
    let filename = data.filename;
    let requestedCSV = this.csvMap.get(filename);
    if (!requestedCSV) {
      console.log("created new worker " + filename);
      requestedCSV = new CSVWorker(filename);
      this.csvMap.set(filename, requestedCSV);
    }
    requestedCSV.updateValue(data);
  }

  downloadCSV() {
    this.csvMap.forEach((value) => value.downloadCSV());
  }

  clearCSV() {
    this.csvMap = new Map();
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

  downloadCSV() {
    this.iteration++;

    let csvContent = "";
    if (globalThis.window) csvContent += "data:text/csv;charset=utf-8,";
    csvContent += this.labels.join(";");
    csvContent += "\n";

    let maxColumnLength = Math.max(
      ...this.labels.map((l) => this.csvData.get(l).data.length)
    );
    let columns = [];
    for (let i = 0; i < maxColumnLength; ++i) {
      let row = [];
      for (const lab of this.labels) {
        let data = this.csvData.get(lab).data;
        if (data.length > i) row.push(data[i]);
        else row.push("");
      }
      columns.push(row.join(";"));
    }
    csvContent += columns.join("\n");
    downloadFile(csvContent, this.filename + ".csv");
  }
}

function downloadFile(content, filename) {
  if (!globalThis.window) {
    //eslint-disable-next-line no-undef -- is imported in nodejs env
    fs.writeFile(filename, content, "utf8", function (e) {
      if (e) return console.error(e);
      console.log("Generated " + filename);
    });
  } else {
    let encodedUri = encodeURI(content);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  }
}

var csvHandler = new CSVHandler();

function updateValue(data) {
  csvHandler.updateValue(data);
}

function downloadCSV() {
  csvHandler.downloadCSV();
}

function clearCSV() {
  csvHandler.clearCSV();
}

export { updateValue, downloadCSV, clearCSV };
