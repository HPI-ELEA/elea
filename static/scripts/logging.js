var logDB = {};

function clearLog() {
    logDB = {};
}

function handleLogFromWorker(log) {
    if (!logDB[log.algorithm])
        logDB[log.algorithm] = {};
    if (!logDB[log.algorithm][log.dimension])
        logDB[log.algorithm][log.dimension] = {};
    if (!logDB[log.algorithm][log.dimension][log.run])
        logDB[log.algorithm][log.dimension][log.run] = new Array();

    logDB[log.algorithm][log.dimension][log.run]["max_evaluations"] = log.max_evaluations;

    for (let i = 0; i < log.length; i++) {
        logDB[log.algorithm][log.dimension][log.run].push({
            "evaluation": log[i].evaluation,
            "fitness": log[i].fitness
        }) ;
    }
}
    
    logDB[log.algorithm][log.dimension][log.run].push({"evaluation": log.evaluation, "fitness": log.fitness});
}

async function downloadLog() {
    var zip = new JSZip();
    zip.file("raw.json", JSON.stringify(logDB));

    let file = await zip.generateAsync({type: "blob"});
    downloadFile(file, "log.zip");
}