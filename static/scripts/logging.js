var logDB = {};

// clear the database
function clearLog() {
    logDB = {};
}

// parse the log from the the worker threads and save the results into the database
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

// parse the logs for a specific algorithm, and create the meta and data files in the zip
function zipAlgorithm(zip, db, algorithm) {
    /////////////////////////////
    // CREATING THE META FILE  //
    /////////////////////////////
    zip.folder(algorithm+"/data_f1");
    let contents = ""
    for (const dim in db) {
        const dimDB = db[dim];

        contents += "suite = 'elea', funcId = 1, DIM = "+dim+", algId = '"+algorithm+"'\n";
        contents += "%\n";
        contents += "data_f1/IOHprofiler_f1_DIM"+dim+".dat";

        // adding the meta-info for each run in each data file
        for (const run in db[dim]) {
            const runDB = dimDB[run];
            contents += ", 1:"+runDB.max_evaluations+"|"+runDB[ runDB.length-1 ].fitness;
        }
        contents += "\n";

        /////////////////////////////////////////
        // CREATING THE DATA FILE FOR EACH DIM //
        /////////////////////////////////////////
        const header = '"function evaluation" "best-so-far f(x)"\n';
        let contentsData = "";
        for (const run in dimDB) {
            contentsData += header;
    
            // we can't use 'for (const in ...' because the run object also contains a max_evaluations field
            for (let i = 0; i < dimDB[run].length; i++) {
                const element = dimDB[run][i];
                contentsData += element.evaluation+" "+element.fitness+"\n";
            }
        }
        zip.file(algorithm+"/data_f1/IOHprofiler_f1_DIM"+dim+".dat", contentsData);
        /////////////////////////////////////////
        /////////////////////////////////////////
    }

    zip.file(algorithm+"/IOHprofiler_f1.info", contents);
}

// compile the zip file and give it to the user as a download
async function downloadLog() {
    console.warn("creating zip archive in IOHprofiler format");
    var zip = new JSZip();
    zip.file("raw.json", JSON.stringify(logDB));

    for (const algorithm in logDB) {
        zip.folder(algorithm);
        zipAlgorithm(zip, logDB[algorithm], algorithm);
    }

    let file = await zip.generateAsync({type: "blob"});
    downloadFile(file, "log.zip");
    if (file) clearLog();
}