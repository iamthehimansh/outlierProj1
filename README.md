# OutlierProj1 Stretch Sequence Coach

A progressive web app for guided stretching routines with streak tracking and animated demonstrations.

## Features
- 🧘 Interactive drag-and-drop sequence builder
- 🔥 Daily streak tracking with local storage
- ⏳ Smart rest timer with circular progress
- 🎨 SVG animations for each stretch movement
- 📊 Progress statistics and history
- 🔊 Audio feedback for transitions
- 📱 Fully responsive design

## Installation
```bash
npm install
npm run dev
```

## Usage
1. Arrange stretches via drag-and-drop
2. Click any stretch to start timer
3. Complete 3+ stretches daily to maintain streak
4. Use settings icon to reset progress

## Customization
Modify `src/utils/stretchAnimations.jsx` to:
- Add new SVG animations
- Adjust default durations
- Modify color schemes

## Tech Stack
- React 18 + Vite
- react-beautiful-dnd
- LocalStorage API
- CSS Modules
- SVG Animations

## Contributing
1. Fork repository
2. Create feature branch
3. Submit PR with tested changes

## Preview
Access live demo at [http://localhost:5173](http://localhost:5173) after starting dev server.