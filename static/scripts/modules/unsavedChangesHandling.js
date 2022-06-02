import * as Blockly from "blockly";
import { workspace } from "./blocklyHandling";

var HAS_UNSAVED_CHANGES = false;

// Change operations of Blockly that indicates an relevant one
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

// This function waits for a relevant change
// and updates the status, indicator for unsaved changes
// and sets up an listener for unloading the workspace.
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

// If the user loads a new workspace or leaves the page,
// this function asks the user if they want to discard
// unsaved changes
function beforeUnloadListener(e) {
  e.preventDefault();
  return (e.returnValue = "Are you sure you want to exit without saving?");
}

// when the user saves the workspace or the workspace was loaded,
// this function resets the "unsaved changes"-indicator.
function resetHasUnsavedChangesHandling(finishedLoading = false) {
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

// changes that happen when the workspace was loaded shouldn't
// be recognized as changes by the user. That's why the detection
// for unsaved changes will be suspended until the workspace was loaded.
// This function initiates the listener for unsaved changes
// after the workspace was loaded.
function waitForFinishedLoading(event) {
  if (event.type == Blockly.Events.FINISHED_LOADING) {
    resetHasUnsavedChangesHandling(true);
    workspace.removeChangeListener(waitForFinishedLoading);
  }
}

// changes, that happens when the workspace was loaded, shouldn't
// be recognized as changes by the user. That's why the detection
// for unsaved changes will be suspended until the workspace was loaded.
// This function sets up a listener for this event.
function setupUnsavedChangesHandling() {
  workspace.addChangeListener(waitForFinishedLoading);
}

export {
  HAS_UNSAVED_CHANGES,
  resetHasUnsavedChangesHandling,
  setupUnsavedChangesHandling,
};
