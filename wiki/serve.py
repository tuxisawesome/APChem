"""Dev server: builds into .cache/site (dev mode), serves it, and rebuilds when sources change.
Pages poll /__version and reload themselves after a rebuild."""
from __future__ import annotations

import functools
import os
import subprocess
import sys
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

from .util import ROOT

WATCH = ["docs", "data", "snippets", "wiki", "site.yml"]
OUT = ROOT / ".cache" / "site"


def _snapshot() -> dict:
    snap = {}
    for name in WATCH:
        p = ROOT / name
        files = [p] if p.is_file() else (f for f in p.rglob("*") if f.is_file()) if p.exists() else []
        for f in files:
            if "__pycache__" in f.parts:
                continue
            try:
                snap[str(f)] = f.stat().st_mtime_ns
            except OSError:
                pass
    return snap


class _State:
    version = str(time.time())
    lock = threading.Lock()


def _rebuild() -> bool:
    # a fresh interpreter each time, so edits to wiki/*.py take effect too
    r = subprocess.run([sys.executable, "-m", "wiki", "build", "--dev", "-d", str(OUT)], cwd=ROOT)
    with _State.lock:
        _State.version = str(time.time())
    return r.returncode == 0


def _watch():
    last = _snapshot()
    while True:
        time.sleep(0.6)
        now = _snapshot()
        if now != last:
            time.sleep(0.2)
            last = _snapshot()
            print("Change detected, rebuilding…", flush=True)
            _rebuild()


class _Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.split("?")[0] == "/__version":
            body = _State.version.encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        path = self.translate_path(self.path)
        if not os.path.exists(path):
            self.send_response(404)
            body = (OUT / "404.html").read_bytes() if (OUT / "404.html").exists() else b"Not found"
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        if args and str(args[1]) not in ("200", "304"):
            super().log_message(fmt, *args)


def serve(host: str, port: int) -> int:
    print("Building…", flush=True)
    _rebuild()
    threading.Thread(target=_watch, daemon=True).start()
    httpd = ThreadingHTTPServer((host, port), functools.partial(_Handler, directory=str(OUT)))
    print(f"Serving on http://{host}:{port}/  (Ctrl+C to stop)", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    return 0
