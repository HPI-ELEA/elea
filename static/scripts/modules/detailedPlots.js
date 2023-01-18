function initiatePlots() {
  console.log("new Script is running");
  drawPlot1();
  drawPlot2();
}

function drawPlot1() {
  run1 = [
    2, 2, 2, 4, 6, 6, 7, 8, 8, 9, 10, 10, 12, 13, 13, 13, 14, 14, 14, 15, 15,
    15, 15, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19,
    19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20,
  ];
  run2 = [
    3, 3, 3, 6, 7, 7, 7, 8, 9, 9, 11, 11, 11, 11, 12, 12, 12, 13, 14, 15, 15,
    15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18,
    19, 19, 19, 19, 20,
  ];

  let dataset1 = {
    label: "Dataset" + 1,
    type: "line",
    backgroundColor: "#000000",
    borderColor: "#000000",
    data: run1,
  };
  let dataset2 = {
    label: "Dataset" + 2,
    type: "line",
    backgroundColor: "#0000FF",
    borderColor: "#0000FF",
    data: run2,
  };
  let data = {
    labels: [...Array(run1.length).keys()],
    datasets: [dataset1, dataset2],
  };

  const config = {
    //every plot starts as a scatterplot to place the datapoints on the canvas. The actual representation is later specified in each dataset.
    type: "line",
    data: data,
    options: {
      scales: {
        x: {
          beginAtZero: false,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "fitness",
        },
        legend: {
          position: "top",
          maxHeight: 60,
          textDirection: "ltr",
        },
      },
    },
  };
  var ctx1 = document.getElementById("plot-1-area").getContext("2d");
  var plot1 = new Chart(ctx1, config);
}

function drawPlot2() {
  run3 = [
    2, 3, 3, 5, 5, 8, 8, 8, 8, 9, 9, 10, 12, 12, 12, 12, 13, 13, 13, 13, 14, 15,
    15, 15, 15, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18,
    18, 18, 19, 19, 19, 20,
  ];
  run4 = [
    2, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 10, 10, 11, 12, 13, 13, 13,
    14, 15, 15, 15, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 17, 18, 18, 18, 18,
    18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20,
  ];
  let dataset1 = {
    label: "Dataset" + 1,
    type: "scatter",
    backgroundColor: "#000000",
    borderColor: "#000000",
    data: run3,
  };
  let dataset2 = {
    label: "Dataset" + 2,
    type: "scatter",
    backgroundColor: "#0000FF",
    borderColor: "#0000FF",
    data: run3,
  };
  let data = {
    labels: [...Array(run1.length).keys()],
    datasets: [dataset1, dataset2],
  };

  const config = {
    //every plot starts as a scatterplot to place the datapoints on the canvas. The actual representation is later specified in each dataset.
    type: "scatter",
    data: data,
    options: {
      scales: {
        x: {
          beginAtZero: false,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "test",
        },
        legend: {
          position: "top",
          maxHeight: 60,
          textDirection: "ltr",
        },
      },
    },
  };
  var ctx1 = document.getElementById("plot-2-area").getContext("2d");
  var plot2 = new Chart(ctx1, config);
}

initiatePlots();
