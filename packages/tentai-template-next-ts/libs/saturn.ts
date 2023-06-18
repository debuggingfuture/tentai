// use gateway before we got bette nodejs client for server retrieval
export const fetchWithSaturn = (url: string) => {
  if (IS_DEV || typeof window === "undefined") {
    if (url.startsWith("/ipfs/")) {
      return fetch("https://ipfs.io" + url);
    }
  }
  // original fetch will fall through to service worker
  return fetch(url);
};
