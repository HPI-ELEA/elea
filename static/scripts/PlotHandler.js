import { addNewDeletableOutputEntry } from "./workspace";

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
        "Use the CSV-Generation to create your own CSV files which can then be plotted with R"
      );
    } else {
      this.plotMap.forEach((value) => value.drawPlot());
    }
  }

  clearPlots() {
    this.plotMap = new Map();
  }

  removePlot(plotName) {
    this.plotMap.delete(plotName);
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
    if (globalThis.window) {
      let divString = `<canvas id="plot-${name}"></canvas>`;
      addNewDeletableOutputEntry(divString, name, name, () =>
        this.plotHandler.removePlot(this.plotName)
      );
      let canvasID = "plot-" + name;
      this.chartArea = document.getElementById(canvasID).getContext("2d");
    }
  }

  //collect data during runtime
  updateValue(data) {
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

  clearPlot() {}

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

export { updateValue, drawPlots, clearPlots };
