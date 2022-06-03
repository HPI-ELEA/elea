// this function was taken from: https://stackoverflow.com/a/52829183
function downloadFile(blob, fileName) {
  const link = document.createElement("a");
  // create a blobURI pointing to our Blob
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  // some browser needs the anchor to be in the doc
  document.body.append(link);
  link.click();
  link.remove();
  // in case the Blob uses a lot of memory
  setTimeout(() => URL.revokeObjectURL(link.href), 7000);
}

function saveFileNode(nodebuffer, fileName) {
  //eslint-disable-next-line no-undef -- is imported in nodejs env
  fs.writeFile(fileName, nodebuffer, function (e) {
    if (e) return console.error(e);
  });
}

async function readFile(path) {
  let response = await fetch(path);
  if (!response.ok) return false;
  return await response.text();
}

function copyToClipboard(str) {
  const el = document.createElement("textarea");
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

export { downloadFile, saveFileNode, copyToClipboard, readFile };
