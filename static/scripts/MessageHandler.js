// a simple wrapper for a queue object
class Queue {
  constructor() {
    this.list = new Array();
  }
  empty() {
    return this.list.length == 0;
  }
  push(item) {
    this.list.push(item);
  }
  pop() {
    return this.list.shift();
  }
}

// an object used to request a message receive
//eslint-disable-next-line no-unused-vars -- is used in code blockly compiles
class RecvRequest {
  constructor(source) {
    this.source = source;
  }
}

// a message object
// the source field is filled in by the receiving thread, their message handler
// should add the id that that thread uses to refer to this one
class Message {
  constructor(destination, data, ctrl) {
    this.destination = destination;
    this.data = data;
    this.source = null;
    this.sources = new Array();
    this.ctrl = ctrl || null;
  }
}

// manages incoming messages and receive requests
class MessageHandler {
  constructor() {
    this.ANY_CHILD_SOURCE = -1;
    this.PARENT_ID = 0;
    this.THREAD_ID = null;

    this.idCounter = 1;
    this.pendingRequest = null;

    // initialise the message buffer with a queue from the parent
    this.messageBuffer = new Map([[0, new Queue()]]);

    // initialise the thread database with the current worker object
    // which will allow for messages to be sent to the parent
    this.threadMap = new Map([[0, self]]);
  }

  setParentPort(parent) {
    this.threadMap.set(0, parent);
  }

  // sends a message to the specified location
  // if the id is not valid then print a warning to the console
  sendMessage(msg) {
    let destThread = this.threadMap.get(msg.destination);
    if (destThread == undefined) {
      console.warn(
        "could not send message",
        msg,
        "- destination thread not found"
      );
      return false;
    }

    destThread.postMessage(msg);
  }

  handleIncomingMessage(message) {
    // if the message came from a child and isn't addressed to the parent (this thread) then forward
    // this should never be used by any of the current elea blocks, it was in case threads ever wished to speak to eachother
    if (
      message.source != Handler.PARENT_ID &&
      message.destination != Handler.PARENT_ID
    ) {
      this.sendMessage(message);
      return;
    }

    if (message.ctrl == "id") {
      this.THREAD_ID = message.data;
      this.receiveId();
      return;
    }

    // if the message is a log or a print statement then forward the message further up the chain
    if (message.ctrl == "log" || message.ctrl == "print") {
      this.sendMessage(message);
      return;
    }

    // if the message is a variable import request then send a message back to the source of the request
    // with the value of the given variable, available through the global `self` object
    if (message.ctrl == "import") {
      this.sendMessage(new Message(message.source, self[message.data]));
      return;
    }

    // if there is no waiting request immediately buffer the message
    if (this.pendingRequest == null) {
      this.messageBuffer.get(message.source).push(message);
      return;
    }

    // if the waiting request is valid then continue the execution
    if (
      this.pendingRequest.source == message.source ||
      (this.pendingRequest.source == this.ANY_CHILD_SOURCE &&
        message.source != this.PARENT_ID)
    ) {
      this.pendingRequest = null;
      main.next(message); //eslint-disable-line no-undef -- is defined in block code
      return;
    }

    // if it was not valid then buffer the message
    this.messageBuffer.get(message.source).push(message);
  }

  recvRequest(request) {
    let msg = undefined;

    // grab the message if it is already buffered
    // if the receiver is set to ANY then grab the first item in the buffer not from the parent
    if (request.source == this.ANY_CHILD_SOURCE) {
      for (const key in this.messageBuffer) {
        if (key == this.PARENT_ID) continue;
        if (this.messageBuffer[key].length != 0) {
          msg = this.messageBuffer[key].pop();
        }
      }
    } else {
      msg = this.messageBuffer.get(request.source).pop();
    }

    // if there is no message in the queue for the requested source
    if (msg == undefined) {
      this.pendingRequest = request;
      return;
    }

    // this will re-add the main function to the task queue to be run immediately
    // we can't call main directly because this request function will typically be called by main before it yields
    // we can't resume main until it properly yields, hence we add main to the task queue, and it will be run after
    setTimeout(
      function (msg) {
        main.next(msg); //eslint-disable-line no-undef -- is defined in block code
      },
      0,
      msg
    );
  }

  // create a new worker thread with unique id and create the relevant values in the maps
  createThread(initialiser) {
    let handler = this;
    let id = this.idCounter++;
    let newThread;
    if (typeof process == "object")
      // Program runs in NodeJS
      newThread = new NodeWorker(initialiser, handler, id).newThread;
    else newThread = new JSWorker(initialiser, handler, id).newThread;

    this.threadMap.set(id, newThread);
    this.messageBuffer.set(id, new Queue());

    // sends the thread their id
    this.sendMessage(new Message(id, id, "id"));
    return id;
  }

  // removes a thread from the database
  removeThread(id) {
    this.threadMap.get(id).terminate();
    this.messageBuffer.delete(id);
    this.threadMap.delete(id);
  }

  resetThreadIds() {
    this.idCounter = 1;
  }

  receiveId() {
    if (this.THREAD_ID == null || this.pendingRequest) return;
    setTimeout(function () {
      main.next(); //eslint-disable-line no-undef -- is defined in block code
    }, 0);
  }
}

// the variable argument syntax is supported in everything except IE as of 2021-08-27:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
function consolelog(...v) {
  Handler.sendMessage(new Message(Handler.PARENT_ID, v.join(" "), "print"));
}

//eslint-disable-next-line no-unused-vars -- is used in code blockly compiles
function consoleLog(...v) {
  consolelog(v);
}

//eslint-disable-next-line no-unused-vars -- is used in code blockly compiles
function consoleerror(e) {
  consolelog(e);
  consolelog("Find more information in the console.");
  console.error(e);
}

// creates the message handler object for the calling script to use
var Handler = new MessageHandler();

class JSWorker {
  constructor(workerData, handler, id) {
    this.newThread = new Worker(workerData);
    this.newThread.onmessage = function (msg) {
      msg.data.source = id;
      msg.data.sources.unshift(id);
      handler.handleIncomingMessage(msg.data);
    };
  }
}

class NodeWorker {
  constructor(workerData, handler, id) {
    this.newThread = new Worker(workerData, { eval: true });
    this.newThread.on("message", function (msg) {
      msg.source = id;
      msg.sources.unshift(id);
      handler.handleIncomingMessage(msg);
    });
  }
}

// redirect messages from the parent to the message handler
// labels the source as having an ID of 0 - the parent's ID
self.onmessage = function (msg) {
  msg.data.source = Handler.PARENT_ID;
  Handler.handleIncomingMessage(msg.data);
};
