#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MFCO 약재별 중복/포함 효능어 통합 스크립트
규칙: 상위(더 구체적) 효능어가 있으면 하위(더 짧은) 효능어 행을 제거
      단, 하위 행에만 있는 생리작용/기전 데이터는 상위 행으로 이전
"""

import json, sys, re
sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = 'data/mfco_master_core_db.json'

def is_subterm(shorter, longer):
    """shorter 가 longer 의 하위 개념(포함)인지 판별"""
    s = shorter.strip()
    l = longer.strip()
    if s == l:
        return False
    # 직접 포함: longer가 shorter로 시작하거나 shorter를 포함
    if l.startswith(s) or s in l:
        return True
    return False

def merge_rows(base_row, sub_row):
    """sub_row 의 비어있지 않은 데이터를 base_row 빈칸에 채움"""
    for key in ['생리작용','작용기전','연결질환','조리권장','Flavor','표준기능']:
        if not str(base_row.get(key,'')).strip() and str(sub_row.get(key,'')).strip():
            base_row[key] = sub_row[key]
    return base_row

def consolidate():
    with open(DB_PATH, encoding='utf-8') as f:
        db = json.load(f)

    # 백업
    with open(DB_PATH.replace('.json', '.backup2.json'), 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

    # 약재별로 그룹화
    from collections import defaultdict
    herb_groups = defaultdict(list)
    for idx, row in enumerate(db):
        herb_groups[row['식재료/약재']].append((idx, row))

    removed_indices = set()
    merge_log = []

    for herb, rows in herb_groups.items():
        terms = [(idx, row['원본효능'], row) for idx, row in rows]

        # 쌍별로 포함관계 체크
        for i in range(len(terms)):
            for j in range(len(terms)):
                if i == j:
                    continue
                idx_i, term_i, row_i = terms[i]
                idx_j, term_j, row_j = terms[j]

                # term_i 가 term_j 의 하위어(더 짧고 포함됨) → term_i 제거, term_j 유지
                if idx_i not in removed_indices and idx_j not in removed_indices:
                    if is_subterm(term_i, term_j):
                        # term_j(상위)에 term_i(하위) 데이터 병합
                        db[idx_j] = merge_rows(db[idx_j], db[idx_i])
                        removed_indices.add(idx_i)
                        merge_log.append(
                            f'  [{herb}] "{term_i}" → "{term_j}" 으로 통합 (행 {idx_i+2} 제거)'
                        )

    # 제거 대상 빼고 재구성
    new_db = [row for idx, row in enumerate(db) if idx not in removed_indices]

    print(f'원본: {len(db)}행')
    print(f'통합 후: {len(new_db)}행  (제거: {len(removed_indices)}행)')
    print(f'\n=== 통합 내역 ({len(merge_log)}건) ===')
    for log in merge_log:
        print(log)

    # 저장
    with open(DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(new_db, f, ensure_ascii=False, indent=2)
    print(f'\n✅ 저장 완료: {DB_PATH}')

if __name__ == '__main__':
    consolidate()
