# Excelsior Soldier Financial Manager

A mobile-friendly, browser-based demonstration of a debt snowball and savings planner, converted from a Google Apps Script HTML application.

## Current features
- Debt accounts (credit cards, loans, mortgages)
- Additional-payment sliders and payoff visualizations
- Debt snowball projection and payoff sequence
- Savings goals and sinking funds
- Charts powered by Chart.js CDN

## Publish with GitHub Pages
1. Create or open a GitHub repository.
2. Upload `index.html` and `.nojekyll` to the repository root (you may also upload this README).
3. Commit the files.
4. Open **Settings → Pages**.
5. Choose **Deploy from a branch**, `main`, `/(root)`, and **Save**.
6. Open the published Pages URL when deployment finishes.

## Privacy and security — read before sharing
- The app saves financial entries and the soldier name using **browser localStorage**, not Google Sheets or a secure account. The label `Saved` does **not** mean cloud synchronization.
- **Do not use real sensitive financial data** in this demonstration. Local browser storage is not encrypted by the app, is device/browser specific, and can be lost or accessed by others with access to that browser/profile.
- The initial sample records and soldier name are fictitious examples.
- There is no sign-in, access control, secure server-side persistence, or cross-device synchronization. GitHub Pages is a public static host.
- Do not publish private financial information, credentials, or access tokens in the repository.
- Interest and payoff projections are illustrative and **not independently validated**. Check amortization rules, payments that do not cover interest, payoff horizon, mortgage treatment, debt snowball rollover, and individual savings rates before real use.
- Chart.js loads from a public CDN, requiring network access.

## Architecture
Static HTML/CSS/JavaScript website using Chart.js and `localStorage`. The existing Google Apps Script `doGet()` wrapper is not needed for the GitHub Pages version, and the application currently contains no `google.script.run` calls.

## Install shortcut
On iPhone: Safari → Share → Add to Home Screen. On Android: Chrome → menu → Add to Home screen. This is a home-screen shortcut and may open in the browser; a fully offline installable PWA requires additional implementation.


## Version 2 — Income & Expenses
- New **Income & Expenses** fifth tab with selectable reporting month, total income, total expense, and net balance.
- Donut chart breaks actual paid expenses down by category.
- Default expense categories: **Child Daycare**, **Electricity**, **Groceries**, **Gas**; add unlimited custom categories via **Other**.
- Daycare logs recorded **days of daycare**, **amount paid**, **payee**, **payment date**, and a separate **next projected payment amount/date**. Future projected amounts are not included in paid expenses until an actual transaction is recorded.
- Add, edit, and delete income and expenses. Stored under the existing localStorage key alongside the existing debt and savings data.
- This is **local-only**, not cloud backup; changing browsers, deleting the Home Screen app, or clearing website data can erase entries. Do not enter sensitive actual financial records for operational use without authentication, secured persistence and calculation audits.

### Upgrade an existing GitHub Pages site
Upload/replace `index.html` and `README.md` in the repository root, commit, and wait for Pages redeployment. Existing localStorage data in the same browser/site origin is preserved by the updated code; back up your data separately before changes.


## Included branding

- `army-star-logo.png` — app logo used in the header, browser tab icon, and iPhone home screen icon.

## iPhone and Android install (Version 4 PWA)
- Files added: `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, and `favicon-32.png`.
- **Upload every file in this ZIP to the repository root**; do not upload the ZIP as one file. Keep `index.html` named exactly that.
- Ensure GitHub Pages is enabled for `main` / `(root)`. The app must be accessed over HTTPS (the normal `github.io` URL).
- iPhone: open the GitHub Pages URL in **Safari** → Share → **Add to Home Screen** → enable **Open as Web App** when offered → Add.
- Android: open in **Chrome** → menu → **Install app** (or **Add to Home screen** when offered).
- If an older shortcut continues to use an old icon, remove only the Home Screen shortcut and add it again; **this may erase local-only app data**, so export/backup first. You can alternatively wait for icon refresh without deleting.
- Offline use: the main HTML and visual assets are precached; Chart.js is cached after it is fetched online. Offline behavior can depend on first-load and browser storage policies, so test it before relying on it.
- **Not cloud synced:** Financial data is still stored using localStorage, not in a secure account. Deleting/clearing website data may permanently delete entries. Do not enter sensitive personal financial information into this demo.
- For a production app used by other soldiers, add authentication, segregated encrypted cloud storage, security rules, backup/recovery, and financial-model validation.
