var PARAMETERS;

// updates the parameters map with the latest value from the url
function update_parameters() {
    PARAMETERS = new URLSearchParams(window.location.search)
}

// loads the given xml file into the Blockly workspace
async function loadExampleFile(exampleFile) {
    console.log("loading example "+exampleFile);
    let response = await fetch(exampleFile);
    if (!response.ok) return false;
  
    let xml = await response.text();
    replaceWorkspaceWithXml(xml);
    return true; 
}

// loads the example in a url friendly format, with the folder and xml extension removed
async function loadExample(example, causedByUrl) {
    if (!await loadExampleFile("examples/"+example+".xml")) return false;
    
    // if the example is being loaded because of a change in the url parameters,
    // then we don't want to update the url/parameters again, that makes forward/backwards seeking break
    if (!causedByUrl) {
        PARAMETERS.set("example", example);
        update_url();
    }
}

// loads the example as defined by the url parameters
function load_example_from_url() {
    let example = PARAMETERS.get("example");
    if (example) {
        loadExample(example, true);
    }
}

// keep track of the latest url parameters
let LATEST_SEARCH = window.location.search;

// updates the url with the values in the PARAMETERS object
function update_url() {
    window.history.pushState(null, null, "?"+PARAMETERS.toString());
    LATEST_SEARCH = window.location.search;
}

// this function is triggered by using the history arrows
// history items are added by the update_url function above
// this ensures that navigating with the history arrows updates the examples in the page
window.onpopstate = function(){
    if (window.location.search == LATEST_SEARCH) return;
    LATEST_SEARCH = window.location.search;
    update_parameters();
    load_example_from_url();
};

update_parameters();
load_example_from_url();