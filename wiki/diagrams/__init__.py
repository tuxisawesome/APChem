"""Diagram kit registry.

Each diagram kind is a module with `render(data: dict) -> str` that returns HTML.
Authors write a fenced block whose language is the kind, containing YAML:

    ```apparatus
    parts: [{type: beaker, fill: 0.5}]
    ```

To add a new kind: create wiki/diagrams/<kind>.py with a `render()` function
(see rice.py for the smallest example), then add it to KINDS below. The hook
registers every KINDS entry as a fence automatically, and the live gallery at
docs/contributing/diagrams.md should get an example.
"""
from __future__ import annotations

import yaml

from . import apparatus, energy, graph, lewis, phscale, rice
from ._svg import DiagramError, esc

KINDS = {
    "rice": rice.render,
    "graph": graph.render,
    "energy": energy.render,
    "apparatus": apparatus.render,
    "lewis": lewis.render,
    "phscale": phscale.render,
}


def render_block(kind: str, source: str) -> str:
    """Render one fenced diagram block. Raises DiagramError with a helpful message."""
    try:
        data = yaml.safe_load(source) or {}
    except yaml.YAMLError as e:
        raise DiagramError(f"{kind}: YAML error — {e}") from None
    try:
        return KINDS[kind](data)
    except DiagramError:
        raise
    except Exception as e:  # turn unexpected crashes into readable errors
        raise DiagramError(f"{kind}: {type(e).__name__}: {e}") from None


def error_box(kind: str, message: str, source: str) -> str:
    return (f'<div class="diagram-error"><strong>Diagram error ({esc(kind)})</strong>'
            f'<p>{esc(message)}</p><pre><code>{esc(source)}</code></pre></div>')


__all__ = ["KINDS", "render_block", "error_box", "DiagramError"]
