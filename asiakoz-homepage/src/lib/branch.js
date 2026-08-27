const rawBranch = (import.meta.env.VITE_BRANCH || "shymkent").toLowerCase();

const BRANCHES = new Set(["shymkent", "aqtau", "laser", "almaty", "home"]);

export const BRANCH = BRANCHES.has(rawBranch) ? rawBranch : "shymkent";

export const IS_AQTAU = BRANCH === "aqtau";
export const IS_LASER = BRANCH === "laser";
export const IS_ALMATY = BRANCH === "almaty";
export const IS_HOME = BRANCH === "home";

/** Default city when nothing is stored yet. */
export function branchDefaultCityId() {
  if (IS_ALMATY || IS_LASER) return "almaty";
  if (IS_AQTAU) return "aqtau";
  if (BRANCH === "shymkent") return "shymkent";
  return "almaty";
}
