(() => {
  const PAID_HREF = "help.x.com/rules-and-policies/paid-partnerships-policy";
  const HIDDEN_ATTR = "data-paid-promo-hidden";
  const AD_LABELS = new Set(["Ad", "Promoted", "Promoted Tweet"]);

  const findTweetRoot = (el) => {
    return (
      el.closest('[data-testid="placementTracking"]') ||
      el.closest('article[data-testid="tweet"]') ||
      el.closest("article") ||
      el.closest('[data-testid="cellInnerDiv"]')
    );
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

  const scanArticleForAdLabel = (article) => {
    const spans = article.querySelectorAll('[data-testid="User-Name"] span, header span, div[dir="ltr"] > span > span');
    for (const span of spans) {
      if (isAdLabelSpan(span)) return true;
    }
    return false;
  };

  const scan = (root) => {
    if (!(root instanceof Element || root instanceof Document)) return;

    for (const node of root.querySelectorAll('[data-testid="placementTracking"]')) {
      hideTweet(node);
    }

    for (const link of root.querySelectorAll(`a[href*="${PAID_HREF}"]`)) {
      hideTweet(findTweetRoot(link));
    }

    const articles = root.querySelectorAll('article[data-testid="tweet"]');
    for (const article of articles) {
      if (article.hasAttribute(HIDDEN_ATTR)) continue;
      if (scanArticleForAdLabel(article)) hideTweet(findTweetRoot(article));
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
