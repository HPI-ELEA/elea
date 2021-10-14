var logDB = {};

function handleLogFromWorker(log) {
    if (!logDB[log.algorithm])
        logDB[log.algorithm] = {};
    if (!logDB[log.algorithm][log.dimension])
        logDB[log.algorithm][log.dimension] = {};
    if (!logDB[log.algorithm][log.dimension][log.run])
        logDB[log.algorithm][log.dimension][log.run] = new Array();
    
    logDB[log.algorithm][log.dimension][log.run].push({"evaluation": log.evaluation, "fitness": log.fitness});
}