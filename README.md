# X Ad & Paid Promotion Blocker

A tiny Chrome extension that hides promoted ads and paid-partnership tweets on X/Twitter.

## What it blocks

1. **Promoted ads** — tweets wrapped in X's `[data-testid="placementTracking"]` ad slot.
2. **Paid Partnership tweets** — tweets containing a link to X's paid-partnerships policy page.
3. **"Ad" / "Promoted" labels** — tweets whose header contains a standalone `Ad`, `Promoted`, or `Promoted Tweet` label, as a fallback when the ad-slot wrapper isn't present.

Hidden tweets get `data-paid-promo-hidden="1"` on their root node so you can verify in DevTools.

## How it works

A content script runs on `x.com` and `twitter.com` (incl. mobile subdomains) at `document_start`. It scans the DOM on load and watches for new tweets via `MutationObserver` as you scroll, hiding matches with `display: none`. No permissions, no network calls, no storage.

## Install

**AVAILABLE ON THE CHROME WEB STORE!**

1. Open `chrome://extensions`.
2. Toggle **Developer mode** on (top right).
3. Click **Load unpacked** and select this folder.
4. Reload any open X tab.

To update after editing files, hit the refresh icon on the extension's card and reload the X tab.
