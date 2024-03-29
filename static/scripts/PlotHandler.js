import { addNewDeletableOutputEntry } from "./workspace";
import JSZip from "./jszip.js";
import { downloadZIP, readFile } from "./modules/fileUtils";

class PlotHandler {
  constructor() {
    this.plotMap = new Map();
  }
  //the data forwarded contains a single object of type {xValue,yValue,datasetNumber,plotName,plotType}
  //forward the data to the correct PlotWorker or create one if necessary
  updateValue(data) {
    let plotName = data.plotName;
    let requestedPlot = this.plotMap.get(plotName);
    if (!requestedPlot) {
      requestedPlot = new PlotWorker(plotName, this);
      this.plotMap.set(plotName, requestedPlot);
    }
    requestedPlot.updateValue(data);
  }

  drawPlots() {
    if (!globalThis.window) {
      console.log("plotting is currently only available on the website.");
      console.log(
        "Use the CSV-Generation to create your own CSV files which can then be plotted with R, python or another tool of your choice."
      );
    } else {
      this.plotMap.forEach((value) => value.drawPlot());
    }
  }

  clearPlots() {
    this.plotMap = new Map();
  }

  async downloadPlotDataAsCSV() {
    let zip = JSZip();
    let readme = await readFile("./export/CSV_README.md");
    zip.file("README.md", readme);
    this.plotMap.forEach((value) => value.getPlotDataAsCSV(zip));
    await downloadZIP(zip, "elea_plots.zip");
  }

  async downloadSinglePlotAsCSV(plotName) {
    let zip = JSZip();
    let readme = await readFile("./export/CSV_README.md");
    zip.file("README.md", readme);
    var plot = this.plotMap.get(plotName);
    plot.getPlotDataAsCSV(zip);
    await downloadZIP(zip, plotName + "_plot.zip");
  }

  hasPlotEntries() {
    return this.plotMap.size != 0;
  }

  removePlot(plotName) {
    this.plotMap.delete(plotName);
  }

  getPlotAsPng(plotName) {
    var plot = this.plotMap.get(plotName);
    plot.getPlotAsPng();
  }

  openPlotInModal(plotName) {
    this.plotMap.forEach((plot) => plot.clearDetailedPlot());
    var plot = this.plotMap.get(plotName);
    plot.openPlotInModal();
  }

  showAverage(plotName) {
    var plot = this.plotMap.get(plotName);
    plot.showAverage();
  }
}

class PlotWorker {
  constructor(name, plotHandler) {
    this.plotName = name;
    this.plotHandler = plotHandler;
    this.plotData = new Map();
    this.myChart = null;
    this.chartExists = false;
    this.iteration = 0;
    this.isSingleInput = true;
    this.detailedPlot = null;
    if (globalThis.window) {
      let divString = `<canvas id="plot-${name}"></canvas>`;
      addNewDeletableOutputEntry(
        divString,
        name,
        name,
        () => this.plotHandler.removePlot(this.plotName), // delete operation
        [
          {
            name: "download-img",
            operation: () => this.plotHandler.getPlotAsPng(this.plotName),
            text: "Download Image",
          },
          {
            name: "download-csv",
            operation: () =>
              this.plotHandler.downloadSinglePlotAsCSV(this.plotName),
            text: "Download CSV",
          },
        ],
        () => this.plotHandler.openPlotInModal(this.plotName), // details operation
        [
          {
            name: "add-avg-line",
            operation: () => this.plotHandler.showAverage(this.plotName),
            text: "Show Average",
          },
        ]
      );
      let canvasID = "plot-" + name;
      this.chartArea = document.getElementById(canvasID).getContext("2d");
    }
  }

  //collect data during runtime
  updateValue(data) {
    if (data.xValue != null) {
      this.isSingleInput = false;
    }
    let datasetName = data.datasetNumber;
    if (this.iteration > 0) {
      // new runs produce new datasets which can be distinguished by their ending
      datasetName += "_" + this.iteration;
    }
    let dataset = this.plotData.get(datasetName);
    if (!dataset) {
      //generate new dataset
      if (data.xValue == null) {
        data.xValue = 0;
      }
      let randomColor = randomRGBA();
      dataset = {
        label: "Dataset" + datasetName,
        type: data.plotType,
        backgroundColor: randomColor,
        borderColor: randomColor,
        data: [{ x: data.xValue, y: data.yValue }],
      };
      this.plotData.set(datasetName, dataset);
    } else {
      //add datapoint to existing dataset
      if (data.xValue == null) {
        data.xValue = dataset.data.length;
      }
      dataset.data.push({ x: data.xValue, y: data.yValue });
    }
  }

  drawPlot() {
    this.iteration++;
    if (!this.chartExists) {
      let testplotData = {
        datasets: Array.from(this.plotData.values()),
      };
      const config = {
        //every plot starts as a scatterplot to place the datapoints on the canvas. The actual representation is later specified in each dataset.
        type: "scatter",
        data: testplotData,
        options: {
          scales: {
            x: {
              beginAtZero: false,
            },
          },
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: this.plotName,
            },
            legend: {
              position: "top",
              maxHeight: 30,
              textDirection: "ltr",
            },
            tooltip: {
              enabled: false,
            },
          },
        },
      };

      this.myChart = new Chart(this.chartArea, config); //eslint-disable-line no-undef -- is defined in block code
      this.chartExists = true;
    } else {
      this.myChart.data.datasets = Array.from(this.plotData.values());
      this.myChart.update();
    }
    return;
  }

  getPlotDataAsCSV(zip) {
    let csvContent = "";
    if (this.isSingleInput) {
      csvContent += tranformSingleInputToCSV(this.plotData);
    } else {
      csvContent += tranformDoubleInputToCSV(this.plotData);
    }
    zip.file(this.plotName + ".csv", csvContent);
  }

  getPlotAsPng() {
    var image = this.myChart.toBase64Image();
    var a = document.createElement("a");
    a.href = image;
    a.download = this.plotName + ".png";
    a.click();
  }

  openPlotInModal() {
    var modal = document.getElementById("plotModal");
    modal.style.display = "block";
    var ctx = document.getElementById("detailedPlotCanvas").getContext("2d");
    this.detailedPlot = new Chart(ctx, this.myChart.config); //eslint-disable-line no-undef -- is defined in block code
    return;
  }

  //Allow other plots to use the canvas
  clearDetailedPlot() {
    if (this.detailedPlot) {
      this.detailedPlot.destroy();
    }
  }

  showAverage() {
    // Calculate the new dataset
    let avgList = [];
    if (this.isSingleInput) {
      avgList = getSingleInputAverage(this.plotData);
    } else {
      avgList = getDoubleInputAverage(this.plotData);
    }
    // Add the new dataset
    let avgDataset = {
      label: "Average",
      backgroundColor: "rgba(255,0,0,1)",
      borderColor: "rgba(255,0,0,1)",
      data: avgList,
    };

    // Make all other Datasets opaque
    this.myChart.data.datasets.map((dataset) => {
      let color = dataset.backgroundColor;
      color = color.replace(/[\d.]+\)$/g, "0.15)");
      dataset.backgroundColor = color;
      dataset.borderColor = color;
    });
    this.myChart.data.datasets.push(avgDataset);
    this.myChart.update();
    return;
  }
}

function getSingleInputAverage(plotData) {
  let avgList = [];
  let datasets = Array.from(plotData.values());
  let maxColumnLength = Math.max(
    ...datasets.map((dataset) => dataset.data.length)
  );
  // iterate over every step
  for (let i = 0; i < maxColumnLength; i++) {
    let sum = 0;
    let entries = 0;
    datasets.map((dataset) => {
      let data = dataset.data;
      if (data.length > i) {
        sum += data[i].y;
        entries++;
      }
    });
    avgList.push({ x: i, y: sum / entries });
  }
  return avgList;
}

function getDoubleInputAverage(plotData) {
  let allDatasets = Array.from(plotData.values());
  let allData = allDatasets.flatMap((dataset) => dataset.data);

  let averages = Object.values(
    allData.flat().reduce((acc, dataset) => {
      const { x, y } = dataset;
      if (!acc[x]) {
        acc[x] = { sum: 0, count: 0, x: x };
      }
      acc[x].sum += y;
      acc[x].count++;
      return acc;
    }, {})
  ).map(({ sum, count, x }) => ({ x: x, y: sum / count }));
  return averages;
}

function tranformSingleInputToCSV(plotData) {
  let datasets = Array.from(plotData.values());
  let labels = [];
  labels = datasets.map((dataset) => dataset.label);
  let heading = labels.join(";") + "\n";
  let maxColumnLength = Math.max(
    ...datasets.map((dataset) => dataset.data.length)
  );
  let rows = [];
  for (let i = 0; i < maxColumnLength; ++i) {
    let column = [];
    datasets.map((dataset) => {
      let data = dataset.data;
      if (data.length > i) column.push(data[i].y);
      else column.push("");
    });
    rows.push(column.join(";"));
  }
  let csvContent = heading + rows.join("\n");
  return csvContent;
}

function tranformDoubleInputToCSV(plotData) {
  // CSVformat: dataset1_x;dataset1_y;dataset2_x;dataset2_y;...;datasetn_x;datasetn_y
  let datasets = Array.from(plotData.values());
  let labels = [];
  plotData.forEach((dataset) => {
    labels.push(dataset.label + "_x");
    labels.push(dataset.label + "_y");
  });
  let heading = labels.join(";") + "\n";
  let maxColumnLength = Math.max(
    ...datasets.map((dataset) => dataset.data.length)
  );
  let rows = [];
  for (let i = 0; i < maxColumnLength; ++i) {
    let column = [];
    plotData.forEach((dataset) => {
      let data = dataset.data;
      if (data.length > i) {
        column.push(data[i].x);
        column.push(data[i].y);
      } else {
        column.push("");
        column.push("");
      }
    });
    rows.push(column.join(";"));
  }
  let csvContent = heading + rows.join("\n");
  return csvContent;
}

var plotHandler = new PlotHandler();

function updateValue(data) {
  plotHandler.updateValue(data);
}

function drawPlots() {
  plotHandler.drawPlots();
}

function clearPlots() {
  plotHandler.clearPlots();
}

function downloadPlotsAsCSV() {
  plotHandler.downloadPlotDataAsCSV();
}

function hasPlotEntries() {
  return plotHandler.hasPlotEntries();
}

//use a random color for every dataset and make sure its bright enough
function randomRGBA() {
  var o = Math.round,
    r = Math.random;
  return (
    "rgba(" +
    o(r() * 200 + 55) +
    "," +
    o(r() * 200 + 55) +
    "," +
    o(r() * 200 + 55) +
    "," +
    1 +
    ")"
  );
}

export {
  updateValue,
  drawPlots,
  clearPlots,
  hasPlotEntries,
  downloadPlotsAsCSV,
};
