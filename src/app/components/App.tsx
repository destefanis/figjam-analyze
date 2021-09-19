import * as React from "react";
import { motion, AnimateSharedLayout } from "framer-motion";
import axios from "axios";
import Preloader from "./Preloader";
import "../styles/figma-plugin-ds.css";
import "../styles/ui.css";
import "../styles/controls.css";
import "../styles/empty-state.css";

declare function require(path: string): any;

const App = ({}) => {
  const [selectedLayersLength, setSelectLayersLength] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectionLength, setSelectionLength] = React.useState(0);
  const [summary, setSummary] = React.useState("");

  // Initial running of the app
  const onRunApp = React.useCallback(() => {
    const message = "";
    setIsComplete(false);
    parent.postMessage({ pluginMessage: { type: "run-app", message } }, "*");
  }, []);

  // Close the  plugin
  const onCloseApp = React.useCallback(() => {
    const message = "";
    parent.postMessage({ pluginMessage: { type: "close-app", message } }, "*");
  }, []);

  // Message to controller to convert text layers into stickys.
  const summarizeSelection = React.useCallback(() => {
    const message = "summarize-layers";
    console.log("clicked");

    parent.postMessage(
      { pluginMessage: { type: "button-clicked", message } },
      "*"
    );
  }, []);

  // Message to the controller to add the summary as a text layer.
  const addSummary = React.useCallback(message => {
    parent.postMessage(
      { pluginMessage: { type: "add-summary", message } },
      "*"
    );
  }, []);

  React.useEffect(() => {
    onRunApp();

    window.onmessage = event => {
      const { type, message, ids } = event.data.pluginMessage;

      if (type === "selection-updated") {
        if (message === "empty") {
          setSelectLayersLength(0);
        } else {
          let nodeArray = JSON.parse(message);
          setSelectLayersLength(nodeArray.length);
        }
      } else if (type === "ready") {
        setIsLoading(true);
        let numberOfSentences = 1;

        // Change length of summary
        // depending on how many stickys were selected
        if (ids.length >= 6) {
          numberOfSentences = 1;
        } else if (ids.length >= 12) {
          numberOfSentences = 1;
        } else {
          numberOfSentences = 1;
        }

        const options = {
          method: "POST",
          url: "https://gpt-summarization.p.rapidapi.com/summarize",
          headers: {
            "content-type": "application/json",
            "x-rapidapi-host": "gpt-summarization.p.rapidapi.com",
            "x-rapidapi-key": "YOUR_API_KEY_HERE"
          },
          data: { text: message, num_sentences: numberOfSentences }
        };

        console.log(message);

        axios
          .request(options)
          .then(function(response) {
            // console.log(response.data);
            if (response.data.summary === ".") {
              setIsLoading(false);
            } else {
              setIsLoading(false);
              setIsComplete(true);
              setSummary(response.data.summary);
              setSelectionLength(ids.length);
              addSummary(response.data.summary);
            }
          })
          .catch(function(error) {
            setIsLoading(false);
          });
      }
    };
  }, []);

  return (
    <div className="wrapper">
      <AnimateSharedLayout>
        {selectedLayersLength === 0 ? (
          <motion.div
            className="empty-state"
            key="empty"
            layout
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
          >
            <div className="empty-state-content">
              <img
                className="layer-icon"
                src={require("../assets/empty-state.svg")}
              />
              <h3 className="type type--pos-large-medium">
                Select sticky notes and hit start.
              </h3>
            </div>
            <button
              className="button button--primary button-margin-top"
              onClick={onRunApp}
            >
              Start
            </button>
          </motion.div>
        ) : (
          <React.Fragment>
            {isComplete ? (
              <motion.div
                className="empty-state"
                key="empty"
                layout
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
              >
                <div className="empty-state-content">
                  <h5 className="summary-label">
                    Summary of {selectionLength} stickys
                  </h5>
                  <h3 className="type type--pos-large-medium summary-title">
                    {summary}
                  </h3>
                </div>
                <button
                  className="button button--primary button-margin-top"
                  onClick={onRunApp}
                >
                  Run Again
                </button>
                <button
                  className="button button--secondary button-margin-top"
                  onClick={onCloseApp}
                >
                  Close plugin
                </button>
              </motion.div>
            ) : (
              <React.Fragment>
                {isLoading ? (
                  <React.Fragment>
                    <Preloader />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <motion.div
                      className="active-state"
                      key="active"
                      layout
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -40, opacity: 0 }}
                    >
                      <div className="card-wrapper">
                        <div className="card">
                          <div
                            className="card-content"
                            onClick={summarizeSelection}
                          >
                            <img
                              className="layer-icon"
                              src={require("../assets/summarize-layers.svg")}
                            />
                            <h3 className=" type type--pos-large-medium">
                              Summarize
                            </h3>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </AnimateSharedLayout>
    </div>
  );
};

export default App;
