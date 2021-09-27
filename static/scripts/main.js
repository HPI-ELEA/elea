USING_THREADS = false;
PREV_DEFINITIONS = null;

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  function replaceWorkspaceQuestion(xml) {
      // TODO: Ask for unsaved changes
      replaceWorkspaceWithXml(xml);
  }

  function replaceWorkspaceWithXml(xml) {
    workspace.clear();
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
  }

  function promptForXML() {
    var xml = prompt();
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

  function downloadLog() {
    const fileObject = JSON.stringify({code: getCode(), log: jsonLog});
    var a = document.getElementById("download_json");
    var file = new Blob([fileObject], {type: "application/json"});
    a.href = URL.createObjectURL(file);
    a.download = "log.json";
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
    };
    reader.readAsText(input.files[0]);
  }

  var jsonLog = null;
  var worker = null;
  var downloadLogLink = document.getElementById("download_json");
  var bestFitness = document.getElementById('best-fitness');
  var bestIndividual = document.getElementById('best-individual');
  var outputArea = document.getElementById('outputArea');

  var pauseAtNewBlock = true;
  var blocklyArea = document.getElementById('blocklyArea');
  var blocklyDiv = document.getElementById('blocklyDiv');
  var workspace = Blockly.inject(blocklyDiv,
    { toolbox: document.getElementById('toolbox') });
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

  function downloadWorkspace() {
    var xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
    download(xml, "algorithm", "text/xml");
  }

  function downloadWorkspaceAsJS() {
    var js = getCode();
    var a = document.getElementById("download_js");
    var file = new Blob([js], {type: "text/javascript"});
    a.href = URL.createObjectURL(file);
    a.download = "algorithm.js";
  }

  function download(text, name, type) {
    var a = document.getElementById("download_xml");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
  }

  // DO NOT CHANGE THIS BEFORE UNDERSTANDING THE BELOW INFO

  // in order for multi-threading to work we need to add all of the function definitions to each thread,
  // Blockly provides the code for all these definitions, however it adds the source code to the internal object
  // in the order the objects are on the screen, this means that the threading blocks will only be able to see the
  // definitions that are physically higher on the screen than that block.
  // To get around this we need to grab the definitions from the end of the previous generation and use those in
  // the next one, therefore we need to generate the whole codebase at least twice before running the code.
  // GENERATE_TWICE is set to true when Blockly runs the generate code for multi-thread blocks
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

    /*var callbackStats =
    'function updateStats() {\
      //console.warn("test");\n\
      //console.warn({fitness:Math.random(), individual: [0,0,0,1,2,0,1], output:""});\n\
       self.postMessage({fitness:fittest, individual: fittestInd, output:".\\n"});\n\
     }\n\
     setInterval(updateStats, 200);\n\
     \n'*/
    var dateSetup =   'Date.prototype.nowAsString = function () {\n'
    dateSetup +=      '    return + this.getFullYear() + (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + ((this.getDate() < 10)?"0":"") + this.getDate() + ((this.getHours() < 10)?"0":"") + this.getHours() + ((this.getMinutes() < 10)?"0":"") + this.getMinutes() + ((this.getSeconds() < 10)?"0":"") + this.getSeconds() + (((this.getMilliseconds()) < 100)?"0":"") + (((this.getMilliseconds()) < 10)?"0":"") + this.getMilliseconds();\n';
    dateSetup +=      '}\n';
    var logSetup = 'var jsonLog = [];\n'; // log of one run
    logSetup +=    'var jsonLogItem = {};\n'; // smallest unit, one round in while loop
    logSetup +=    'var jsonLogName = "";\n'; // current log name, will be set to current datetime
    logSetup +=    'var jsonLogs = [];\n'; // list of all runs/logs
    var logSave = 'if (jsonLogs != []) {\n';
    logSave +=    '  self.postMessage({log:jsonLogs});\n';
    logSave +=    '}\n';
    var termination = 'self.postMessage({terminate:true});\n';
    var messageHandler = 'self.addEventListener("message", function(e) {\n';
    messageHandler +=    '  console.log("worker received message: ", e.data)\n';
    messageHandler +=    '  if (e.data == "stop") {\n';
    messageHandler += logSave;
    messageHandler +=    '    self.close();\n';
    messageHandler +=    '  } else {\n';
    messageHandler +=    '    console.warn("unused Message in worker: ", e.data)\n';
    messageHandler +=    '  }\n';
    messageHandler +=    '}, false);\n';

    // import the message handler header
    let imports = "";
    imports += "importScripts(('"+self.location+"').replace(/([^/]*$)/, '')+'scripts/MessageHandler.js');\n"
    imports += "_thread_id = null;\n";

    /*"function consolelog(x) {self.postMessage({output:x})};\n*/
    code = imports + "function windowalert(x) {self.postMessage({output:x})};\n" + messageHandler + dateSetup + logSetup + code + logSave //+ termination // TODO? we don't really need it other than for abort
    console.log(code);
    // TODO: find implementation for window.alert for both webworker and stepping
    const blob = new Blob([code], {type: 'application/javascript'})
    worker = new Worker(URL.createObjectURL(blob))
    worker.addEventListener("message", handleMessageFromWorker)
  }

  function handleMessageFromWorker(msg) {
    if (msg.data.ctrl == "log") {
      // console.log.apply(this, msg.data.data);
      if (msg.data.source)
        outputArea.innerHTML += "[Thread#"+msg.data.source+"] "+msg.data.data+"\n";
      else
        outputArea.innerHTML += msg.data.data+"\n";
      return;
    }
    if (msg.data['terminate'] == true) {
      console.log("terminate worker due to its request.")
      worker.terminate();
      return
    }
    if (msg.data['fitness'] != null) {
      bestFitness.innerHTML = msg.data['fitness'];
    }
    if (msg.data['individual'] != null) {
      bestIndividual.innerHTML = msg.data['individual'];
    }
    if (![undefined, '', null].includes(msg.data['output'])) {
      outputArea.innerHTML += msg.data['output']+"\n"
    }
    if (msg.data['log'] != null) {
      console.log("log Arrived");
      downloadLogLink.style.backgroundColor = "grey"
      jsonLog = msg.data['log'];
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

  function initApi(interpreter, globalObject) {
    // Add an API function for the alert() block, generated for "text_print" blocks.
    /*interpreter.setProperty(globalObject, 'alert',
      interpreter.createNativeFunction(function(text) {
      text = arguments.length ? text : '';
      outputArea.value += '\n' + text;
    }));*/
    // TODO: remove all alerts from js block code

    // Add an API function for the prompt() block.
    var wrapper = function(text) {
      return interpreter.createPrimitive(prompt(text));
    };
    interpreter.setProperty(globalObject, 'prompt',
        interpreter.createNativeFunction(wrapper));

    // Add an API function for the log() block.
    var wrapper = function(text) {
      return interpreter.createPrimitive(console.log(text));
    };
    interpreter.setProperty(globalObject, 'consolelog',
        interpreter.createNativeFunction(wrapper));

    // Add an API function for the log() block.
    var wrapper = function(text) {
        return interpreter.createPrimitive(console.log(text));
      };
      interpreter.setProperty(globalObject, 'windowalert',
          interpreter.createNativeFunction(wrapper));

    // Add an API function for highlighting blocks.
    var wrapper = function(id) {
      id = String(id || '');
      return interpreter.createPrimitive(highlightBlock(id));
    };
    interpreter.setProperty(globalObject, 'highlightBlock',
        interpreter.createNativeFunction(wrapper));
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

  function stopWorker() {
    if (worker != null) {
      worker.postMessage("stop");
    }
  }

  function terminateWorker() {
    if (worker != null) {
      worker.terminate();
      console.warn("Terminated running worker");
    }
  }

  // function resetStepUi(clearOutput) {
  //   terminateWorker();
  //   workspace.highlightBlock(null);
  //   highlightPause = false;

  //   if (clearOutput) {
  //     outputArea.innerHTML = ""
  //     // TODO: clear output of eventual output field
  //     //outputArea.value = 'Program output:\n=================';
  //   }
  // }

  function generateCodeAndLoadIntoInterpreter() {
    // Generate JavaScript code and parse it.
    // TODO: remove highlightBlock and only use for stepping
    // Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    // Blockly.JavaScript.addReservedWords('highlightBlock');
    // latestCode = Blockly.JavaScript.workspaceToCode(workspace);
    // resetStepUi(true);
    outputArea.innerHTML = "";
  }

  // function stepCode() {
  //   pauseAtNewBlock = true;
  //   if (!myInterpreter) {
  //     // First statement of this code.
  //     // Clear the program output.
  //     resetStepUi(true);
  //     myInterpreter = new Interpreter(latestCode, initApi);

  //     // And then show generated code in an alert.
  //     // In a timeout to allow the outputArea.value to reset first.
  //     setTimeout(function() {
  //       alert('Ready to execute the following code\n' +
  //         '===================================\n' + latestCode);
  //       highlightPause = true;
  //       stepCode();
  //     }, 1);
  //     return;
  //   }
  //   highlightPause = false;
  //   do {
  //     try {
  //       var hasMoreCode = myInterpreter.step();
  //     } finally {
  //       if (!hasMoreCode) {
  //         // Program complete, no more code to execute.
  //         //outputArea.value += '\n\n<< Program complete >>';

  //         myInterpreter = null;
  //         resetStepUi(false);

  //         // Cool down, to discourage accidentally restarting the program.
  //         stepButton.disabled = 'disabled';
  //         setTimeout(function() {
  //           stepButton.disabled = '';
  //         }, 2000);

  //         return;
  //       }
  //     }
  //     // Keep executing until a highlight statement is reached,
  //     // or the code completes or errors.
  //   } while (hasMoreCode && !highlightPause);
  // }

  // Load the interpreter now, and upon future changes.
  // generateCodeAndLoadIntoInterpreter();
  workspace.addChangeListener(function(event) {
    if (!(event instanceof Blockly.Events.Ui)) {
      codeArea.innerHTML = getCode();
      // generateCodeAndLoadIntoInterpreter();
    }
  });

  workspace.addChangeListener(Blockly.Events.disableOrphans);
