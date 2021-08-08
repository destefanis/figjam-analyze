// Plugin window dimensions
figma.showUI(__html__, { width: 320, height: 407 });

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
        message: "empty"
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

  if (msg.type === "close-app") {
    figma.closePlugin();
  }

  // When a button is clicked
  if (msg.type === "button-clicked") {
    const selection = figma.currentPage.selection;
    let x = selection[0].x;
    let y = selection[0].y;

    if (msg.message === "convert-layers") {
      selection.map(selected => convertToSticky(selected, x, y));
    }

    if (msg.message === "convert-paragraph") {
      selection.map(selected => convertParagraph(selected, x, y));
    }

    async function convertToSticky(node, x, y) {
      if (node.type === "TEXT") {
        let newSticky = figma.createSticky();
        newSticky.x = x + 200;
        newSticky.y = y + 200;
        newSticky.text.characters = node.characters;

        setTimeout(function() {
          figma.ui.postMessage({
            type: "complete",
            message: "complete"
          });
        }, 500);
      } else {
        return;
      }
    }

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async function convertParagraph(node, x, y) {
      if (node.type === "TEXT") {
        let textToConvert = [];
        let existingString = node.characters;
        let splitLines = existingString.split("\n");
        let stackXAxis = 0;

        splitLines.forEach(string => {
          if (string !== "") {
            if (string.match(/[^\.!\?]+[\.!\?]+/g)) {
              let splitSentences = string.match(/[^\.!\?]+[\.!\?]+/g);
              textToConvert.push(...splitSentences);
            } else {
              let newSticky = figma.createSticky();
              newSticky.x = x + getRandomInt(200, 400);
              newSticky.y = y + getRandomInt(200, 400);
              newSticky.text.characters = string;
              // todo Bring to front or make  into  grid
            }
          }
        });

        textToConvert.forEach(sentence => {
          let trimSentence = sentence.trim();
          let newSticky = figma.createSticky();
          newSticky.x = x + getRandomInt(200, 400);
          newSticky.y = y + getRandomInt(200, 400);
          newSticky.text.characters = trimSentence;
        });
      }

      setTimeout(function() {
        figma.ui.postMessage({
          type: "complete",
          message: "complete"
        });
      }, 500);
    }

    figma.notify(`Stickys Created 🎉`, { timeout: 1000 });
  }
};
