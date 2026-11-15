# DireStraits

Internal dashboard for tracking VC fundraising and mapping investor networks.

It's a static site hosted on GitHub Pages, with logins handled by [Supabase](https://supabase.com).

## How privacy works

- The page's HTML, CSS and JS are public, like any GitHub Pages site. **Don't put private information in these files.**
- All private data (investors, contacts, notes) will live in Supabase. **Row Level Security** policies let only signed-in users read it.
- New users can't sign themselves up. You invite each person from the Supabase dashboard.

## One-time setup

### 1. Create the Supabase project
1. Sign up at supabase.com and create a new project (the free tier is fine).
2. Go to **Authentication → Sign In / Providers**:
   - Turn **off** "Allow new users to sign up" so access is invite-only.
   - Keep **Email** enabled.
3. Go to **Authentication → URL Configuration**:
   - Set **Site URL** to your Pages URL, e.g. `https://charlestwitchell.github.io/direstraits/`
   - Add the same URL under **Redirect URLs**.
4. Go to **Project Settings → API** and copy the **Project URL** and the **anon public** key into `config.js`.
   Never use the `service_role` key in this repo.

### 2. Invite users
Go to **Authentication → Users → Invite user** and enter an email address. The invitee clicks the emailed link, lands on the site and picks a password.

### 3. Turn on GitHub Pages
1. On a free GitHub plan the repo must be **public** for Pages to work. (Settings → General → Danger Zone → Change visibility.)
2. Go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, select the branch and `/ (root)`, then save.
3. The site appears at `https://charlestwitchell.github.io/direstraits/` within a minute or two.

## Files
| File | Purpose |
|---|---|
| `index.html` | Login screen and app shell |
| `assets/app.js` | Login, logout, password reset logic |
| `assets/styles.css` | Styles (light and dark) |
| `config.js` | Supabase URL and anon key |
