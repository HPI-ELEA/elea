var USING_THREADS = false;

import * as Blockly from "blockly";
import beautify from "js-beautify";
import { clearLog, handleLogFromWorker } from "./logging";
import "regenerator-runtime/runtime";
import "../normalBlockBehaviour";
import "../threadBlockBehaviour";
import { addPrintOutput } from "../workspace";
import { updateValue as updateValuePlot, drawPlots } from "../PlotHandler";
import { updateValue as updateValueCSV, printDoneMessage } from "../CSVHandler";
import { theme } from "./blockTheme";

// var jsonLog = null;
var worker = null;
var runButton = document.getElementById("run-button");

// restyle a block to use another style
function restyle(block, style) {
  var oldInit = block.init;
  block.init = function () {
    oldInit.call(this);
    this.setStyle(style);
  };
}

restyle(Blockly.Blocks["math_on_list"], "fitness_blocks");
restyle(Blockly.Blocks["lists_split"], "indiv_blocks");

// var pauseAtNewBlock = true;
var blocklyArea = document.getElementById("blockly-area");
var blocklyDiv = document.getElementById("blockly-div");
var workspace = Blockly.inject(blocklyDiv, {
  toolbox: document.getElementById("toolbox"),
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 2.5,
    minScale: 0.4,
    scaleSpeed: 1.05,
    pinch: true,
  },
  trashcan: true,
  theme: theme,
});
Blockly.Xml.domToWorkspace(document.getElementById("startBlocks"), workspace);
var onresize = function () {
  // Compute the absolute coordinates and dimensions of blocklyArea.
  var element = blocklyArea;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  // Position blocklyDiv over blocklyArea.
  blocklyDiv.style.left = x + "px";
  blocklyDiv.style.top = y + "px";
  blocklyDiv.style.width = blocklyArea.offsetWidth + "px";
  blocklyDiv.style.height = blocklyArea.offsetHeight + "px";
  Blockly.svgResize(workspace);
};
window.addEventListener("resize", onresize, false);
onresize();
Blockly.svgResize(workspace);

// Add variable creator buttons
workspace.registerButtonCallback("createIndividualButton", (button) => {
  Blockly.Variables.createVariableButtonHandler(
    button.getTargetWorkspace(),
    null,
    "Individual"
  );
});
workspace.registerButtonCallback("createPopulationButton", (button) => {
  Blockly.Variables.createVariableButtonHandler(
    button.getTargetWorkspace(),
    null,
    "Array"
  );
});
workspace.registerButtonCallback("createVariableButton", (button) => {
  Blockly.Variables.createVariableButtonHandler(
    button.getTargetWorkspace(),
    null,
    null
  );
});

// DO NOT CHANGE THIS BEFORE UNDERSTANDING THE BELOW INFO

// in order for multi-threading to work we need to add all of the function definitions to each thread,
// Blockly stores the code for all these definitions, however it adds the source code to an internal object
// in the order the objects are on the screen, this means that the threading blocks will only be able to see the
// definitions that have already been generated be other blocks before that specific thread block.
// To get around this we need to grab the definitions from the end of the previous generation and use those in
// the next one, therefore we need to generate the whole codebase at least twice before running the code.
// USING_THREADS is set to true when Blockly runs the generate code for multi-thread blocks
function getCode() {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  Blockly.JavaScript.STATEMENT_PREFIX = "";
  Blockly.JavaScript.addReservedWords("code");

  let code = Blockly.JavaScript.workspaceToCode(workspace);
  if (USING_THREADS) code = Blockly.JavaScript.workspaceToCode(workspace);
  USING_THREADS = false;
  /*eslint-disable-next-line camelcase -- arguments provided by beautify */
  code = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  return code;
}

// TODO: modify to terminate worker
//eslint-disable-next-line no-unused-vars -- is part of TODO
const onMessageFunctionForWorker =
  "self.onmessage = function (msg) {\
switch (msg.data.aTopic) {\
    case 'do_sendWorkerArrBuff':\
            sendWorkerArrBuff(msg.data.aBuf)\
        break;\
    default:\
        throw 'no aTopic on incoming message to ChromeWorker';\
}\
}";

function runCode() {
  clearLog();
  terminateWorker();
  Blockly.JavaScript.STATEMENT_PREFIX = "";
  //Blockly.JavaScript.addReservedWords('highlightBlock');
  Blockly.JavaScript.addReservedWords("jsonLogitem");
  Blockly.JavaScript.addReservedWords("jsonLog");
  Blockly.JavaScript.addReservedWords("jsonLogs");
  Blockly.JavaScript.addReservedWords("code");
  Blockly.JavaScript.addReservedWords("onMessage"); // TODO: or function?
  Blockly.JavaScript.addReservedWords("updateStats");
  Blockly.JavaScript.addReservedWords("main");
  Blockly.JavaScript.addReservedWords("_thread_id");
  Blockly.JavaScript.addReservedWords("Handler");

  var code = getCode();

  var dateSetup = "Date.prototype.nowAsString = function () {\n";
  dateSetup +=
    '    return + this.getFullYear() + (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + ((this.getDate() < 10)?"0":"") + this.getDate() + ((this.getHours() < 10)?"0":"") + this.getHours() + ((this.getMinutes() < 10)?"0":"") + this.getMinutes() + ((this.getSeconds() < 10)?"0":"") + this.getSeconds() + (((this.getMilliseconds()) < 100)?"0":"") + (((this.getMilliseconds()) < 10)?"0":"") + this.getMilliseconds();\n';
  dateSetup += "}\n";

  // import the message handler header
  let imports = "";
  imports +=
    "importScripts(('" +
    self.location +
    "').replace(/([^/]*$)/, '')+'scripts/MessageHandler.js');\n";
  imports += "_thread_id = null;\n";

  // code = imports + "function windowalert(x) {self.postMessage({output:x})};\n" + messageHandler + dateSetup + code termination//logSetup + code + logSave + termination // TODO? we don't really need it other than for abort
  code = imports + dateSetup + code;
  console.log(code);
  // TODO: find implementation for window.alert for both webworker and stepping
  const blob = new Blob([code], { type: "application/javascript" });
  worker = new Worker(URL.createObjectURL(blob));
  worker.addEventListener("message", handleMessageFromWorker);
  worker.addEventListener("error", function (error) {
    console.error(error);
    terminateWorker();
  });

  // indicate that the code is running
  runButton.style.backgroundColor = "LightGreen";
}

function handleMessageFromWorker(msg) {
  msg = msg.data;
  let outputArea = addPrintOutput();
  if (msg.ctrl == "print") {
    if (msg.source)
      outputArea.innerHTML +=
        "[Thread#" + msg.sources.join(".") + "] " + msg.data + "\n";
    else outputArea.innerHTML += msg.data + "\n";

    outputArea.scroll(0, outputArea.scrollHeight);
    return;
  }

  if (msg.ctrl == "log") {
    handleLogFromWorker(msg.data);
    return;
  }

  if (msg.ctrl == "plot") {
    updateValuePlot(msg.data);
    return;
  }

  if (msg.ctrl == "csv") {
    updateValueCSV(msg.data);
    return;
  }

  // this is sent by the worker when the main function returns
  if (msg.ctrl == "terminate") {
    console.log("terminate worker due to its request.");
    terminateWorker();
    printDoneMessage();
    drawPlots();
    return;
  }
}

var codeArea = document.getElementById("jsCodePopup");

/*
var highlightPause = false;
var latestCode = "";

function highlightBlock(id) {
  // This is the fitness function id, one would need to step several hundred times manually.
  // A more robust alternative could be to always skip highlightPause when the current id
  // equals the last seen id, however that would break stepping when two same blocks follow
  // one another in regular code.
  // Thus, stepping seems to only be a gadget until completely thought through.
  var fitnessID = Object.entries(workspace.blockDB_).find(
    (x) => x[1].type == "procedures_defreturn"
  )[0];
  if (id != fitnessID) {
    workspace.highlightBlock(id);
    // pauseAtNewBlock is true for stepping and false for running
    highlightPause = pauseAtNewBlock;
  }
}
*/
// tells the worker to stop
// this is usually completely useless, since messages aren't handled until the current
// execution finishes, which means that, unless one is using multi-threading, the stop code won't
// be processed until the entire algorithm finishes
//eslint-disable-next-line no-unused-vars -- is part of commented stop, step, and reset Buttons
function stopWorker() {
  if (worker != null) {
    worker.postMessage("stop");
  }
}

// kills the currently running worker
function terminateWorker() {
  if (worker != null) {
    worker.terminate();
    console.warn("Terminated running worker");
  }
  runButton.style.backgroundColor = "";
}

// updates the code that appears in the popup whenever a change happens
// this could probably just be done when the button is pressed, which would reduce console spam
workspace.addChangeListener(function (event) {
  if (!(event instanceof Blockly.Events.Ui)) {
    codeArea.innerHTML = "\r" + getCode();
  }
});

// disables any blocks that are floating in empty space
workspace.addChangeListener(Blockly.Events.disableOrphans);

function setUsingThreads() {
  USING_THREADS = true;
}

export { setUsingThreads, workspace, runCode, getCode, terminateWorker };
