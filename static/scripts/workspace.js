var PARAMETERS = {};

let parts = window.location.search.substring(1).split("&");
for (const i in parts) {
    let vals = parts[i].split("=");
    PARAMETERS[vals[0]] = vals[1];
}

if (PARAMETERS["example"]) {
    loadExample("examples/"+PARAMETERS["example"]+".xml");
}