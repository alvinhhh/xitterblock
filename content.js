(() => {
  const PAID_HREF = "help.x.com/rules-and-policies/paid-partnerships-policy";
  const HIDDEN_ATTR = "data-paid-promo-hidden";
  const AD_LABELS = new Set(["Ad", "Promoted", "Promoted Tweet"]);

  // Walk up from a matched element to the largest reasonable tweet container.
  // Prefer placementTracking only if it CONTAINS the article (i.e. it really is the ad wrapper),
  // otherwise fall back to the tweet article or cell.
  const findTweetRoot = (el) => {
    const article =
      el.closest('article[data-testid="tweet"]') || el.closest("article");
    const cell = el.closest('[data-testid="cellInnerDiv"]');
    const placement = el.closest('[data-testid="placementTracking"]');
    if (placement && article && placement.contains(article)) return placement;
    return article || cell || placement;
  };

  const hideTweet = (root) => {
    if (!root || root.hasAttribute(HIDDEN_ATTR)) return;
    root.setAttribute(HIDDEN_ATTR, "1");
    root.style.display = "none";
  };

  const isAdLabelSpan = (span) => {
    if (span.childElementCount !== 0) return false;
    const text = (span.textContent || "").trim();
    return AD_LABELS.has(text);
  };

  const articleHasAdLabel = (article) => {
    // Restrict to the tweet header / user-name region so we don't match the body text.
    const headerScopes = article.querySelectorAll('[data-testid="User-Name"]');
    const scopes = headerScopes.length ? headerScopes : [article];
    for (const scope of scopes) {
      for (const span of scope.querySelectorAll("span")) {
        if (isAdLabelSpan(span)) return true;
      }
    }
    return false;
  };

  const scan = (root) => {
    if (!(root instanceof Element || root instanceof Document)) return;

    // 1. Paid-partnership link → hide containing tweet.
    for (const link of root.querySelectorAll(`a[href*="${PAID_HREF}"]`)) {
      hideTweet(findTweetRoot(link));
    }

    // 2. "Ad" / "Promoted" label in the tweet header → hide containing tweet.
    for (const article of root.querySelectorAll('article[data-testid="tweet"]')) {
      if (article.hasAttribute(HIDDEN_ATTR)) continue;
      if (articleHasAdLabel(article)) hideTweet(findTweetRoot(article));
    }
  };

  const start = () => {
    scan(document);
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          scan(node);
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
