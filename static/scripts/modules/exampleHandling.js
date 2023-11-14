var PARAMETERS;
import { replaceWorkspaceWithXml } from "./import";
// updates the parameters map with the latest value from the url
function updateParameters() {
  PARAMETERS = new URLSearchParams(window.location.search);
}

// loads the given xml file into the Blockly workspace
async function loadExampleFile(exampleFile) {
  console.log("loading example " + exampleFile);
  let response = await fetch(exampleFile);
  if (!response.ok) return false;

  let xml = await response.text();
  return replaceWorkspaceWithXml(xml);
}

var fullAlgorithmNames = {
  oneplusone: "(1+1) EA",
  onepluslambda: "(1+λ) EA",
  mupluslambda: "(μ+λ) GA",
  onelambda: "(1,λ) EA",
  mulambda: "(μ,λ) GA",
  ioh7: "(1+λ) EA_norm (IOHalgorithm 7)",
  multithread: "Multithreading",
  full_multithread: "Full Multithreading", //eslint-disable-line camelcase
  multithread_performance: "Multithreading Performance Test", //eslint-disable-line camelcase
};

// loads the example in a url friendly format, with the folder and xml extension removed
async function loadExample(example, causedByUrl) {
  if (!(await loadExampleFile("examples/" + example + ".xml"))) return false;

  // if the example is being loaded because of a change in the url parameters,
  // then we don't want to update the url/parameters again, that makes forward/backwards seeking break
  if (!causedByUrl) {
    PARAMETERS.set("example", example);
    updateUrl();
  }

  let workspaceTitle = "Untitled";
  if (example != "empty")
    workspaceTitle = "Example: " + fullAlgorithmNames[example];
  document.getElementById("workspace-title").innerHTML = workspaceTitle;
}

// loads the example as defined by the url parameters
function loadExampleFromUrl() {
  let example = PARAMETERS.get("example");
  if (example) {
    loadExample(example, true);
  }
}

// keep track of the latest url parameters
let LATEST_SEARCH = window.location.search;

// updates the url with the values in the PARAMETERS object
function updateUrl() {
  window.history.pushState(null, null, "?" + PARAMETERS.toString());
  LATEST_SEARCH = window.location.search;
}

// this function is triggered by using the history arrows
// history items are added by the updateUrl function above
// this ensures that navigating with the history arrows updates the examples in the page
window.onpopstate = function () {
  if (window.location.search == LATEST_SEARCH) return;
  LATEST_SEARCH = window.location.search;
  updateParameters();
  loadExampleFromUrl();
};

updateParameters();
loadExampleFromUrl();

export { loadExample, updateUrl, PARAMETERS };
