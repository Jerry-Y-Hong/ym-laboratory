#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MFCO 효능어 통합 스크립트
- 문자열 포함 관계 + 명시적 동의어/하위어 규칙 적용
- 상위어(더 구체적·포괄적) 효능어 하나로 통합
- 하위어 행의 데이터는 상위어 행 빈칸에 이전
"""
import json, sys
from collections import defaultdict
sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = 'data/mfco_master_core_db.json'

# ────────────────────────────────────────────────────
# 명시적 통합 규칙: {하위어: 상위어(유지할 효능어)}
# 하위어 행은 제거되고 상위어 행에 데이터 병합
# ────────────────────────────────────────────────────
MERGE_RULES = {
    # 근골/근력/骨 계열
    "강근골":       "강근장골",
    "건근골":       "강근장골",
    "장근골":       "강근장골",
    "보근골":       "강근장골",

    # 거풍 계열
    "거풍습":       "거풍제습",
    "거풍":         "거풍제습",
    "제습":         "거풍제습",
    "거풍산한":     "거풍제습",

    # 보간신 계열
    "보간신":       "보익간신",
    "보간":         "보익간신",
    "보신":         "보익간신",
    "익간신":       "보익간신",

    # 이수 계열
    "이수":         "이수소종",
    "이뇨":         "이수소종",
    "삼습이수":     "이수소종",

    # 청열 계열
    "청열":         "청열해독",
    "청열사화":     "청열해독",
    "청열조습":     "청열해독",
    "청열양혈":     "청열해독",
    "청열해표":     "청열해독",
    "청열명목":     "청열해독",

    # 활혈/어혈 계열
    "활혈":         "활혈화어",
    "화어":         "활혈화어",
    "산어":         "활혈화어",
    "산어혈":       "활혈화어",
    "축어":         "활혈화어",
    "파혈":         "활혈화어",

    # 지혈 계열
    "지혈":         "수렴지혈",
    "염혈지혈":     "수렴지혈",
    "凉혈지혈":     "수렴지혈",
    "양혈지혈":     "수렴지혈",

    # 해독 계열
    "해독":         "청열해독",
    "해열":         "청열해독",
    "청독":         "청열해독",

    # 보기 계열
    "보기":         "보기건비",
    "건비":         "보기건비",
    "익기":         "보기건비",
    "보비":         "보기건비",
    "건비화습":     "보기건비",

    # 안신 계열
    "안신":         "양심안신",
    "영심안신":     "양심안신",
    "보심안신":     "양심안신",
    "진심안신":     "양심안신",
    "중진안신":     "양심안신",

    # 지해 계열
    "지해":         "지해화담",
    "화담":         "지해화담",
    "거담":         "지해화담",
    "선폐지해":     "지해화담",
    "윤폐지해":     "지해화담",
    "청폐지해":     "지해화담",
    "강기지해":     "지해화담",

    # 보음/자음 계열
    "보음":         "자음윤조",
    "자음":         "자음윤조",
    "윤조":         "자음윤조",
    "양음":         "자음윤조",
    "자양":         "자음윤조",
    "자보간신":     "자음윤조",

    # 통경 계열
    "통경":         "활혈통경",
    "조경":         "활혈통경",
    "행기통경":     "활혈통경",
    "화혈통경":     "활혈통경",

    # 소종 계열
    "소종":         "소옹산결",
    "소옹":         "소옹산결",
    "산결":         "소옹산결",
    "산옹소종":     "소옹산결",

    # 건위/소화 계열
    "건위":         "건위소식",
    "소식":         "건위소식",
    "소도":         "건위소식",
    "화위":         "건위소식",

    # 보양/익정 계열
    "보양":         "보신장양",
    "장양":         "보신장양",
    "익정":         "보신익정",
    "보신고정":     "보신익정",
    "고정":         "보신익정",

    # 이기 계열
    "이기":         "이기해울",
    "행기":         "이기해울",
    "해울":         "이기해울",
    "소간이기":     "이기해울",

    # 발한/해표 계열
    "발한":         "발한해표",
    "해표":         "발한해표",
    "신온해표":     "발한해표",
    "신량해표":     "발한해표",
}

def get_canonical(term):
    """통합 규칙에 따라 대표 효능어 반환 (없으면 원본)"""
    return MERGE_RULES.get(term.strip(), term.strip())

def is_subterm_str(shorter, longer):
    """문자열 포함 관계: longer 가 shorter 를 시작 포함"""
    s = shorter.strip(); l = longer.strip()
    if s == l: return False
    return l.startswith(s) or (len(s) >= 2 and s in l)

def consolidate(dry_run=True):
    with open(DB_PATH, encoding='utf-8') as f:
        db = json.load(f)

    herb_groups = defaultdict(list)
    for idx, row in enumerate(db):
        herb_groups[row['식재료/약재']].append((idx, row))

    removed_indices = set()
    merge_log = []

    for herb, rows in herb_groups.items():
        # 각 행의 (인덱스, 원본효능, 대표효능)
        entries = [(idx, row['원본효능'], get_canonical(row['원본효능']), row)
                   for idx, row in rows]

        # ① 명시적 규칙: 하위어 → 상위어
        for i, (ii, ti, ci, ri) in enumerate(entries):
            for j, (ij, tj, cj, rj) in enumerate(entries):
                if ii == ij or ii in removed_indices: continue
                # ti의 canonical이 tj와 같으면 ti는 하위어
                if ci == tj and ti != tj:
                    if not dry_run:
                        for key in ['생리작용','작용기전','연결질환','조리권장','Flavor','표준기능']:
                            if not str(db[ij].get(key,'')).strip() and str(db[ii].get(key,'')).strip():
                                db[ij][key] = db[ii][key]
                    removed_indices.add(ii)
                    merge_log.append(f'[규칙] [{herb}] "{ti}" → "{tj}"')

        # ② 문자열 포함 관계
        for i, (ii, ti, ci, ri) in enumerate(entries):
            if ii in removed_indices: continue
            for j, (ij, tj, cj, rj) in enumerate(entries):
                if ii == ij or ii in removed_indices or ij in removed_indices: continue
                if is_subterm_str(ti, tj):
                    if not dry_run:
                        for key in ['생리작용','작용기전','연결질환','조리권장','Flavor','표준기능']:
                            if not str(db[ij].get(key,'')).strip() and str(db[ii].get(key,'')).strip():
                                db[ij][key] = db[ii][key]
                    removed_indices.add(ii)
                    merge_log.append(f'[포함] [{herb}] "{ti}" → "{tj}"')

    new_db = [row for idx, row in enumerate(db) if idx not in removed_indices]

    if dry_run:
        print(f'[미리보기] {len(db)}행 → {len(new_db)}행 (제거 {len(removed_indices)}행)')
        print()
        # 오가피 결과
        print('=== 오가피 통합 결과 ===')
        for log in merge_log:
            if '오가피' in log:
                print(f'  {log}')
        survivors = [r for idx, r in enumerate(db)
                     if r['식재료/약재']=='오가피' and idx not in removed_indices]
        print(f'\n  오가피 최종 {len(survivors)}개 효능:')
        for r in survivors:
            print(f"    ✅ {r['원본효능']:15} | {r['표준기능']}")

        print()
        print('=== 전체 통합 내역 (처음 30건) ===')
        for log in merge_log[:30]:
            print(f'  {log}')
        if len(merge_log) > 30:
            print(f'  ... 외 {len(merge_log)-30}건')
    else:
        # 백업 저장
        with open(DB_PATH.replace('.json','.backup_before_merge.json'),'w',encoding='utf-8') as f:
            json.dump(db, f, ensure_ascii=False, indent=2)
        with open(DB_PATH, 'w', encoding='utf-8') as f:
            json.dump(new_db, f, ensure_ascii=False, indent=2)
        print(f'✅ 완료: {len(db)}행 → {len(new_db)}행 (제거 {len(removed_indices)}행)')
        print(f'   백업: {DB_PATH.replace(".json",".backup_before_merge.json")}')
        for log in merge_log:
            print(f'  {log}')

if __name__ == '__main__':
    import sys
    dry = '--run' not in sys.argv
    consolidate(dry_run=dry)
    if dry:
        print('\n실제 적용하려면: python consolidate_v2.py --run')
