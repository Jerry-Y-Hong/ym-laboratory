#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json, sys
from collections import defaultdict
sys.stdout.reconfigure(encoding='utf-8')

with open('data/mfco_master_core_db.json', encoding='utf-8') as f:
    db = json.load(f)

herb_groups = defaultdict(list)
for r in db:
    herb_groups[r['식재료/약재']].append(r)

print(f'통합 완료: 총 {len(db)}행, {len(herb_groups)}종 약재')
print()
print('=== 오가피 최종 결과 ===')
for r in herb_groups['오가피']:
    print(f"  {r['원본효능']:15} | {r['표준기능']}")

print()
print('=== 약재당 효능 수 분포 ===')
cnt = sorted([len(v) for v in herb_groups.values()])
print(f'  최소: {cnt[0]}개, 최대: {cnt[-1]}개, 평균: {sum(cnt)/len(cnt):.1f}개')
for n in range(1, 11):
    c = sum(1 for x in cnt if x == n)
    if c > 0:
        print(f'  {n}개 효능: {c}종 약재')
over10 = sum(1 for x in cnt if x >= 10)
if over10:
    print(f'  10개+: {over10}종 약재')
