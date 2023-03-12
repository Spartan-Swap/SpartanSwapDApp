export const parseLocalStorage = (lsStringId: string, fallbackObject?: any) => {
  if (typeof window !== "undefined") {
    const lsItem = window.localStorage.getItem(lsStringId);
    if (lsItem) {
      return JSON.parse(lsItem);
    }
  }
  return fallbackObject ?? {};
};

export const setLocalStorage = (lsStringId: string, object: any) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(lsStringId, typeof object !== "string" ? JSON.stringify(object) : object);
  }
  return;
};
