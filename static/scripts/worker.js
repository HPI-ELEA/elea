// a simple wrapper for a queue object
class Queue {
    constructor() {
        this.list = new Array();
    }
    empty() {
        return (this.list.length == 0);
    }
    push(item) {
        this.list.push(item);
    }
    pop() {
        return this.list.shift();
    }
}

// an object used to request a message receive
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
        this.ctrl = ctrl || null;
    }
}

// manages incoming messages and receive requests
class MessageHandler {
    constructor() {
        this.idCounter = 1;
        this.pendingRequest = null;

        // initialise the message buffer with a queue from the parent
        this.messageBuffer = new Map([[0, new Queue()]]);

        // initialise the thread database with the current worker object
        // which will allow for messages to be sent to the parent
        this.threadMap = new Map([[0, self]]);
    }

    // sends a message to the specified location
    // if the destination is -1 then send to the parent
    // if the id is not valid then print a warning to the console
    sendMessage(msg) {
        let destThread = this.threadMap.get(msg.destination == -1 ? 0 : msg.destination);
        if (destThread == undefined) {
            console.warn("could not send message", msg, "- destination thread not found");
            return false;
        }

        // if (msg.ctrl == "log" && msg.source != null) {
        //     msg.data[0] = msg.source+':'+msg.data[0];
        // }
        destThread.postMessage(msg);
    }

    handleIncomingMessage(message) {
        message = message.data;

        // if the message came from a child and isn't addressed to the parent (this thread) then redirect
        // this will mostly be used for print statements, which need to be handled by the top level thread
        if (message.source != 0 && message.destination != 0) {
            this.sendMessage(message);
            return;
        }

        // if there is nothing waiting on the message, then place into the buffer queue
        if (this.pendingRequest == null || this.pendingRequest.source != message.source) {
            this.messageBuffer.get(message.source).push(message);
            return;
        }

        // remove the pending request and continue the main function with the message
        this.pendingRequest = null;
        main(message.data);
    }

    recvRequest(request) {
        let msg = this.messageBuffer.get(request.source).pop();

        // if there is no message in the queue for the requested source
        if (msg == undefined) {
            this.pendingRequest = request;
            return;
        }
        
        // this will re-add the main function to the task queue to be run immediately
        // we can't call main directly because this request function will typically be called by main before it yields
        // we can't resume main until it properly yields, hence we add main to the task queue, and it will be run after
        setTimeout(main, 0, msg.data);
    }

    // create a new worker thread with unique id and create the relevant values in the maps
    createThread(initialiser) {
        let handler = this;
        let id = this.idCounter++;
        let newThread = new Worker(initialiser);

        // ensure that messages from this thread specify the correct source
        newThread.addEventListener("message", function(msg) {
            msg.data.source = id;

            // we cannot use 'this' inside a callback function
            handler.handleIncomingMessage(msg);
        });

        this.threadMap.set(id, newThread);
        this.messageBuffer.set(id, new Queue());
        return id;
    }

    // removes a thread from the database
    removeThread(id) {
        this.threadMap.get(id).terminate();
        this.messageBuffer.delete(id);
        this.threadMap.delete(id);
    }
}

// the variable argument syntax is not supported in IE as of 2021-08-27:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
consoleLog = function(...v) {
    Handler.sendMessage(new Message(-1, v, "log"));
}