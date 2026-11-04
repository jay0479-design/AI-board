# -*- coding: utf-8 -*-
"""Rebuild AI-board process-card JSONs, radar JSONs and slot image crops from
the Figma extraction (cards_raw.json / radar_raw.json / exports/*.png).
Run:  python3 build_data.py <repo_root>
"""
import json, os, sys, shutil
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = sys.argv[1]
PROC = os.path.join(REPO, 'src/data/process')
RADAR = os.path.join(REPO, 'src/data/radar')
ASSETS = os.path.join(REPO, 'public/assets/process')
EXPORTS = os.path.join(HERE, 'exports')

cards = json.load(open(os.path.join(HERE, 'cards_raw.json'), encoding='utf-8'))
radar = json.load(open(os.path.join(HERE, 'radar_raw.json'), encoding='utf-8'))

# Image slots per card (x,y relative to card at 1x; from Figma survey 2026-11-04). Only slots holding a real image.
SLOTS = {
 '406:171': [('Before',28,713,334,188),('After',378,713,334,188)],
 '420:204': [('Before',28,558,334,188),('After',378,558,334,188)],
 '422:735': [('Before',28,776,334,188),('After',378,776,334,188),('3',28,1005,334,188),('4',378,1005,334,188)],
 '418:1056': [('After',28,755,684,385)],
 '428:421': [('Before',28,902,334,188),('After',378,902,334,188)],
 '446:1214': [('After',28,713,684,385)],
 '584:1269': [('Before',28,705,334,188),('After',378,705,334,188)],
 '584:1329': [('Before',28,684,334,188),('After',378,684,334,188)],
 '584:1389': [('Before',28,663,334,188),('After',378,663,334,188)],
 '584:1448': [('After',28,713,684,385)],
 '584:1508': [('Before',28,726,334,188),('After',378,726,334,188)],
 '584:1568': [('Before',28,566,334,188),('After',378,566,334,188)],
 '584:1687': [('Before',28,558,334,188),('After',378,558,334,188)],
 '584:1747': [('Before',28,629,334,188),('After',378,629,334,188)],
 '584:1806': [('Before',28,692,334,188),('After',378,692,334,188)],
 '588:1832': [('Before',28,558,334,188),('After',378,558,334,188)],
 '779:2332': [('Before',28,726,334,188),('After',378,726,334,188)],
 '779:2493': [('Before',28,705,334,188),('After',378,705,334,188)],
 '618:1957': [('After',28,726,684,385),('3',28,1152,684,385)],
 '660:197': [('Before',28,747,334,188),('After',378,718,334,188)],
 '778:2026': [('After',28,600,684,385),('3',28,1026,684,385)],
 '778:2098': [('After',28,600,684,385),('3',28,1026,684,385)],
 '778:2168': [('After',28,600,684,385),('3',28,1026,684,385)],
 '778:2238': [('After',28,579,684,385),('3',28,1005,684,385)],
 '788:2349': [('After',28,621,684,385),('3',28,1047,684,385)],
}

SECTION_TITLES = {
 '정현영': '정현영',
 '이주희': '이주희_작업중 ✏️',
 '이미애': '이미애___작업중입니다 🚀🚀',
 '하소진': '하소진 - 작업중🚧',
 '이민영': '이민영',
}

def fid(node_id):
    return node_id.replace(':', '-')

def crop_images(card):
    """Crop each real slot from the 2x export; returns list of (slot name, src path)."""
    nid = card['id']
    slots = SLOTS.get(nid)
    if not slots:
        return []
    src = os.path.join(EXPORTS, fid(nid) + '.png')
    img = Image.open(src)
    W = 740
    scale = 2
    pad = (img.width - W * scale) / 2.0  # export bleed for the card shadow
    outdir = os.path.join(ASSETS, fid(nid))
    os.makedirs(outdir, exist_ok=True)
    # drop old crops (keep nothing; regenerate)
    for f in os.listdir(outdir):
        os.remove(os.path.join(outdir, f))
    out = []
    for i, (name, x, y, w, h) in enumerate(slots, 1):
        box = (round(x*scale+pad), round(y*scale+pad), round((x+w)*scale+pad), round((y+h)*scale+pad))
        crop = img.crop(box).convert('RGB')
        fn = f'{i}.png'
        crop.save(os.path.join(outdir, fn), optimize=True)
        out.append((name, f'assets/process/{fid(nid)}/{fn}'))
    # QA reference at 1x
    qa = img.convert('RGB').resize((img.width // 2, img.height // 2), Image.LANCZOS)
    qa.save(os.path.join(outdir, '_figma.png'), optimize=True)
    return out

def step_block(badge, s, images=None):
    b = {
        'type': 'step', 'badge': badge, 'badgeTone': 'blue',
        'name': s['name'], 'desc': s['desc'],
        'promptLabel': s['label'], 'boxLabel': s['lang'],
    }
    if s.get('link'):
        link = {'label': '전체 프롬프트 · Notion ↗'}
        if s.get('url'):
            link['url'] = s['url']
        b['link'] = link
    b['prompt'] = s['prompt']
    if images:
        b['images'] = images
    return b

def build_card(card, order):
    imgs = crop_images(card)
    caps = card.get('caps', [])
    cap_links = card.get('capLinks', [])
    # captions map to slots in order Before, After, 3, 4; when only After-type slots exist captions still map in order
    images = []
    for i, (slot, src) in enumerate(imgs):
        item = {}
        label = caps[i] if i < len(caps) else None
        if label:
            item['label'] = label
        item['src'] = src
        item['alt'] = label or {'Before': 'Before', 'After': 'After'}.get(slot, f'이미지 {slot}')
        if i < len(cap_links) and cap_links[i]:
            item['figmaUrl'] = cap_links[i]
        images.append(item)
    out = {
        'nodeId': card['id'],
        'author': card['author'],
    }
    if card.get('group'):
        out['group'] = card['group']
    out.update({
        'order': order,
        'template': 'skill-prompt-guide',
        'title': card['title'],
        'subtitle': card['sub'],
        'aiTags': card['ai'],
    })
    if card.get('doc'):
        out['docTags'] = ['📎 ' + d for d in card['doc']]
    out['blocks'] = [
        step_block('STEP 1', card['s1']),
        step_block('STEP 2', card['s2'], images),
        {
            'type': 'section', 'badge': 'TIP', 'badgeTone': 'orange',
            'name': 'Tips & Result', 'desc': '결과 및 실무 팁',
            'boxes': [{'tone': 'subtle', 'text': card['tips']}],
        },
    ]
    return out

# ---- process cards ----
by_author = {}
for c in cards:
    by_author.setdefault(c['author'], []).append(c)

# remove deleted card 584:1628 (no longer on the board)
for p in [os.path.join(PROC, '584-1628.json'), os.path.join(ASSETS, '584-1628')]:
    if os.path.isdir(p):
        shutil.rmtree(p)
    elif os.path.exists(p):
        os.remove(p)

for author, lst in by_author.items():
    for i, c in enumerate(lst, 1):
        data = build_card(c, i)
        with open(os.path.join(PROC, fid(c['id']) + '.json'), 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write('\n')
    # index file
    files = [fid(c['id']) + '.json' for c in lst]
    if author == '이미애':
        groups = []
        for c in lst:
            g = c['group']
            if not groups or groups[-1]['label'] != g:
                groups.append({'label': g, 'files': []})
            groups[-1]['files'].append(fid(c['id']) + '.json')
        idx = {'sectionTitle': SECTION_TITLES[author], 'groups': groups}
    elif author in ('정현영', '이주희'):
        idx = files
    else:
        idx = {'sectionTitle': SECTION_TITLES[author], 'files': files}
    with open(os.path.join(PROC, f'index.{author}.json'), 'w', encoding='utf-8') as f:
        json.dump(idx, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(author, len(lst), 'cards')

# ---- radar tables ----
SUB = '각 프로젝트가 어떤 AI 스택으로 배포까지 진행되는지 한눈에 보는 현황판 프로젝트별 어떻게 어떤 AI를 사용하는지 공유해요'
COLS = ['연도', '월', '담당자', '프로젝트명', '현재 단계', '활용 중인 AI 스킬']
order = ['정현영', '이주희', '이미애', '하소진', '이민영']
for author in order:
    rows = []
    for y, m, proj, status, tools in radar[author]:
        rows.append({'cells': [
            {'text': y}, {'text': m}, {'text': author}, {'text': proj},
            {'tags': [{'label': status, 'kind': 'status'}]},
            {'tags': [{'label': t, 'kind': 'ai'} for t in tools]},
        ]})
    table = {'nodeId': radar['meta'][author], 'author': author, 'title': '프로젝트별 AI 스택 레이더',
             'subtitle': SUB, 'columns': COLS, 'rows': rows}
    with open(os.path.join(RADAR, f'{author}.json'), 'w', encoding='utf-8') as f:
        json.dump(table, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print('radar', author, len(rows), 'rows')
with open(os.path.join(RADAR, 'index.json'), 'w', encoding='utf-8') as f:
    json.dump(order, f, ensure_ascii=False)
    f.write('\n')
print('done')
