import { handleLogFromWorker, downloadLog } from "./modules/logging.mjs";
import { downloadCSV, updateValue, hasCSVEntries } from "./CSVHandler.mjs";
import { updateValue as updatePlotValue, drawPlots } from "./PlotHandler.mjs";
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

    if(msg.ctrl == "plot") {
        updatePlotValue(msg.data);
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
        if(hasCSVEntries())
            downloadCSV();
        downloadLog();
        drawPlots(); 
        console.warn("Terminated running worker");
    }
}