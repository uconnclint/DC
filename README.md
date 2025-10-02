# Digital City: Grade 3

Digital City is a classroom-friendly point-and-click adventure inspired by Sierra classics. It helps grade 3 learners practice personal vs. private information, digital footprint awareness, and respectful online behavior.

## Development

This project uses [Phaser 3](https://phaser.io/) with [Vite](https://vitejs.dev/) and TypeScript.

### Getting started

```bash
npm install
npm run dev
```

### Build for production

```bash
npm run build
```

The development server auto-opens a browser window at `http://localhost:5173`.

## Project structure

```
assets/              # Art, audio, and UI placeholders
src/
  config.ts          # Game-wide configuration and save schema
  main.ts            # Phaser bootstrap
  audio.ts           # Simple voiceover playback helper
  input.ts           # Keyboard ALT navigation helper
  save.ts            # Local storage persistence layer
  data/              # Quiz question banks
  scenes/            # Boot, title, hub, districts, quiz, finale, teacher view
  minigames/         # Stub mini-game modules for each activity
  ui/                # Shared UI components (dialog, backpack, settings)
```

## Teacher dashboard access

On the title screen hold **T** for two seconds, then enter the default code `4321` to open the local teacher dashboard. Update the code in `src/config.ts` as needed.

## Accessibility roadmap

* Alt-navigation with arrow keys and Enter for selection
* Caption toggles and adjustable caption speed
* UI scaling presets: 1.0×, 1.5×, and 2.0×
* High-contrast presentation mode

These features have been scaffolded via `SettingsPanel` and related classes and will evolve alongside art and audio integration.
