import React from "react";
import ReactDOM from "react-dom/client"; // Note the change here
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import "./index.css"; // If you have global styles

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Create a root

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error(
    "Root element not found. Ensure that the element with id 'root' exists in your HTML."
  );
}
