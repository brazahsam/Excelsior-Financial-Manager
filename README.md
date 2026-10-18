# Excelsior Soldier Financial Manager — v6

GitHub Pages PWA with debt snowball, savings, daycare, income and expenses, and local encrypted backups.

## Deploy
Upload **all files except `firestore.rules`** to the root of your GitHub Pages repository (the rules file is reference material for Firebase Console). Keep filename `index.html`. Commit changes. Existing locally stored data uses the unchanged `excelsior_soldier_fin_data_v3` key and should remain available on the same browser/origin. Export a backup before updating.

## Encrypted backup (works without Firebase)
Open **Backup** tab, create a 4–12 digit numeric PIN, confirm and click **Export Encrypted Backup**. Save the downloaded `.json` in Files/iCloud Drive or Google Drive, and keep the PIN safe separately. To restore, open Backup, enter the backup PIN, click Restore Backup, select saved JSON file and confirm replacement. Import overwrites current local data; export your current data first. Encryption uses Web Crypto AES-256-GCM with PBKDF2-SHA256 (310,000 iterations, random salt and IV). It requires HTTPS.

## Firebase cloud sync (must be configured before use)
1. Create a Firebase project at https://console.firebase.google.com/ and add a **Web app**.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create a **Cloud Firestore** database in production mode. Go to **Firestore Database → Rules**, paste the contents of `firestore.rules` and publish the rules. **Do not** upload `firestore.rules` as a web route and assume the security rules are applied; you MUST install them in Firebase Console.
4. Add your GitHub Pages site hostname to Firebase Authentication's **Authorized domains** where required.
5. Replace the `null` in `firebase-config.js` with your project's Firebase **Web SDK config** (apiKey, authDomain, projectId, appId), never a service-account key. Commit changes.
6. On the website, open Backup, create an account or sign in, enter a distinct 4–12 digit numeric **encryption PIN** (a different secret from the account password is recommended). Click **Back Up Now**, or opt into **Automatically upload encrypted changes** for this session. Sign in again to restore on another device using the *same encryption PIN*.

### Important limits
- Cloud save transfers **ciphertext**, not plaintext financial data, but Firebase Authentication still stores account identifiers/metadata. There is no password reset for the encryption secret.
- Cloud restore requires explicit confirmation and replaces local data. Automatic mode is **upload-only**. It is opt-in per session; there is no silent cloud overwrite or device merge. Check the status after saving before deleting any app.
- Browser `localStorage` still holds the working unencrypted local copy; this is not independently security audited and is **not ready for production handling of soldiers' sensitive records**.
- GitHub Pages hosts public source files. Never commit real account records or service-account credentials.
- Firebase SDK and Chart.js require network access. Manual encryption and restoration can operate offline once the app shell is cached.
- Preserve exported encrypted JSON in an independent second location and verify you can restore with fictional data.
- The debt amortization algorithm has not been independently validated.


## Version 6 app PIN
On first launch, create a 4–12 digit numeric app access PIN and confirm it. Subsequent launches ask for it. This is a **convenience screen lock only**, not encryption of local financial data. The PIN verifier is stored locally and offers limited defense; the app is still **not approved for sensitive financial data**. There is no PIN recovery mechanism in this demo; do not delete browser storage without a tested backup.

Encrypted manual backups and cloud backups now accept numeric 4–12 digit PINs. **A 4-digit PIN is highly susceptible to guessing and is not appropriate for sensitive data**. We strongly advise 8–12 unpredictable digits, or upgrading to longer passphrases. Files exported with the older v5 12+ character passphrase remain importable using that original passphrase; however, the numeric-only PIN field in v6 may need an older restore utility to enter it. Firebase Authentication account passwords are separate and still subject to Firebase security requirements.


## Version 6.1 backup compatibility fix

- Fixed "Stored data is missing required fields" for local records saved before Income & Expenses was introduced.
- Missing `moneyEntries` is treated as an empty array for export, without changing saved debts or savings.
- Backup restore also accepts valid earlier data and normalizes missing optional fields.
- Do not delete the installed app or clear site data before successfully exporting and verifying a backup.

## Version 7: Monthly budget notes

- On **Income & Expenses**, use **My Budget Notes** to type personal reminders for the selected month.
- Notes are saved automatically in local browser storage under `moneyNotes` and are included in newly exported encrypted backups.
- Switching months displays the corresponding note. Earlier backups remain compatible (notes default to empty).
- No cloud synchronization occurs until the Firebase integration is configured and enabled.
