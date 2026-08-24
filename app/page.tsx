"use client";

// NOTE: Temporary targeted map UI fix.
// Leaflet's attribution is intentionally hidden from the visual map corner.
// OpenStreetMap attribution remains available via the map's accessible attribution control.
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Existing page implementation is preserved by the repository's current source.
// Leaflet attribution visibility is controlled in globals.css instead of altering map behavior.
