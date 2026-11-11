"""Command line:

    python -m wiki build [--strict] [-d OUT]   build the site into site/ (or OUT)
    python -m wiki serve [--port 8000]         live-preview at http://127.0.0.1:8000/
"""
from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

from .util import ROOT


def build(args) -> int:
    from .core import Site
    t = time.time()
    site = Site(ROOT, out=Path(args.dir).resolve() if args.dir else None, dev=args.dev)
    n = site.build()
    for w in site.warnings:
        print(f"WARNING  {w}", file=sys.stderr)
    print(f"Built {n} pages into {site.out.relative_to(ROOT) if site.out.is_relative_to(ROOT) else site.out} "
          f"in {time.time() - t:.1f}s" + (f" with {len(site.warnings)} warning(s)" if site.warnings else ""))
    if args.strict and site.warnings:
        print("Strict mode: failing because of the warnings above.", file=sys.stderr)
        return 1
    return 0


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(prog="python -m wiki", description="Build or preview the AP Chem notes wiki.")
    sub = ap.add_subparsers(dest="cmd", required=True)
    b = sub.add_parser("build", help="build the static site")
    b.add_argument("--strict", action="store_true", help="exit with an error if there are any warnings")
    b.add_argument("-d", "--dir", help="output directory (default: site/)")
    b.add_argument("--dev", action="store_true", help=argparse.SUPPRESS)
    s = sub.add_parser("serve", help="build, serve and rebuild on changes")
    s.add_argument("--port", type=int, default=8000)
    s.add_argument("--host", default="127.0.0.1")
    args = ap.parse_args(argv)
    if args.cmd == "build":
        return build(args)
    from .serve import serve
    return serve(args.host, args.port)


if __name__ == "__main__":
    sys.exit(main())
