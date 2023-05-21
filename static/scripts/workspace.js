import { runCode, terminateWorker } from "./modules/blocklyHandling";
import { loadExample } from "./modules/exampleHandling";
import { selectedFileChanged, promptForXML } from "./modules/import";
import {
  copyXMLToClipboard,
  downloadWorkspace,
  downloadWorkspaceAsJS,
} from "./modules/export";
import { downloadIOH, hasEntriesIOH } from "./modules/IOHAnalyzerHandler";
import { clearIOH } from "./modules/IOHAnalyzerHandler";
import { highlightAll } from "prismjs";
import $ from "jquery";
import { clearPlots, downloadPlotsAsCSV, hasPlotEntries } from "./PlotHandler";
import { clearCSV, downloadCSV, hasEntriesCSV } from "./CSVHandler";
import Cookies from "js-cookie";
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

$("#run-button").click(runCode);
$("#kill-button").click(terminateWorker);
$("#clear-button").click(clearOutput);
$("#show-button").click(highlightAll);
$("#show-dashboard-button").click(() => {});
// $('#stop-button').click(stopWorker)
// $('#step-button').click(stepCode)
// $('#reset-button').click(generateCodeAndLoadIntoInterpreter)

$("#example-demo").click(() => loadExample("full"));

$("#example-empty").click(() => loadExample("empty"));
$("#example-full").click(() => loadExample("full"));
$("#example-simple").click(() => loadExample("simple"));
$("#example-oneplusone").click(() => loadExample("oneplusone"));
$("#example-onepluslambda").click(() => loadExample("onepluslambda"));
$("#example-onelambda").click(() => loadExample("onelambda"));
$("#example-multithread").click(() => loadExample("multithread"));
$("#example-full-multithread").click(() => loadExample("full_multithread"));
$("#example-multithread-performance").click(() =>
  loadExample("multithread-performance")
);
$("#example-simple-plotting").click(() => loadExample("simple_plotting"));

$("#upload_xml").click(() => $("#upload_xml_input").click());
$("#upload_xml_input").change(selectedFileChanged);
$("#promt_for_xml").click(promptForXML);
$("#download_xml").click(downloadWorkspace);
$("#copy_xml").click(copyXMLToClipboard);
$("#download_js").click(downloadWorkspaceAsJS);
$("#show_js").click(highlightAll);
$("#download_json").click(tryDownloadLog);
$("#download_csv").click(tryDownloadCSV);
$("#download_plots_as_csv").click(tryDownloadPlotsAsCSV);

// Align the output column to the height of the workspace
$("#output-column").height($("#blockly-div").height());

// remove loading icon and show content
document.getElementById("spinner").style.display = "none";
document.getElementById("workspace-content").style.opacity = "1.0";

const exampleDropdown = new bootstrap.Dropdown("#navbarExampleDropdown");
const saveDropdown = new bootstrap.Dropdown("#navbarSaveDropdown");

document
  .getElementById("navbarExampleDropdown")
  .addEventListener("click", () => {
    exampleDropdown.toggle(exampleDropdown);
  });
document.getElementById("navbarSaveDropdown").addEventListener("click", () => {
  saveDropdown.toggle(saveDropdown);
});
//tutorial:

const tutorialModal = new bootstrap.Modal("#tutorialModal");
const tutorialCarousel = new bootstrap.Carousel("#tutorialCarousel");

//show tutorial on page load
//eslint-disable-next-line no-unused-vars -- is necessary to catch event

const cookieBanner = new bootstrap.Modal("#cookieBanner");
const tutorialCloseButton = document.getElementById("tutorialModalClose");
const optOutCheck = document.getElementById("tutorialOptOutBox");

//cookie consent and tutorial opt-out

document.getElementById("cookieOptions").addEventListener("click", () => {
  cookieBanner.show(cookieBanner);
});
if (!Cookies.get("cookieConsent")) {
  window.addEventListener("load", () => {
    cookieBanner.show(cookieBanner);
  });
}
document.getElementById("cookieConsentAccept").addEventListener("click", () => {
  Cookies.set("cookieConsent", "true", { expires: 180 });
  Cookies.set("tutorialOptOut", "false", { expires: 180 });
  tutorialModal.show(tutorialModal);
});
document
  .getElementById("cookieConsentDismiss")
  .addEventListener("click", () => {
    console.log("hello");
    Cookies.remove("cookieConsent");
    Cookies.remove("tutorialOptOut");
    tutorialModal.show(tutorialModal);
  });

if (
  Cookies.get("tutorialOptOut") == "false" &&
  Cookies.get("cookieConsent") == "true"
) {
  window.addEventListener("load", () => {
    tutorialModal.show(tutorialModal);
  });
}
if (Cookies.get("tutorialOptOut") == "true") {
  optOutCheck.checked = true;
}
tutorialCloseButton.addEventListener("click", () => {
  if (optOutCheck.checked == true && Cookies.get("cookieConsent") == "true") {
    Cookies.set("tutorialOptOut", "true", { expires: 180 });
  } else if (Cookies.get("cookieConsent") == "true") {
    Cookies.set("tutorialOptOut", "false", { expires: 14 });
  }
});

//hide button controls on first and last slide
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
prevButton.style.display = "none";
document.addEventListener("slid.bs.carousel", () => {
  if (document.getElementById("firstSlide").classList.contains("active")) {
    prevButton.style.display = "none";
  } else if (
    document.getElementById("lastSlide").classList.contains("active")
  ) {
    nextButton.style.display = "none";
  } else {
    nextButton.style.display = "block";
    prevButton.style.display = "block";
  }
});

//reset tutorial on close
document.getElementById("tutorialModalClose").addEventListener("click", () => {
  tutorialCarousel.to(0);
});

// Add a output entry to show printing statements
function addPrintOutput() {
  // Check existsence of output entry for printing statements
  if ($("#output-print-area").length)
    return document.getElementById("output-print-area");
  return addNewDeletableOutputEntry(
    '<pre id="output-print-area" class="print-area"></pre>',
    "output-print-area",
    "Output"
  );
}
addPrintOutput();

function clearOutput() {
  if (
    confirm(
      "Everything in the Output-Column and the content of the CSV- and IOHAnalyzer-files will be deleted. \n Continue?"
    )
  ) {
    clearCSV();
    clearIOH();
    clearPlots();
    $("#output-column").empty();
  }
}

// Generates a new output entry containing
// - a shown outputContent as HTML-String
// - the id of the div with the outputContent in the future HTML file
// - the title of the output entry
// - an operation thats executed, when the user deletes the entry
// returns the html element inside of the output entry
//eslint-disable-next-line no-unused-vars -- will be used in future PR
function addNewDeletableOutputEntry(
  outputContent,
  outputContentID,
  title,
  deleteOperation = () => {},
  customOperations = [] // list of custom buttons in the form [{'name': name, 'operation': operation}]
) {
  let numOutput = $("#output-column > *").length;
  let buttonrow = "<div>";
  customOperations.forEach((operation) => {
    buttonrow += `<button id="${operation["name"]}-${title}-button" class="btn btn-outline-dark">${operation["text"]}</button>`;
  });
  buttonrow += `</div>`;
  let divString = `
  <div class="output-block" id="output-${numOutput}">
    <div class="output-header">
      <h3 class="output-heading" id="output-${numOutput}-heading">${title}</h3>
      <div class="output-header-buttons">
        <button class="btn btn-outline-dark" id="output-${numOutput}-hide-button">Hide</button>
        <button class="btn btn-outline-danger" id="output-${numOutput}-delete-button">Delete</button>
      </div>
    </div>
    <div id="output-${numOutput}-content">
      ${outputContent}
    </div>
    ${buttonrow}
  </div>`;
  $("#output-column").append(divString);

  // Add a button to toggle between showing and hiding the output entry
  $(`#output-${numOutput}-hide-button`).click(() => {
    let newButtonValue = "Show";
    if ($(`#output-${numOutput}-hide-button`).text() == "Show")
      newButtonValue = "Hide";
    $(`#output-${numOutput}-hide-button`).text(newButtonValue);
    $(`#output-${numOutput}-content`).slideToggle(300);
  });

  // Add a button to delete the entry
  $(`#output-${numOutput}-delete-button`).click(() => {
    deleteOperation();
    $(`#output-${numOutput}-content`).remove();
    $(`#output-${numOutput}`).hide();
  });

  customOperations.forEach((operation) => {
    $(`#${operation["name"]}-${title}-button`).click(() => {
      console.log("doing" + title + "button");
      operation["operation"]();
    });
  });
  // $(`#png-download-${title}-button`).click(() => {
  //   console.log("DownloadButton pressed");
  //   downloadImageOperation();
  // });
  // return document.getElementById(outputContentID);
}

function tryDownloadCSV() {
  if (hasEntriesCSV()) downloadCSV();
  else
    alert(
      "The CSV file is empty. Use the CSV-Block in logging to save data in it."
    );
}

function tryDownloadPlotsAsCSV() {
  if (hasPlotEntries()) downloadPlotsAsCSV();
  else
    alert(
      "There are no plots that can be downloaded. Use the plotting blocks to create one."
    );
}

function tryDownloadLog() {
  if (hasEntriesIOH()) downloadIOH();
  else alert("The IOHAnalyzer file is empty.");
}

export { addPrintOutput, addNewDeletableOutputEntry };
