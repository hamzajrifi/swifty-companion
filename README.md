# Swifty Companion

A React Native mobile app for 42 school students to view profiles, projects, and progress using the 42 API.

## Features

- **OAuth Authentication** - Secure login with 42 school credentials
- **Student Profiles** - View personal information, wallet, experience, and score
- **Project Management** - Browse and track project progress
- **Real-time Data** - Live updates from 42 API
- **Cross-platform** - Works on iOS and Android

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   - Create `.env` file with your 42 API credentials
   - Add `CLIENT_ID`, `CLIENT_SECRET`, `REDIRECT_URI`, `AUTH_URL`, `TOKEN_URL`

3. **Start the app**
   ```bash
   npx expo start
   ```

## Development

- **iOS Simulator**: Press `i` in terminal
- **Android Emulator**: Press `a` in terminal
- **Physical Device**: Scan QR code with Expo Go app

## Tech Stack

- React Native with Expo
- TypeScript
- 42 API integration
- OAuth authentication
- Zustand state management

## Project Structure

```
app/           # Main app screens and navigation
api/           # 42 API integration
components/    # Reusable UI components
stores/        # State management
types/         # TypeScript definitions
```
