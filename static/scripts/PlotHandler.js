import { addNewPlotEntry } from "./workspace";

class PlotHandler {
    constructor() {
        this.plotMap = new Map();
    }
    //the data forwarded contains the information: data(yValue,datasetName,plotName,plotType)
    //forward the data to the correct PlotWorker or create one if necessary 
    updateValue(data) {
        let plotName = data[3];
        let requestedPlot = this.plotMap.get(plotName);
        if (requestedPlot == undefined) {
            requestedPlot = new PlotWorker(plotName, data[4]);
            this.plotMap.set(plotName, requestedPlot);
        }
        requestedPlot.updateValue(data);
    }

    drawPlots() {
        this.plotMap.forEach((value) => value.drawPlot());
    }

    clearPlots() {
        this.plotMap = new Map();
    }
}

class PlotWorker {
    constructor(name, plotType) {
        this.plotName = name;
        this.plotData = new Map();
        this.plotType = plotType;
        let canvasNumber = addNewPlotEntry(name);
        let canvasID = 'plot-' + canvasNumber + '-canvas';
        this.chartArea = document.getElementById(canvasID).getContext('2d');
        this.myChart = null;
        this.chartExists = false;
        this.labels = [];
        this.iteration = 0;
    }

    //collect data during runtime 
    updateValue(data) {
        let datasetName = data[2];
        if (this.iteration > 0) {
            // new runs produce new datasets which can be distinguished by their ending 
            datasetName += "_" + this.iteration;
        }
        let dataset = this.plotData.get(datasetName);
        if (dataset == undefined) {
            dataset = {
                label: 'Dataset' + datasetName,
                backgroundColor: random_rgba(),
                data: [data[1]],
            }
            this.plotData.set(datasetName, dataset);
            this.labels.push(1);
        } else {
            dataset.data.push(data[1]);
            if (dataset.data.length > this.labels.length) {
                this.labels.push(dataset.data.length);
            }
        }
    }

    drawPlot() {
        this.iteration++;
        if (!this.chartExists) {

            let testplotData = {
                labels: this.labels,
                datasets: Array.from(this.plotData.values()),
            };
            const config = {
                type: this.plotType,
                data: testplotData,
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: this.plotName
                        }
                    },
                },
            };

            this.myChart = new Chart(//eslint-disable-line no-undef -- is defined in block code
                this.chartArea,
                config
            );
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

//use a random color for every dataset for now 
// after the PR for the new color scheme is completed, the plots colors will be based on that
function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
}

export { updateValue, drawPlots, clearPlots }; 