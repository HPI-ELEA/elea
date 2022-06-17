import { updateValue as updateValueIOH, download as downloadIOH, hasEntries as hasEntriesIOH } from "./modules/IOHAnalyzerHandler.mjs";
import { download as downloadCSV, updateValue as updateValueCSV, hasEntries as hasEntriesCSV } from "./CSVHandler.mjs";
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
        updateValueIOH(msg.data);
        return;
    }

    if(msg.ctrl == "csv") {
        updateValueCSV(msg.data);
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
        if(hasEntriesCSV())
            downloadCSV();
        if(hasEntriesIOH())
            downloadIOH();
        drawPlots(); 
        console.warn("Terminated running worker");
    }
}