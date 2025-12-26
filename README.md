# exShapReact - Business with China Platform

A React Native Web application designed to help business people, solopreneurs, and SME/SMI managers conduct business with China remotely.

## Features

- **Welcome Dashboard**: Quick access to all main features.
- **Suppliers Search**: Find suppliers with price comparison (Local vs. "With Us" pricing).
- **Proforma Invoice Generator**: Calculate costs including product, shipping, insurance, etc.
- **"I am in!" Registration**: KYC form for onboarding new clients.
- **Opportunities Club**: curated business opportunities in China.
- **Responsive Design**: Works on Desktop, Tablet, and Mobile.

## Tech Stack

- **Framework**: React Native (Expo)
- **Web Support**: React Native Web
- **Navigation**: React Navigation (Drawer)
- **UI Library**: React Native Paper
- **Icons**: MaterialCommunityIcons (@expo/vector-icons)
- **API**: Axios (Mocked services in `src/services/api.js`)

## Installation

1. **Clone the repository** (if applicable) or navigate to the project directory.

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application**:
   - For Web:
     ```bash
     npm run web
     ```
   - For Android/iOS (requires emulator or Expo Go app):
     ```bash
     npm run android
     # or
     npm run ios
     ```

## Project Structure

```
src/
  ├── components/    # Reusable components (Sidebar, etc.)
  ├── navigation/    # Navigation configuration (if separated)
  ├── screens/       # Main application screens
  │   ├── WelcomeScreen.js
  │   ├── SuppliersScreen.js
  │   ├── ProformaScreen.js
  │   ├── IAmInScreen.js
  │   └── OpportunitiesScreen.js
  ├── services/      # API services (Mocked)
  └── theme/         # Application theme (Colors, Fonts)
App.js               # Entry point and Navigation setup
babel.config.js      # Babel configuration (Reanimated plugin)
```

## functionality Details

- **Suppliers**: Enter a search query or price range. The app returns mock results. The "Price with us" calculation demonstrates the value proposition.
- **Proforma**: Select a supplier from the Suppliers page to auto-fill the form. Calculates a total mock cost.
- **Services**: Clicking on additional costs (Shipping, etc.) redirects to the "I am in!" page with the service pre-selected.

## Error Handling

- API calls are wrapped in `try/catch` blocks.
- Loading states are displayed using `ActivityIndicator`.
- User feedback is provided via Alerts or UI text when errors occur.
