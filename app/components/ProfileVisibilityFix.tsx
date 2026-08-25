"use client";

import { useEffect } from "react";

export default function ProfileVisibilityFix() {
  useEffect(() => {
    const id = "kazi-profile-visibility-fix";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .panel { overflow-y: auto !important; overflow-x: hidden !important; }
      .list { display: flex !important; flex-direction: column !important; visibility: visible !important; opacity: 1 !important; }
      .person { display: flex !important; visibility: visible !important; opacity: 1 !important; min-height: 76px !important; width: 100% !important; }
      .person .avatar { display: flex !important; visibility: visible !important; opacity: 1 !important; flex: 0 0 48px !important; width: 48px !important; height: 48px !important; overflow: hidden !important; }
      .person .avatar img { display: block !important; visibility: visible !important; opacity: 1 !important; width: 100% !important; height: 100% !important; object-fit: cover !important; }
      .person-main { display: flex !important; visibility: visible !important; opacity: 1 !important; flex: 1 1 auto !important; min-width: 0 !important; }
      .person .status { display: flex !important; visibility: visible !important; opacity: 1 !important; flex-direction: column !important; }
      .more { display: block !important; visibility: visible !important; opacity: 1 !important; }
    `;
    document.head.appendChild(style);
  }, []);

  return null;
}
