USING_THREADS = false;
PREV_DEFINITIONS = null;
HAS_UNSAVED_CHANGES = false;

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

// this function was taken from: https://stackoverflow.com/a/52829183
const downloadFile = (blob, fileName) => {
  const link = document.createElement('a');
  // create a blobURI pointing to our Blob
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  // some browser needs the anchor to be in the doc
  document.body.append(link);
  link.click();
  link.remove();
  // in case the Blob uses a lot of memory
  setTimeout(() => URL.revokeObjectURL(link.href), 7000);
};

function replaceWorkspaceQuestion(xml) {
    // TODO: Ask for unsaved changes
    replaceWorkspaceWithXml(xml);
}

function replaceWorkspaceWithXml(xml) {
  if(HAS_UNSAVED_CHANGES){
    if(!window.confirm("Are you sure you want to exit without saving?"))
      return
  }
  workspace.clear();
  Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
  workspace.addChangeListener(waitForFinishedLoading)
}

function promptForXML() {
  var xml = prompt();
  if (xml == null) return;
  console.warn(xml);
  replaceWorkspaceWithXml(xml);
}

function copyXMLToClipboard() {
  var xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
  copyToClipboard(xml)
}

function copyJSToClipboard() {
  var js = getCode();
  copyToClipboard(js);
}

function showXMLInPopup() {
  var xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
  window.alert(xml);
}

function selectedFileChanged() {
    console.log("fileChanged")
  var input = document.getElementById('upload_xml')
  if (input.files.length === 0) {
    console.log('No file selected.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function fileReadCompleted() {
      replaceWorkspaceQuestion(reader.result);
      console.log("algorithm updated")
      document.getElementById("workspace-title").innerHTML = input.files[0].name
  };
  reader.readAsText(input.files[0]);
}

var jsonLog = null;
var worker = null;
var outputArea = document.getElementById('outputArea');
var outputScroll = document.getElementById("scroller");
var runButton = document.getElementById("run-button");

var pauseAtNewBlock = true;
var blocklyArea = document.getElementById('blocklyArea');
var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv,
  { toolbox: document.getElementById('toolbox'),
    zoom:
        {controls: true,
         wheel: true,
         startScale: 1.0,
         maxScale: 2.5,
         minScale: 0.4,
         scaleSpeed: 1.05,
         pinch: true},
    trashcan: true });
Blockly.Xml.domToWorkspace(document.getElementById('startBlocks'),
  workspace);
var onresize = function (e) {
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
  blocklyDiv.style.left = x + 'px';
  blocklyDiv.style.top = y + 'px';
  blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
  blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
  Blockly.svgResize(workspace);
};
window.addEventListener('resize', onresize, false);
onresize();
Blockly.svgResize(workspace);

CHANGE_OPERATIONS = [
  Blockly.Events.BLOCK_CHANGE,
  Blockly.Events.BLOCK_CREATE,
  Blockly.Events.BLOCK_DELETE,
  Blockly.Events.BLOCK_MOVE,
  Blockly.Events.VAR_CREATE,
  Blockly.Events.VAR_DELETE,
  Blockly.Events.VAR_RENAME,
  Blockly.Events.COMMENT_CREATE,
  Blockly.Events.COMMENT_DELETE,
  Blockly.Events.COMMENT_CHANGE,
  Blockly.Events.COMMENT_MOVE,
];
function unsavedChangesListener(event) {
  if (CHANGE_OPERATIONS.includes(event.type)) {
    HAS_UNSAVED_CHANGES = true
    workspace.removeChangeListener(unsavedChangesListener)
    window.addEventListener("beforeunload", beforeUnloadListener)
    let workspaceTitle = document.getElementById("workspace-title").innerHTML
    document.getElementById("workspace-title").innerHTML = workspaceTitle + "*"
    console.warn("Workspace has unsaved changes now");
  }
}

function beforeUnloadListener(e){
  e.preventDefault();
  return e.returnValue = "Are you sure you want to exit without saving?";
}

function resetHasUnsavedChanges() {
  HAS_UNSAVED_CHANGES = false
  workspace.addChangeListener(unsavedChangesListener)
  window.removeEventListener("beforeunload", beforeUnloadListener)
  let workspaceTitle = document.getElementById("workspace-title").innerHTML
  document.getElementById("workspace-title").innerHTML = workspaceTitle.replace(/\*$/, '')
  console.warn("Workspace has no unsaved changes now")
}

function waitForFinishedLoading(event) {
  if (event.type == Blockly.Events.FINISHED_LOADING) {
    resetHasUnsavedChanges()
    workspace.removeChangeListener(waitForFinishedLoading);
  }
}
workspace.addChangeListener(waitForFinishedLoading);

function download(text, name, type) {
  var file = new Blob([text], {type: type});
  downloadFile(file, name);
  resetHasUnsavedChanges()
}

function downloadWorkspace() {
  var xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
  download(xml, "algorithm", "text/xml");
}

function downloadWorkspaceAsJS() {
  var js = getCode();
  download(js, "algorithm.js", "text/javascript");
}



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
  Blockly.JavaScript.STATEMENT_PREFIX = '';
  Blockly.JavaScript.addReservedWords('code');

  let code = Blockly.JavaScript.workspaceToCode(workspace);
  if (USING_THREADS) code = Blockly.JavaScript.workspaceToCode(workspace);
  USING_THREADS = false;
  return code;
}

// TODO: modify to terminate worker
const onMessageFunctionForWorker = "self.onmessage = function (msg) {\
switch (msg.data.aTopic) {\
    case 'do_sendWorkerArrBuff':\
            sendWorkerArrBuff(msg.data.aBuf)\
        break;\
    default:\
        throw 'no aTopic on incoming message to ChromeWorker';\
}\
}"

function runCode() {
  clearLog();
  terminateWorker();
  Blockly.JavaScript.STATEMENT_PREFIX = '';
  //Blockly.JavaScript.addReservedWords('highlightBlock');
  Blockly.JavaScript.addReservedWords('jsonLogitem');
  Blockly.JavaScript.addReservedWords('jsonLog');
  Blockly.JavaScript.addReservedWords('jsonLogs');
  Blockly.JavaScript.addReservedWords('code');
  Blockly.JavaScript.addReservedWords('onMessage'); // TODO: or function?
  Blockly.JavaScript.addReservedWords('updateStats');
  Blockly.JavaScript.addReservedWords('main');
  Blockly.JavaScript.addReservedWords('_thread_id');
  Blockly.JavaScript.addReservedWords('Handler');

  var code = getCode();

  var dateSetup =   'Date.prototype.nowAsString = function () {\n'
  dateSetup +=      '    return + this.getFullYear() + (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + ((this.getDate() < 10)?"0":"") + this.getDate() + ((this.getHours() < 10)?"0":"") + this.getHours() + ((this.getMinutes() < 10)?"0":"") + this.getMinutes() + ((this.getSeconds() < 10)?"0":"") + this.getSeconds() + (((this.getMilliseconds()) < 100)?"0":"") + (((this.getMilliseconds()) < 10)?"0":"") + this.getMilliseconds();\n';
  dateSetup +=      '}\n';
  // var logSetup = 'var jsonLog = [];\n'; // log of one run
  // logSetup +=    'var jsonLogItem = {};\n'; // smallest unit, one round in while loop
  // logSetup +=    'var jsonLogName = "";\n'; // current log name, will be set to current datetime
  // logSetup +=    'var jsonLogs = [];\n'; // list of all runs/logs
  // var logSave = 'if (jsonLogs != []) {\n';
  // logSave +=    '  self.postMessage({log:jsonLogs});\n';
  // logSave +=    '}\n';
  var termination = 'Handler.sendMessage(new Message(Handler.PARENT_ID, 0, "terminate"));\n';
  // var messageHandler = 'self.addEventListener("message", function(e) {\n';
  // messageHandler +=    '  console.log("worker received message: ", e.data)\n';
  // messageHandler +=    '  if (e.data == "stop") {\n';
  // messageHandler += logSave;
  // messageHandler +=    '    self.close();\n';
  // messageHandler +=    '  } else {\n';
  // messageHandler +=    '    console.warn("unused Message in worker: ", e.data)\n';
  // messageHandler +=    '  }\n';
  // messageHandler +=    '}, false);\n';

  // import the message handler header
  let imports = "";
  imports += "importScripts(('"+self.location+"').replace(/([^/]*$)/, '')+'scripts/MessageHandler.js');\n"
  imports += "_thread_id = null;\n";

  // code = imports + "function windowalert(x) {self.postMessage({output:x})};\n" + messageHandler + dateSetup + code termination//logSetup + code + logSave + termination // TODO? we don't really need it other than for abort
  code = imports + dateSetup + code;
  console.log(code);
  // TODO: find implementation for window.alert for both webworker and stepping
  const blob = new Blob([code], {type: 'application/javascript'})
  worker = new Worker(URL.createObjectURL(blob))
  worker.addEventListener("message", handleMessageFromWorker)
  worker.addEventListener("error", function(error) { console.error(error) ; terminateWorker() });

  // indicate that the code is running
  runButton.style.backgroundColor = "LightGreen";
}

function handleMessageFromWorker(msg) {
  msg = msg.data;
  if (msg.ctrl == "print") {
    if (msg.source)
      outputArea.innerHTML += "[Thread#"+msg.sources.join(".")+"] "+msg.data+"\n";
    else
      outputArea.innerHTML += msg.data+"\n";

    outputScroll.scroll(0, outputScroll.scrollHeight);
    return;
  }
  
  if (msg.ctrl == "log") {
    handleLogFromWorker(msg.data);
    return;
  }

  // this is sent by the worker when the main function returns
  if (msg.ctrl == "terminate") {
    console.log("terminate worker due to its request.")
    terminateWorker();
    return
  }
}

var stepButton = document.getElementById('step-button');
var runButton = document.getElementById('run-button');
var resetButton = document.getElementById('reset-button');
var codeArea = document.getElementById('jsCodePopup');
var myInterpreter = null;

function loadUserWorkspace() {
  var workspacestring = prompt();
  Blockly.Xml.domToWorkspace(document.getElementById('startBlocks'),
  workspace);
}

var highlightPause = false;
var latestCode = '';

function highlightBlock(id) {
  // This is the fitness function id, one would need to step several hundred times manually.
  // A more robust alternative could be to always skip highlightPause when the current id
  // equals the last seen id, however that would break stepping when two same blocks follow
  // one another in regular code. 
  // Thus, stepping seems to only be a gadget until completely thought through.
  var fitnessID = Object.entries(workspace.blockDB_)
                        .find(x => x[1].type == "procedures_defreturn")[0]
  if (id != fitnessID) {
    workspace.highlightBlock(id);
    // pauseAtNewBlock is true for stepping and false for running
    highlightPause = pauseAtNewBlock;
  }
}

// tells the worker to stop
// this is usually completely useless, since messages aren't handled until the current
// execution finishes, which means that, unless one is using multi-threading, the stop code won't
// be processed until the entire algorithm finishes
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

function clearOutput() {
  outputArea.innerText = "";
}

// updates the code that appears in the popup whenever a change happens
// this could probably just be done when the button is pressed, which would reduce console spam
workspace.addChangeListener(function(event) {
  if (!(event instanceof Blockly.Events.Ui)) {
    codeArea.innerHTML = "\r"+getCode();
  }
});

// disables any blocks that are floating in empty space
workspace.addChangeListener(Blockly.Events.disableOrphans);
