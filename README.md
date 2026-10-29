# IdleHands

A productivity web app that helps you discover random activities and save the ones you like. Built with vanilla JavaScript and Bootstrap 5.

## Features

- **User authentication**: sign up / login with localStorage-based session persistence (no backend)
- **Discover Activities**: fetches a random activity from the [Random Activity API](https://random-activity-sigmo.vercel.app/api/random) and displays metadata (type, participants, price, accessibility, duration, kid-friendliness)
- **Save & manage activities**: bookmark activities to a personal saved list, remove them, with a live counter
- **Persistent state**: users, session, and saved activities are stored in `localStorage`

## Tech Stack

| Layer   | Technology                          |
| ------- | ----------------------------------- |
| Markup  | HTML5                               |
| Styling | CSS3, Bootstrap 5.3                 |
| Icons   | Bootstrap Icons                     |
| Logic   | Vanilla JavaScript (ES6+)           |
| Data    | `localStorage`, Random Activity API |

## Screenshots

![Screenshot](./Screenshot%201.png)
![Screenshot](./Screenshot%202.png)
![Screenshot](./Screenshot%203.png)

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/zubairjs/IdleHands.git
   cd idlehands
   ```
2. Open `index.html` in a browser, or serve locally:
   ```bash
   npx serve .
   ```
3. Open the link copied from the terminal in a browser.

No build step or dependencies required.

## Usage

1. **Sign up** with a username and password (min. 8 alphanumeric chars, must contain a letter and a digit).
2. **Log in**: Seeded demo account: `admin` / `admin123`.
3. Click **Get Activity** to fetch a random activity.
4. Click **Save Activity** to bookmark it; manage saved items in the right panel.

## How It Works

- `users` and `activities` are loaded from `localStorage` when the app starts. If nothing is saved yet, the app falls back to sensible defaults (like a demo `admin` account) so it works right away.
- `storeData(obj, key, value, type)` centralizes persistence — `current` keys overwrite, others push.
- `state.isLoggedIn` determines the initial view on page load.
- Form validation runs on submit via `validateSignup` / `validateInputs`, toggling Bootstrap `is-valid` / `is-invalid` classes.
- Saved activities are re-rendered from state on every mutation; delete handlers are re-attached via `addRemoveEventListener()`.

## Notes & Limitations

- **Client-side only**. The credentials are stored in plaintext in `localStorage`. This is a demo project; do not use real passwords.
- The activity API is a public third-party endpoint and may be rate-limited or unavailable.
