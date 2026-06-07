#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
mfco_master_core_db.json 구조 변환
다행(多行) 구조 → 1약재 1행 (효능/기능을 배열로)
"""
import json, sys
from collections import defaultdict, OrderedDict
sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = 'mfco-site/data/mfco_master_core_db.json'
OUT_PATH = 'mfco-site/data/mfco_master_core_db.json'

with open(DB_PATH, encoding='utf-8') as f:
    db = json.load(f)

# 약재별 그룹화 (순서 유지)
herb_groups = OrderedDict()
for row in db:
    name = row['식재료/약재']
    if name not in herb_groups:
        herb_groups[name] = []
    herb_groups[name].append(row)

new_db = []
for herb_name, rows in herb_groups.items():
    merged = {
        "식재료/약재": herb_name,
        "효능목록":    [r['원본효능']  for r in rows],
        "표준기능목록": [r.get('표준기능','')  for r in rows],
        "생리작용목록": [r.get('생리작용','')  for r in rows],
        "작용기전목록": [r.get('작용기전','')  for r in rows],
        "연결질환목록": [r.get('연결질환','')  for r in rows],
        "조리권장목록": [r.get('조리권장','')  for r in rows],
        "Flavor목록":  [r.get('Flavor','')    for r in rows],
        "설명목록":    [r.get('설명','')       for r in rows],
    }
    new_db.append(merged)

# 백업
with open(DB_PATH.replace('.json', '.multirow_backup.json'), 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

# 저장
with open(OUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(new_db, f, ensure_ascii=False, indent=2)

print(f'변환 완료: {len(db)}행 → {len(new_db)}행 (약재 1개당 1행)')
print()
print('=== 오가피 확인 ===')
ogapi = next(r for r in new_db if r['식재료/약재'] == '오가피')
print(f"  효능목록:    {ogapi['효능목록']}")
print(f"  표준기능목록: {ogapi['표준기능목록']}")
print(f"  연결질환목록: {ogapi['연결질환목록']}")
print(f"  조리권장목록: {ogapi['조리권장목록']}")
