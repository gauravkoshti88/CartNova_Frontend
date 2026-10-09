import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    const base = "CartNova";
    document.title = title
      ? `${title} — ${base}`
      : `${base} — Shop Smarter, Live Better`;
    return () => {
      const el = document.querySelector("title[data-default]");
      if (el) document.title = el.textContent;
    };
  }, [title]);
}
