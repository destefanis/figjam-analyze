import * as React from "react";
import "../styles/figma-plugin-ds.css";
import "../styles/ui.css";
import "../styles/controls.css";
import "../styles/empty-state.css";

declare function require(path: string): any;

const App = ({}) => {
  const [selectedLayersLength, setSelectLayersLength] = React.useState(0);

  const onRunApp = React.useCallback(() => {
    const message = "";
    parent.postMessage({ pluginMessage: { type: "run-app", message } }, "*");
  }, []);

  const convertTextLayers = React.useCallback(() => {
    const message = "convert-layers";
    parent.postMessage(
      { pluginMessage: { type: "button-clicked", message } },
      "*"
    );
  }, []);

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
      }
    };
  }, []);

  return (
    <div className="wrapper">
      {selectedLayersLength === 0 ? (
        <div className="empty-state">
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
        </div>
      ) : (
        <React.Fragment>
          <div className="active-state">
            {/* <h3 className="active-state-title type type--pos-large-medium">
              You have {selectedLayersLength} text layers selected to convert.
            </h3> */}

            <div className="card-wrapper">
              <div className="card">
                <div className="card-content" onClick={convertTextLayers}>
                  <img
                    className="layer-icon"
                    src={require("../assets/convert-layers.svg")}
                  />
                  <h3 className=" type type--pos-large-medium">
                    Turn selected text layers into stickys
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
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default App;
