import * as Blockly from "blockly";
import { workspace } from "./blocklyHandling";
var HAS_UNSAVED_CHANGES = false;
const CHANGE_OPERATIONS = [
  Blockly.Events.BLOCK_CHANGE,
  Blockly.Events.BLOCK_CREATE,
  Blockly.Events.BLOCK_DELETE,
  Blockly.Events.BLOCK_MOVE,
  Blockly.Events.VAR_CREATE,
  Blockly.Events.VAR_DELETE,
  Blockly.Events.VAR_RENAME,
  Blockly.Events.COMMENT_CREATE,
  Blockly.Events.COMMENT_DELETE,
  Blockly.Events.COMMENT_CHANGE,
  Blockly.Events.COMMENT_MOVE,
];
function unsavedChangesListener(event) {
  if (CHANGE_OPERATIONS.includes(event.type)) {
    HAS_UNSAVED_CHANGES = true;
    workspace.removeChangeListener(unsavedChangesListener);
    window.addEventListener("beforeunload", beforeUnloadListener);
    let workspaceTitle = document.getElementById("workspace-title").innerHTML;
    document.getElementById("workspace-title").innerHTML = workspaceTitle + "*";
    console.warn("Workspace has unsaved changes now");
  }
}

function beforeUnloadListener(e) {
  e.preventDefault();
  return (e.returnValue = "Are you sure you want to exit without saving?");
}

function resetHasUnsavedChanges(finishedLoading = false) {
  if (HAS_UNSAVED_CHANGES | finishedLoading) {
    HAS_UNSAVED_CHANGES = false;
    workspace.addChangeListener(unsavedChangesListener);
    window.removeEventListener("beforeunload", beforeUnloadListener);
    let workspaceTitle = document.getElementById("workspace-title").innerHTML;
    document.getElementById("workspace-title").innerHTML =
      workspaceTitle.replace(/\*$/, "");
    console.warn("Workspace has no unsaved changes now");
  }
}

function waitForFinishedLoading(event) {
  if (event.type == Blockly.Events.FINISHED_LOADING) {
    resetHasUnsavedChanges(true);
    workspace.removeChangeListener(waitForFinishedLoading);
  }
}

export { resetHasUnsavedChanges, waitForFinishedLoading };
