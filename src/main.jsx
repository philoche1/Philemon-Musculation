import React from "react";
import ReactDOM from "react-dom/client";
import { storage } from "./lib/storage.js";
import App from "./App.jsx";
import "./index.css";

// The App component (copied from the Claude artifact) calls window.storage.*
// exactly like it does inside Claude.ai. We just provide a real
// implementation of that same interface here, backed by Supabase + localStorage.
window.storage = storage;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
