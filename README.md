# The Chanderi Night Gazette

A one-page fictional alert portal for **Stree**, the spirit of Chanderi ("O Stree, Kal Aana").
Victorian Haunting UI: double-ruled gold borders, ornaments, antique type.

**Main feature:** a sighting map with incident pins, filters, a timeline, and a report form.
**Sponsor integration:** the *Kapidhwaj Wardens*, an in-universe guild of banner-bearers.
"Raise the Banner" paints ward rings over the map and lowers tonight's peril. An Instagram
calling card links to [@kapidhwaj.innovations](https://www.instagram.com/kapidhwaj.innovations/).

**The Séance (sound twist):** pins and timeline entries toll a bell (low and heavy for disappearances),
posting a report plays a whisper then a bell, and the Kapidhwaj banner rings a chime. Sounds are
synthesized live with the Web Audio API, so there are no audio files. A toggle in the header mutes them.
Browsers only allow audio after a click, which is why sound starts on the first interaction.

## Run locally
No build step. Open `index.html`, or:
```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Put it on Git
```bash
git init && git add . && git commit -m "Chanderi Night Gazette"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

## Deploy (all free, all static)
- **GitHub Pages:** repo Settings > Pages > Deploy from branch `main`, folder `/ (root)`.
- **Netlify:** "Add new site" > import the repo (no build command, publish directory `.`).
- **Vercel:** import the repo, framework preset "Other", no build command.

## Files
`index.html` (markup) · `style.css` (theme) · `script.js` (map, filters, timeline, form, ward toggle)
Fonts load from Google Fonts with serif fallbacks. Reports are kept in memory only.
