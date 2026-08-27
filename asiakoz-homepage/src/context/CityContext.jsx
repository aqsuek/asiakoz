import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  CITY_STORAGE_KEY,
  DEFAULT_BRANCH_ID,
  NETWORK_BRANCHES,
  getNetworkBranch,
  isComingSoon as branchIsComingSoon,
} from "../data/branches";
import { IS_HOME } from "../lib/branch";
import { trackEvent } from "../lib/analytics";

const CityContext = createContext(null);

function readStoredCity() {
  try {
    const saved = localStorage.getItem(CITY_STORAGE_KEY);
    if (NETWORK_BRANCHES.some((b) => b.id === saved)) return saved;
  } catch {
    /* ignore */
  }
  return null;
}

export function CityProvider({ children }) {
  const [cityId, setCityIdState] = useState(() =>
    IS_HOME ? readStoredCity() || DEFAULT_BRANCH_ID : DEFAULT_BRANCH_ID,
  );

  useEffect(() => {
    if (!IS_HOME) return;
    try {
      if (cityId) localStorage.setItem(CITY_STORAGE_KEY, cityId);
    } catch {
      /* ignore */
    }
  }, [cityId]);

  const setCityId = (nextId) => {
    if (!NETWORK_BRANCHES.some((b) => b.id === nextId)) return;
    setCityIdState((prev) => {
      if (prev === nextId) return prev;
      trackEvent("branch_select", {
        branch: nextId,
        city: nextId,
        page_url: typeof window !== "undefined" ? window.location.href : "",
      });
      return nextId;
    });
  };

  const branch = useMemo(() => getNetworkBranch(cityId), [cityId]);

  const value = useMemo(
    () => ({
      cityId,
      setCityId,
      branch,
      branches: NETWORK_BRANCHES,
      isComingSoon: branchIsComingSoon(branch),
    }),
    [cityId, branch],
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) {
    return {
      cityId: DEFAULT_BRANCH_ID,
      setCityId: () => {},
      branch: getNetworkBranch(DEFAULT_BRANCH_ID),
      branches: NETWORK_BRANCHES,
      isComingSoon: false,
    };
  }
  return ctx;
}
