# Departure Announcer (Expo Android)

This project ports the original `ticker.py` departure announcer into a React Native app (Expo), focused on Android.

## Behavior

- Single-screen app with start control and station search/selection controls
- Default station remains `diva=60200439`
- You can search stations by name and select a station
- The selected station is used for announcer departures
- Station search/selection and start controls are locked while the announcer is running
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
