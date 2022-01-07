import {
  runCode,
  terminateWorker,
  clearOutput,
} from "./modules/blocklyHandling";
import { loadExample } from "./modules/exampleHandling";
import { selectedFileChanged, promptForXML } from "./modules/import";
import {
  copyJSToClipboard,
  copyXMLToClipboard,
  downloadWorkspace,
  downloadWorkspaceAsJS,
} from "./modules/export";
import { downloadLog } from "./modules/logging";
import { highlightAll } from "prismjs";
import $ from "jquery";

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
$("#example-onelambda").click(() => {});
$("#example-multithread").click(() => loadExample("multithread"));
$("#example-full-multithread").click(() => loadExample("full_multithread"));
$("#example-multithread-performance").click(() =>
  loadExample("multithread-performance")
);

$("#upload_xml").click(() => $("#upload_xml_input").click());
$("#upload_xml_input").change(selectedFileChanged);
$("#promt_for_xml").click(promptForXML);
$("#download_xml").click(downloadWorkspace);
$("#copy_xml").click(copyXMLToClipboard);
$("#download_js").click(downloadWorkspaceAsJS);
$("#copy_js").click(copyJSToClipboard);
$("#show_js").click(highlightAll);
$("#download_json").click(downloadLog);

$(".dropdown-menu>a").on("click", function () {
  $(".navbar-collapse").removeClass("show");
});
