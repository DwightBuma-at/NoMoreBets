# NoMoreBets

A premium iOS-inspired daily tracker for staying gamble-free.

## Features

- **Daily Tracking**: Record whether you stayed gamble-free each day
- **Streak System**: Unlock streak tracking at day 3 with premium gold styling
- **Offline-First**: All data stored locally in your browser
- **iOS Design**: Premium glassmorphism UI with smooth animations
- **Settings**: Reset your progress anytime

## Offline Usage

The app is designed to work offline with minimal external dependencies:

### External Dependencies (for full experience):
- **Google Fonts**: Inter and Poppins fonts
- **Lucide Icons**: Icon library

### Offline Fallback:
- If Google Fonts fail to load, the app falls back to system fonts (-apple-system, BlinkMacSystemFont)
- If Lucide Icons fail to load, the app still functions (icons just won't appear)

### For Complete Offline Use:
To use the app completely offline without any internet connection:

1. **Download fonts** and host them locally in the `assets/` folder
2. **Download Lucide Icons** and host the library locally
3. Update the HTML references to use local files

## Data Storage

All data is stored in your browser's LocalStorage:
- User name
- Daily logs (date and status)
- Current streak
- Longest streak

## How to Use

1. **First Launch**: Enter your name
2. **Daily Check-in**: Select "Stayed Gamble-Free" or "I Gambled Today"
3. **Streak**: After 3 consecutive gamble-free days, your streak unlocks
4. **View Logs**: See your history in the logs modal
5. **Settings**: Reset all data if needed

## Tech Stack

- HTML5
- CSS3 (Glassmorphism, animations, gradients)
- Vanilla JavaScript
- LocalStorage for data persistence

## Browser Support

Works on all modern browsers:
- Chrome/Edge (recommended)
- Safari
- Firefox
- Mobile browsers (iOS Safari, Chrome Mobile)

## Privacy

- No data is sent to any server
- Everything stays on your device
- No tracking or analytics
- Completely private
