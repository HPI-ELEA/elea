var logDB = {};

// clear the database
function clearLog() {
  logDB = {};
}

// parse the log from the the worker threads and save the results into the database
function handleLogFromWorker(log) {
  if (!logDB[log.algorithm]) logDB[log.algorithm] = {};

  if (!logDB[log.algorithm][log.function])
    logDB[log.algorithm][log.function] = {};

  if (!logDB[log.algorithm][log.function][log.dimension])
    logDB[log.algorithm][log.function][log.dimension] = {};

  if (!logDB[log.algorithm][log.function][log.dimension][log.run])
    logDB[log.algorithm][log.function][log.dimension][log.run] = new Array();

  logDB[log.algorithm][log.function][log.dimension][log.run]["budget"] =
    log.budget;

  for (let i = 0; i < log.length; i++) {
    logDB[log.algorithm][log.function][log.dimension][log.run].push({
      evaluation: log[i].evaluation,
      fitness: log[i].fitness,
    });
  }
}

export { logDB, clearLog, handleLogFromWorker };
