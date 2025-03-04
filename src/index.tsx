import { createRoot } from "react-dom/client";
import { App } from "./app";

createRoot(document.querySelector("div[data-id='app']")!).render(<App />);
