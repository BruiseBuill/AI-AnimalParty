import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { platformRuntime } from "./platform/runtime";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>,
);

if (!platformRuntime.isNativeApp && "serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // 离线能力注册失败不会影响普通网页使用。
    });
  });
}
