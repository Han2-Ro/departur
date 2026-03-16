# Departure Announcer (Expo Android)

This project ports the original `ticker.py` departure announcer into a React Native app (Expo), focused on Android.

## Behavior

- One screen, one button: `Announcer starten`
- Hard-coded station (`diva=60200439`)
- Fetches Wiener Linien realtime departures
- Speaks announcements in German
- Repeats every 60 seconds after start

## Development setup

### Tooling

- Node.js + `pnpm`
- Expo SDK 55
- `jj` (Jujutsu) as the VCS workflow

### Useful commands

```bash
pnpm install
pnpm android
pnpm test
pnpm lint
```
