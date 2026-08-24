"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

// TEMPORARY SYNTAX FIX: root return is wrapped in a fragment so the
// form overlays can be siblings of the main app container.
