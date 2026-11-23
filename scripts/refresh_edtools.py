#!/usr/bin/env python3
"""Refresh a bounded, attributed snapshot of EDTools hotspot search results.
No API is claimed: parses public HTML. Run in CI; never from browsers.
"""
import json, re, urllib.parse, urllib.request
from html.parser import HTMLParser
from datetime import datetime, timezone
from pathlib import Path

MINERALS = ["Platinum","Painite","Monazite","Rhodplumsite","Serendibite","Musgravite","Benitoite","Alexandrite","Grandidierite","Low Temperature Diamonds","Void Opals","Tritium","Bromellite"]
class Parser(HTMLParser):
 def __init__(self):
  super().__init__();self.in_row=False;self.in_cell=False;self.cells=[];self.rows=[];self.buf=[];self.depth=0
 def handle_starttag(self,tag,attrs):
  if tag=="tr":self.in_row=True;self.cells=[]
  if tag in ("td","th") and self.in_row:self.in_cell=True;self.buf=[]
  if tag=="br" and self.in_cell:self.buf.append(" ")
 def handle_data(self,data):
  if self.in_cell:self.buf.append(data)
 def handle_endtag(self,tag):
  if tag in ("td","th") and self.in_cell:self.cells.append(" ".join("".join(self.buf).split()));self.in_cell=False
  if tag=="tr" and self.in_row:
   if len(self.cells)>=6:self.rows.append(self.cells[:6])
   self.in_row=False
def fetch(mineral):
 query=urllib.parse.urlencode({"s":"Sol","m":mineral,"ms":"1"})
 req=urllib.request.Request("https://edtools.cc/hotspot?"+query,headers={"User-Agent":"EliteMiningAssistant/0.1 (public community reference)"})
 with urllib.request.urlopen(req,timeout=30) as response:
  p=Parser();p.feed(response.read().decode("utf-8","replace"))
 records=[]
 for cells in p.rows:
  try:distance=float(cells[0].replace(",",""));count=int(cells[4].replace(",",""));arrival=int(cells[5].replace(",",""))
  except (ValueError,IndexError):continue
  system=re.sub(r"\\s*\\*.*$","",cells[1]).strip()
  if not system or not cells[2]:continue
  records.append({"mineral":mineral,"system":system,"ring":cells[2],"type":cells[3],"hotspots":count,"distanceFromSol":distance,"arrivalLs":arrival})
 return records
def main():
 all_rows=[];errors=[]
 for mineral in MINERALS:
  try:
   rows=fetch(mineral);print(mineral,len(rows))
   if not rows:raise ValueError("No parsed results")
   all_rows.extend(rows)
  except Exception as exc:errors.append(mineral+": "+str(exc))
 if not all_rows:raise RuntimeError("No data obtained; not replacing existing snapshot")
 target=Path("data/edtools-hotspots.json");target.parent.mkdir(exist_ok=True)
 target.write_text(json.dumps({"source":"EDTools Hotspots public HTML (community data)","sourceUrl":"https://edtools.cc/hotspot","updatedAt":datetime.now(timezone.utc).isoformat(),"rows":all_rows,"errors":errors},ensure_ascii=False,indent=2)+"\\n",encoding="utf-8")
 print("Wrote",len(all_rows),"rows; errors",errors)
if __name__=="__main__":main()
