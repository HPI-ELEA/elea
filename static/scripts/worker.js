var workerID

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
        message = new Message(message.data.destination, message.data.data, message.data.source);

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
            this.recvRequest = request;
            return;
        }
        
        // this will re-add the main function to the task queue to be run immediately
        // we can't call main directly because this request function will typically be called by main before it yields
        // we can't resume main until it properly yields, hence we add main to the task queue, and it will be run after
        setTimeout(main, 0, msg.data);
    }
}

var Handler = new MessageHandler();

function* main() {

}
