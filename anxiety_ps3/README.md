Anxiety — PS3-friendly simplified port
=====================================

This folder contains a very small, static, PS3-friendly reimplementation of the opening idea from Ncase's "Anxiety" project. It's intentionally tiny and compatible with older browsers (no modules, ES5 only).

How to run locally
-------------------
From Windows cmd.exe:

```cmd
cd /d H:\Python\PS3-wedBrowser_Python
python -m http.server 8000
```

Then open on your PS3 browser:

```
http://<your-pc-ip>:8000/anxiety_ps3/index.html
```

Notes
-----
- This is not a full port of the original project. It reproduces a tiny interactive scene using only basic DOM operations so older engines like the PS3 browser can run it.
- If you want a more faithful port, we can either transpile the real project with heavy polyfills (large and unreliable) or reimplement more scenes in this style.
