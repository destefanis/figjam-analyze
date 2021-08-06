// Plugin window dimensions
figma.showUI(__html__, { width: 320, height: 358 });

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
  // Load our fonts first, load your own brand fonts here.
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });

  if (msg.type === "run-app") {
    // If nothing's selected, we tell the UI to keep the empty state.
    if (figma.currentPage.selection.length === 0) {
      figma.ui.postMessage({
        type: "selection-updated",
        message: 0
      });
    } else {
      let selectedNodes = flatten(figma.currentPage.selection);

      // Update the UI with the number of selected nodes.
      figma.ui.postMessage({
        type: "selection-updated",
        message: serializeNodes(selectedNodes)
      });
    }
  }

  // When a button is clicked
  if (msg.type === "button-clicked") {
    const selection = figma.currentPage.selection;

    if (msg.message === "convert-layers") {
      selection.map(selected => convertToSticky(selected));
    }

    if (msg.message === "convert-paragraph") {
      // nodesToTheme.map(selected => updateTheme(selected, lightTheme));
    }

    async function convertToSticky(node) {
      // await figma.loadFontAsync({ family: "Inter", style: "Medium" })

      if (node.type === "TEXT") {
        let newSticky = figma.createSticky();
        // await figma.loadFontAsync(newSticky.text.fontName)
        newSticky.text.characters = node.characters;
      } else {
        return;
      }
    }

    // Need to wait for some promises to resolve before
    // sending the skipped layers back to the UI.
    // setTimeout(function() {
    //   figma.ui.postMessage({
    //     type: "layers-skipped",
    //     message: serializeNodes(skippedLayers)
    //   });
    // }, 500);

    figma.notify(`Stickys Created 🎉`, { timeout: 750 });
  }
};
