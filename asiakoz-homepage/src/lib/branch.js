const rawBranch = (import.meta.env.VITE_BRANCH || "shymkent").toLowerCase();

export const BRANCH = rawBranch === "aqtau" ? "aqtau" : "shymkent";

export const IS_AQTAU = BRANCH === "aqtau";
