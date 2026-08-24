"use client";

import { useEffect } from "react";

export default function UiFixes() {
  useEffect(() => {
    const wire = () => {
      const buttons = Array.from(document.querySelectorAll("button"));

      buttons.forEach((button) => {
        const text = (button.textContent || "").replace(/\s+/g, " ").trim();

        // Remove the duplicate top-right action and the duplicate bottom posting action.
        if (button.closest(".actions") && text === "I offer a service") {
          (button as HTMLElement).style.display = "none";
          return;
        }

        if (button.classList.contains("post-button")) {
          (button as HTMLElement).style.display = "none";
          return;
        }

        // The two main choices are the single entry points for posting.
        if (text === "➕ I need something" || text === "I need something") {
          if (!(button as HTMLElement).dataset.kzWired) {
            (button as HTMLElement).dataset.kzWired = "1";
            button.addEventListener("click", (event) => {
              event.preventDefault();
              event.stopImmediatePropagation();
              window.location.href = "/need-service";
            }, true);
          }
        }

        if (text === "🛠️ I offer a service" || text === "I offer a service") {
          if (!(button as HTMLElement).dataset.kzWired) {
            (button as HTMLElement).dataset.kzWired = "1";
            button.addEventListener("click", (event) => {
              event.preventDefault();
              event.stopImmediatePropagation();
              window.location.href = "/offer-service";
            }, true);
          }
        }
      });
    };

    wire();
    const observer = new MutationObserver(wire);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
