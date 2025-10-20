Cave Adventure — Local Text Adventure (HTML)
===========================================

Overview
--------
This folder contains a small text-based branching adventure implemented as static HTML pages.
Start at `start.html` and follow links to explore rooms, solve riddles, and find the treasure.

How to play
-----------
- Open `cave_adventure/start.html` in your web browser. Clicking the links will navigate between rooms.
- Alternatively, serve the folder with a simple HTTP server and open `http://localhost:8000/cave_adventure/start.html`.

Run a simple local server (Windows cmd.exe):

```cmd
cd /d H:\Python\PS3-wedBrowser_Python
python -m http.server 8000
```

Then open this URL in your browser:

```
http://localhost:8000/cave_adventure/start.html
```

Files added/edited
------------------
- start.html — expanded with an extra path to the shimmering pool.
- hallway.html — added atmosphere and a link to a hidden library.
- door_b.html — added an interactive seam leading to a guardian room.
- library.html — NEW: hidden library with options.
- guardian.html — NEW: statue guardian riddle room.
- mysterious_pool.html — NEW: a short, mysterious side path with a vision.

Notes / Next steps
------------------
- You can add simple CSS and images to enhance the experience.
- If you'd like, I can wire up a small JS state tracker (inventory/visited rooms) to make puzzles more engaging.

Have fun exploring!
