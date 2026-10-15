"""Normalize favicon metadata on all published HTML pages after generation."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parent.parent
TAGS='''<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />'''
count=0
for p in ROOT.rglob('*.html'):
    if p.name.startswith(('google','yandex')) or any(x in p.parts for x in ['node_modules','.git','work-favicons']):continue
    s=p.read_text()
    if '</head>' not in s:continue
    pattern=r'<link\b[^>]*\brel\s*=\s*["\'](?:icon|shortcut icon|apple-touch-icon|apple-touch-icon-precomposed|manifest)["\'][^>]*>\s*'
    new=re.sub(pattern,'',s,flags=re.I)
    new=new.replace('</head>',TAGS+'\n</head>',1)
    if new!=s:p.write_text(new);count+=1
print('Favicon metadata updated:',count)
