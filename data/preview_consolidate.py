#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json, sys
from collections import defaultdict
sys.stdout.reconfigure(encoding='utf-8')

with open('data/mfco_master_core_db.json', encoding='utf-8') as f:
    db = json.load(f)

def is_subterm(shorter, longer):
    s = shorter.strip(); l = longer.strip()
    if s == l: return False
    if l.startswith(s) or s in l: return True
    return False

# 오가피 미리보기
ogapi = [r for r in db if r['식재료/약재'] == '오가피']
terms = [r['원본효능'] for r in ogapi]
print('=== 오가피 현재 8개 효능 ===')
for r in ogapi:
    print(f"  {r['원본효능']:15} | {r['표준기능']}")

print()
print('=== 통합 후 예상 ===')
to_remove = set()
for i,ti in enumerate(terms):
    for j,tj in enumerate(terms):
        if i!=j and i not in to_remove and j not in to_remove:
            if is_subterm(ti,tj):
                to_remove.add(i)
                print(f'  제거: "{ti}"  →  상위어 "{tj}" 로 통합')

survivors = [r for i,r in enumerate(ogapi) if i not in to_remove]
print()
print(f'최종 {len(survivors)}개 효능:')
for r in survivors:
    print(f"  ✅ {r['원본효능']:15} | {r['표준기능']}")

# 전체 예상
print()
herb_groups = defaultdict(list)
for idx, row in enumerate(db):
    herb_groups[row['식재료/약재']].append((idx, row))
total_remove = 0
for herb, rows in herb_groups.items():
    terms2 = [(idx, row['원본효능']) for idx, row in rows]
    removed = set()
    for i,(ii,ti) in enumerate(terms2):
        for j,(jj,tj) in enumerate(terms2):
            if i!=j and ii not in removed and jj not in removed:
                if is_subterm(ti,tj):
                    removed.add(ii)
    total_remove += len(removed)
print(f'전체 예상: {len(db)}행 → {len(db)-total_remove}행 (제거 {total_remove}행)')
