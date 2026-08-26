"use client";

import { useEffect } from "react";

export default function ProfileVisibilityFix() {
  useEffect(() => {
    const id = "kazi-profile-visibility-fix";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      /* Keep the landing panel above Leaflet's map panes. */
      .map { z-index: 1 !important; }
      .panel {
        z-index: 10000 !important;
        position: absolute !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        scrollbar-width: thin !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      .list {
        display: flex !important;
        flex-direction: column !important;
        visibility: visible !important;
        opacity: 1 !important;
        min-height: 1px !important;
      }
      .person {
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        min-height: 68px !important;
        width: 100% !important;
        flex: 0 0 auto !important;
      }
      .person .avatar {
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        flex: 0 0 48px !important;
        width: 48px !important;
        height: 48px !important;
        overflow: hidden !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .person .avatar img {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }
      .person-main {
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        flex: 1 1 auto !important;
        min-width: 0 !important;
        flex-direction: column !important;
      }
      .person .status {
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        flex-direction: column !important;
        flex: 0 0 auto !important;
      }
      .more {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }

      @media (min-width: 900px) {
        .panel .hero { padding-bottom: 8px !important; }
        .panel .hero h1 { margin: 0 0 6px !important; }
        .panel .hero p { margin: 0 !important; line-height: 1.25 !important; }
        .panel .tabs { margin-top: 8px !important; }
        .panel .big-actions { margin: 8px 0 !important; }
        .panel .field { margin: 7px 0 !important; }
        .panel .chips { gap: 5px !important; margin: 7px 0 !important; }
        .panel h3 { margin: 10px 0 6px !important; }
        .panel .list { gap: 5px !important; }
        .panel .person { padding: 7px !important; }
      }
    `;
    document.head.appendChild(style);

    return () => style.remove();
  }, []);

  return null;
}
