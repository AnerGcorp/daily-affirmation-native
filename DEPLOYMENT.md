# Deploying Affirm to Google Play & Apple App Store

## Prerequisites

### Accounts Required
| Account | Cost | Link |
|---------|------|------|
| **Expo Account** | Free | https://expo.dev/signup |
| **Google Play Developer** | $25 one-time | https://play.google.com/console/signup |
| **Apple Developer Program** | $99/year | https://developer.apple.com/programs/enroll |

### Tools Required
```bash
npm install -g eas-cli
eas login   # Log in with your Expo account
```

---

## Step 1: Initialize EAS Project

Run this in the `react-native-app/` directory:

```bash
eas init
```

This will:
- Create your project on Expo servers
- Set the `projectId` in `app.json > extra.eas.projectId`
- Set the `owner` field in `app.json`

Also set the `updates.url` if prompted (for OTA updates).

---

## Step 2: Configure Environment Variables on EAS

Go to https://expo.dev → your project → **Secrets** and add:

| Variable | Value |
|----------|-------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

These will be injected during cloud builds.

---

## Step 3: Replace Placeholder Assets

Before submitting, replace the placeholder purple squares in `./assets/` with professionally designed assets:

| File | Size | Purpose |
|------|------|---------|
| `icon.png` | 1024×1024 | App icon (both stores) |
| `adaptive-icon.png` | 1024×1024 | Android adaptive icon foreground |
| `splash.png` | 1284×2778 | Splash/launch screen |
| `notification-icon.png` | 96×96 | Android notification bar icon (white silhouette on transparent) |
| `favicon.png` | 48×48 | Web favicon |
| `widget-preview-small.png` | ~220×220 | Android widget picker preview |
| `widget-preview-medium.png` | ~440×220 | Android widget picker preview (wide) |

**Icon tips:**
- App icon: No transparency, no rounded corners (stores add them)
- Notification icon: White silhouette on **transparent** background
- Adaptive icon: Keep logo centered in the inner 66% safe zone

---

## Step 4: Build for Google Play (Android)

### 4a. First-time setup — Create upload keystore

EAS handles this automatically on your first production build:

```bash
npm run build:android
# or: eas build --profile production --platform android
```

EAS will:
- Generate a signing keystore (managed by Expo)
- Build an AAB (Android App Bundle) in the cloud
- Provide a download link when done (~10-15 minutes)

### 4b. Create Google Play Console listing

1. Go to https://play.google.com/console
2. **Create app** → fill in app name, language, category (Health & Fitness or Lifestyle)
3. Complete the **Store listing**:
   - App name: `Affirm - Daily Affirmations`
   - Short description: `Start your day with personalized affirmations, mood tracking & daily streaks`
   - Full description: Write a compelling description
   - Screenshots: Take screenshots from your phone (at least 2)
   - Feature graphic: 1024×500 banner image
   - App icon: 512×512 (uploaded separately)
4. Complete **Content rating** questionnaire
5. Complete **Target audience** and **Data safety** sections
6. Set **Pricing & distribution** to Free (or Paid if using subscriptions)

### 4c. Set up Google Service Account (for automated submission)

1. Go to Google Cloud Console → **IAM & Admin** → **Service Accounts**
2. Create a service account with the **Service Account User** role
3. Create a JSON key and download it
4. Save as `google-service-account.json` in the project root
5. In Google Play Console → **Settings** → **API access** → link the service account
6. Grant the service account **Release manager** permission

### 4d. Submit to Google Play

```bash
npm run submit:android
# or: eas submit --profile production --platform android
```

The first submission goes to **Internal testing** track (configured in `eas.json`).
After testing, promote to Production in the Play Console.

---

## Step 5: Build for App Store (iOS)

### 5a. First-time setup

Update `eas.json` with your Apple credentials:
```json
"ios": {
  "appleId": "your@email.com",
  "ascAppId": "1234567890",
  "appleTeamId": "ABCDE12345"
}
```

**How to find these:**
- `appleId`: Your Apple ID email
- `appleTeamId`: https://developer.apple.com/account → Membership → Team ID
- `ascAppId`: Create the app in App Store Connect first (step 5b), then get the Apple ID from **App Information**

### 5b. Create App Store Connect listing

1. Go to https://appstoreconnect.apple.com
2. **My Apps** → **+** → **New App**
   - Platform: iOS
   - Name: `Affirm - Daily Affirmations`
   - Primary language: English
   - Bundle ID: `com.affirm.dailyaffirmations`
   - SKU: `affirm-daily-affirmations`
3. Fill in the **App Information**:
   - Subtitle: `Positive mindset, daily`
   - Category: Health & Fitness (Primary), Lifestyle (Secondary)
   - Privacy Policy URL: (you need one — can host on your website or use a generator)
4. Copy the **Apple ID** (numeric) and put it in `eas.json` as `ascAppId`

### 5c. Build

```bash
npm run build:ios
# or: eas build --profile production --platform ios
```

EAS will:
- Ask you to log in to your Apple account (first time)
- Auto-generate iOS provisioning profiles and certificates
- Build the IPA in the cloud (~15-20 minutes)

### 5d. Submit to App Store

```bash
npm run submit:ios
# or: eas submit --profile production --platform ios
```

### 5e. Complete App Store Review requirements

In App Store Connect, complete:
- **Version Information**: Screenshots (6.7" and 5.5" iPhones required), description, keywords, support URL
- **App Review Information**: Demo account credentials (if login required)
- **Pricing**: Free / subscription pricing
- **App Privacy**: Data collection questionnaire
- Submit for Review (takes 1-3 days typically)

---

## Step 6: In-App Purchases / Subscriptions

If you want real subscriptions (not the current mock):

### Google Play
1. Play Console → **Monetize** → **Subscriptions**
2. Create subscription products matching your app's plans:
   - `affirm_monthly` — $4.99/month
   - `affirm_yearly` — $29.99/year
3. Integrate `react-native-purchases` (RevenueCat) or `expo-in-app-purchases`

### Apple App Store
1. App Store Connect → **Subscriptions**
2. Create a subscription group and add the same products
3. Use the same library as Android for cross-platform handling

**Recommended**: Use [RevenueCat](https://www.revenuecat.com/) — free up to $2.5K MRR, handles both stores with one SDK.

---

## Quick Reference Commands

```bash
# Development build (for testing native modules)
npm run build:dev

# Internal preview APK (share with testers)
npm run build:preview

# Production builds
npm run build:android      # Google Play AAB
npm run build:ios          # App Store IPA
npm run build:all          # Both platforms

# Submit to stores
npm run submit:android     # Upload to Google Play
npm run submit:ios         # Upload to App Store
npm run submit:all         # Both stores

# OTA updates (no new build needed for JS-only changes)
eas update --branch production --message "Bug fix"
```

---

## Checklist Before First Submission

- [ ] Replace placeholder assets with designed icons/splash
- [ ] Real Supabase credentials in EAS Secrets
- [ ] Privacy Policy URL (required by both stores)
- [ ] App Store / Play Store listings completed
- [ ] Screenshots captured from real device
- [ ] Test the production build on a real device
- [ ] `eas.json` has correct Apple credentials
- [ ] Google service account JSON for Play Store submission
- [ ] In-app purchases configured (if using subscriptions)
- [ ] Remove any debug/console.log statements
- [ ] Test the full flow: onboarding → signup → check-in → affirmations
