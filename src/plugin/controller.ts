// Plugin window dimensions
figma.showUI(__html__, { width: 320, height: 348 });

// Utility function for serializing nodes to pass back to the UI.
function serializeNodes(nodes) {
  let serializedNodes = JSON.stringify(nodes, [
    "name",
    "type",
    "children",
    "id"
  ]);

  return serializedNodes;
}

// Utility function for flattening the
// selection of nodes in Figma into an array.
const flatten = obj => {
  const array = Array.isArray(obj) ? obj : [obj];
  return array.reduce((acc, value) => {
    acc.push(value);
    if (value.children) {
      acc = acc.concat(flatten(value.children));
      delete value.children;
    }
    return acc;
  }, []);
};

figma.ui.onmessage = async msg => {
  // Load our fonts first.
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });

  if (msg.type === "run-app") {
    // If nothing's selected, we tell the UI to keep the empty state.
    if (figma.currentPage.selection.length === 0) {
      figma.ui.postMessage({
        type: "selection-updated",
        message: "empty"
      });
    } else {
      let selectedNodes = flatten(figma.currentPage.selection);

      // Pass the selection back to the UI, we don't render it
      // but we check for how many items are selected.
      figma.ui.postMessage({
        type: "selection-updated",
        message: serializeNodes(selectedNodes)
      });
    }
  }

  if (msg.type === "close-app") {
    figma.closePlugin();
  }

  // When the API call is complete and we want to add
  // the summary near the group of stickys.
  if (msg.type === "add-summary") {
    const selection = figma.currentPage.selection;
    let x = selection[selection.length - 1].x;
    let y = selection[0].y;
    createText(msg.message, x, y);
  }

  // When a button is clicked
  if (msg.type === "button-clicked") {
    const selection = figma.currentPage.selection;
    let textCombinedFromStickys = [];
    let selectedNodeIds = [];

    // For each sticky note, check to see if it's a complete sentence.
    // if not, add a period so we send more accurate sentences to
    // the summarization API.
    if (msg.message === "summarize-layers") {
      selection.forEach(function(node, index) {
        if (node.type === "STICKY") {
          let stickyText = node.text.characters;

          if (stickyText.match(/[^\.!\?]+[\.!\?]+/g)) {
            textCombinedFromStickys.push(stickyText);
          } else {
            let newFullSentence = stickyText + ".";
            textCombinedFromStickys.push(newFullSentence);
          }

          selectedNodeIds.push(node.id);
        }
      });
    }

    // Combine all the strings into one paragraph.
    let textToAnalyze = textCombinedFromStickys.join(" ");

    setTimeout(function() {
      figma.ui.postMessage({
        type: "ready",
        message: textToAnalyze,
        ids: selectedNodeIds
      });
    }, 500);
  }

  // Add the summary as a text layer.
  async function createText(message, x, y) {
    let layerArray = [];
    let newTextLayer = figma.createText();
    let lineHeight = {};
    lineHeight.unit = "PIXELS";
    lineHeight.value = 28;
    let characterLength;

    newTextLayer.x = x + 280;
    newTextLayer.y = y;
    newTextLayer.fontSize = 24;
    newTextLayer.characters = message;
    newTextLayer.resize(400, 120);

    characterLength = message.length;
    newTextLayer.setRangeLineHeight(0, characterLength, lineHeight);
    newTextLayer.textAutoResize = "HEIGHT";
    layerArray.push(newTextLayer);
    figma.viewport.scrollAndZoomIntoView(layerArray);
  }
  // figma.notify(`Stickys Created 🎉`, { timeout: 1000 });
};
