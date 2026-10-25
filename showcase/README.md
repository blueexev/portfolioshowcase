# Vaishnavi Venkatesh — Portfolio

A plain HTML, CSS and JavaScript portfolio. No build step.

## Pages

| File | What it is |
|---|---|
| `index.html` | Entry screen. Click Enter to go to the home page. |
| `home.html` | Home: intro, work preview, slice of life folder, footer. |
| `work.html` | All projects. |
| `about.html` | About me. |
| `playground.html` | Experiments. |
| `slice.html` | Slice of life widget board. |
| `pages/project-1.html` to `project-6.html` | One case study per project. |

## Folders

- `css/style.css` all styling, split into labelled sections.
- `js/main.js` all interactions, split into labelled sections.
- `assets/` logo, folder images and placeholder pictures.
- `imagezz/` your own images (see below).

## Your images (put them in `imagezz/`)

| Where it shows | File name |
|---|---|
| Project images | `Dhanushkodi vr.png`, `mandi.jpeg`, `Fragile flights.png`, `ITI Game.png`, `DigitalMuseum.png`, `taru.png` |
| Project hover image (optional) | same name plus `-hover`, e.g. `taru-hover.png` |
| Drifting intro images | `interest-1.png` to `interest-5.png` |
| Folder photos and photo stack | `life-1.png` to `life-8.png` |
| Your picture (top left) | `assets/logo.png` |
| Folder | `assets/folder-back.png` and `assets/folder-front.png` |

If an image is missing, a drawn placeholder shows instead.

## Run it in VS Code

1. Open this folder in VS Code (File > Open Folder).
2. Install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.

## Put it on GitHub

1. Create an account at github.com and install Git from git-scm.com.
2. On GitHub click **New repository**, name it (for example `portfolio`), leave it empty, click **Create**.
3. In VS Code open the terminal (Ctrl + `) and run:

```
git init
git add .
git commit -m "First version of my portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git push -u origin main
```

4. After any change: `git add .`, `git commit -m "what changed"`, `git push`.

## Open it from GitHub in VS Code on another computer

1. In VS Code press Ctrl+Shift+P and run **Git: Clone**.
2. Paste the repository link and pick a folder.
3. Click **Open** when VS Code asks.

## Make it a live website (free)

1. On GitHub open your repository, then **Settings > Pages**.
2. Under **Branch** pick `main` and `/ (root)`, then **Save**.
3. After a minute your site is at `https://YOUR-USERNAME.github.io/portfolio/`. Open `index.html` first (GitHub Pages serves it automatically).
