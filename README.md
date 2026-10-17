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
