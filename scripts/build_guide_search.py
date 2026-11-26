"""Build a small searchable heading index from the current Black Box guides."""
import json
import re
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data/blackbox-guides.json"
OUTPUT = ROOT / "data/blackbox-search-sections.json"
ATTR = re.compile(r'([\w-]+)\s*=\s*["\']([^"\']*)["\']')
QUICK_LINK = re.compile(r"<a\b([^>]*)>(.*?)</a>", re.S | re.I)
QUICK_TITLE = re.compile(r'<span\b[^>]*class="qn-nm"[^>]*>(.*?)</span>', re.S)
CARD = re.compile(r'<div\b([^>]*class="bp-card"[^>]*)>\s*<div\b[^>]*class="bp-card-head"[^>]*>.*?<span\b[^>]*class="bp-card-title"[^>]*>(.*?)</span>', re.S)
HEADINGS = re.compile(r'<section\b([^>]*)>\s*(?:<div\b[^>]*class="sec-head"[^>]*>.*?)?<h2\b[^>]*>(.*?)</h2>', re.S)
SECTION = re.compile(r"<section\b([^>]*)>(.*?)</section>", re.S)
SUBHEADING = re.compile(r"<h3\b[^>]*>(.*?)</h3>", re.S)
TAG = re.compile(r"<[^>]+>")


def plain(raw):
    return " ".join(unescape(TAG.sub("", raw)).split())


def headings(html):
    ids = set(re.findall(r'\bid="([^"]+)"', html))
    seen = set()
    sources = []
    for match in QUICK_LINK.finditer(html):
        attrs = dict(ATTR.findall(match[1]))
        href = attrs.get("href", "")
        if "qn-item" not in attrs.get("class", "").split() or not href.startswith("#"):
            continue
        title = QUICK_TITLE.search(match[2])
        if title:
            sources.append((href[1:], plain(title[1])))
    for pattern in [CARD, HEADINGS]:
        for match in pattern.finditer(html):
            attrs = dict(ATTR.findall(match[1]))
            sources.append((attrs.get("id", ""), plain(match[2])))
    for section in SECTION.finditer(html):
        anchor = dict(ATTR.findall(section[1])).get("id", "")
        if anchor:
            sources.extend((anchor, plain(match[1])) for match in SUBHEADING.finditer(section[2]))
    for anchor, title in sources:
        if (
            anchor in ids and (anchor, title) not in seen and not anchor.endswith("credits")
            and re.fullmatch(r"[a-z0-9-]+", anchor)
            and 3 <= len(title) <= 140 and not re.fullmatch(r"\d+(?:\.\d+)?", title)
        ):
            seen.add((anchor, title))
            yield [anchor, title]


if __name__ == "__main__":
    index = {}
    for entry in json.loads(CATALOG.read_text(encoding="utf-8")):
        path = entry["path"]
        if "/ship-dossiers/" not in path:
            index[path] = list(headings((ROOT / "blackbox" / path).read_text(encoding="utf-8")))
    OUTPUT.write_text(
        "{\n" + ",\n".join("  " + json.dumps(path) + ": " + json.dumps(rows, ensure_ascii=False) for path, rows in index.items()) + "\n}\n",
        encoding="utf-8",
    )
