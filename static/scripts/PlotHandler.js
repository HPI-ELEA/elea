import jquery from "jquery";
import { addNewOutputEntry } from "./workspace";
import $ from "jquery";

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
            requestedPlot = new PlotWorker(plotName);
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
    constructor(name) {
        this.plotName = name;
        this.plotData = new Map();
        this.myChart = null;
        this.chartExists = false;
        this.iteration = 0;
        let divString = `<canvas id="plot-${name}"></canvas>
        <button class="btn btn-outline-dark btn-block" 
        id="boxplot-${name}-button"> Generate Boxplot </button>`;
        addNewOutputEntry(
            divString,
            name,
            name
        );
        $(`#boxplot-${name}-button`).click(() => {
            this.generateBoxplot();
        });
        let canvasID = 'plot-' + name;
        this.chartArea = document.getElementById(canvasID).getContext('2d');
        this.boxplotWorker = null;
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
            let randomColor = random_rgba();
            dataset = {
                label: 'Dataset' + datasetName,
                type: data.plotType,
                backgroundColor: randomColor,
                borderColor: randomColor,
                data: [{ x: data.xValue, y: data.yValue }],
            }
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
                type: 'scatter',
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

    generateBoxplot() {
        console.log("Generating Boxplot");
        this.boxplotWorker = new BoxplotWorker(this.plotName);
        this.boxplotWorker.convertData(this.plotData);
        return;
    }
}

class BoxplotWorker {
    constructor(name) {
        this.plotData = new Map();
        this.myChart = null;
        this.chartExists = false;
        let divString = `<canvas id="boxplot-${name}"></canvas>`;
        addNewOutputEntry(
            divString,
            name + "-boxplot",
            name + "-boxplot"
        );
        let canvasID = 'boxplot-' + name;
        this.chartArea = document.getElementById(canvasID).getContext('2d');
    }

    convertData(data) {
        //Transforming the chartData to the format required by boxplot. 
        data.forEach(dataset => {
            dataset.data.forEach(datapoint => {
                let xPlace = this.plotData.get(datapoint.x); 
                if(!xPlace){
                    //haven't had a datapoint here yet
                    this.plotData.set(datapoint.x, [datapoint.y]); 
                }else{
                    // add yValue to the list: 
                    xPlace.push(datapoint.y); 
                }
            }
            );
        });
        this.drawChart(); 
    }

    drawChart(){
        let chartData = Array.from(this.plotData.values()); 
        let N = this.plotData.size; 
        let labels = Array.from(Array(N).keys());
        const boxplotData = {
            // define label tree
            labels: labels,
            datasets: [{
              label: 'Dataset 1',
              backgroundColor: 'rgba(255,0,0,0.5)',
              borderColor: 'red',
              borderWidth: 1,
              outlierColor: '#999999',
              padding: 10,
              itemRadius: 0,
              data: chartData,
            },]
          };
          
          this.myChart = new Chart(this.chartArea, {
              type: 'boxplot',
              data: boxplotData,
              options: {
                responsive: true,
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Chart.js Box Plot Chart'
                }
              }
            });
            console.log("Chart created"); 
        return; 
    }
}
function randomValues(count, min, max) {
    const delta = max - min;
    return Array.from({length: count}).map(() => Math.random() * delta + min);
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