import * as React from "react";
import { motion, AnimateSharedLayout } from "framer-motion";
import "../styles/figma-plugin-ds.css";
import "../styles/ui.css";
import "../styles/controls.css";
import "../styles/empty-state.css";

declare function require(path: string): any;

const App = ({}) => {
  const [selectedLayersLength, setSelectLayersLength] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);

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
  const convertTextLayers = React.useCallback(() => {
    const message = "convert-layers";
    parent.postMessage(
      { pluginMessage: { type: "button-clicked", message } },
      "*"
    );
  }, []);

  // Message to controller to convert paragraph into stickys.
  const convertParagraph = React.useCallback(() => {
    const message = "convert-paragraph";
    parent.postMessage(
      { pluginMessage: { type: "button-clicked", message } },
      "*"
    );
  }, []);

  React.useEffect(() => {
    onRunApp();

    window.onmessage = event => {
      const { type, message } = event.data.pluginMessage;

      if (type === "selection-updated") {
        if (message === "empty") {
          setSelectLayersLength(0);
        } else {
          let nodeArray = JSON.parse(message);
          setSelectLayersLength(nodeArray.length);
        }
      } else if (type === "complete") {
        setIsComplete(true);
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
                src={require("../assets/convert.svg")}
              />
              <h3 className="type type--pos-large-medium">
                Select a text layer(s) first and hit start.
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
                  <img
                    className="layer-icon"
                    src={require("../assets/success.svg")}
                  />
                  <h3 className="type type--pos-large-medium">
                    Stickys created!
                  </h3>
                </div>
                <button
                  className="button button--primary button-margin-top"
                  onClick={onRunApp}
                >
                  Start again
                </button>
                <button
                  className="button button--secondary button-margin-top"
                  onClick={onCloseApp}
                >
                  Close plugin
                </button>
              </motion.div>
            ) : (
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
                    <div className="card-content" onClick={convertTextLayers}>
                      <img
                        className="layer-icon"
                        src={require("../assets/convert-layers.svg")}
                      />
                      <h3 className=" type type--pos-large-medium">
                        Create stickys from text layers
                      </h3>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-content" onClick={convertParagraph}>
                      <img
                        className="layer-icon"
                        src={require("../assets/convert.svg")}
                      />
                      <h3 className=" type type--pos-large-medium">
                        Turn paragraph into stickys
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </React.Fragment>
        )}
      </AnimateSharedLayout>
    </div>
  );
};

export default App;
