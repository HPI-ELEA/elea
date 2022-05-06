import {handleLogFromWorker} from "./logging.mjs";
import { downloadCSV, updateValue } from "./CSVHandler.mjs";
import { Worker }  from "worker_threads";
var worker = new Worker("./algorithm.js");
worker.on("message", handleMessageFromWorker);
worker.on("error", handleErrorFromWorker);
function handleMessageFromWorker(msg){
    if (msg.ctrl == "print") {
        if (msg.source)
            console.log("[Thread#" + msg.sources.join(".") + "] " + msg.data + "\n")
        else
            console.log(msg.data)
        return;
    }

    if (msg.ctrl == "log") {
        handleLogFromWorker(msg.data);
        return;
    }

    if(msg.ctrl == "csv") {
        updateValue(msg.data);
        return;
    }

    // this is sent by the worker when the main function returns
    if (msg.ctrl == "terminate") {
        console.log("terminate worker due to its request.");
        terminateWorker();
        return;
    }
}

function handleErrorFromWorker(err){
    terminateWorker()
    downloadCSV();
    throw new Error(err.stack)
}

function terminateWorker(){
    if (worker != null) {
        worker.terminate();
        downloadCSV();
        console.warn("Terminated running worker");
    }
}