#!/usr/bin/env python3
"""
verify_consolidation.py
=======================
catalog.db와 실제 복사본을 대조하여 무결성 검증.

검증 항목:
  1. catalog.db에 기록된 모든 파일이 recovery 경로에 존재하는지
  2. 복사된 파일의 SHA-256이 원본과 동일한지
  3. 원본 파일이 아직 존재하는지 (삭제되지 않았는지)
"""

import hashlib
import json
import os
import sqlite3
import datetime


RECOVERY_ROOT = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(RECOVERY_ROOT, "catalog.db")
VERIFY_REPORT_PATH = os.path.join(RECOVERY_ROOT, "verification_report.json")


def compute_sha256(filepath: str) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def verify():
    print("=" * 60)
    print("  YM-LAB_RECOVERY 통합 검증 스크립트")
    print("=" * 60)
    print()

    if not os.path.exists(DB_PATH):
        print("[ERROR] catalog.db가 존재하지 않습니다. 먼저 consolidate_assets.py를 실행하세요.")
        return

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    rows = conn.execute("SELECT * FROM files").fetchall()
    total = len(rows)

    if total == 0:
        print("[INFO] catalog.db에 기록된 파일이 없습니다.")
        conn.close()
        return

    print(f"[INFO] 총 {total}개 파일 검증 시작...\n")

    results = {
        "verified_at": datetime.datetime.now().isoformat(),
        "total_files": total,
        "pass": 0,
        "fail": 0,
        "warnings": 0,
        "details": [],
    }

    for row in rows:
        entry = {
            "uid": row["uid"],
            "project": row["project"],
            "source": row["source_path"],
            "recovery": row["recovery_path"],
            "expected_sha256": row["sha256"],
            "checks": {},
        }

        # CHECK 1: recovery 경로에 파일 존재 여부
        if os.path.isfile(row["recovery_path"]):
            entry["checks"]["recovery_exists"] = "PASS"
        else:
            entry["checks"]["recovery_exists"] = "FAIL"
            results["fail"] += 1
            results["details"].append(entry)
            continue

        # CHECK 2: SHA-256 일치 여부
        actual_sha = compute_sha256(row["recovery_path"])
        if actual_sha == row["sha256"]:
            entry["checks"]["hash_match"] = "PASS"
        else:
            entry["checks"]["hash_match"] = "FAIL"
            entry["actual_sha256"] = actual_sha
            results["fail"] += 1
            results["details"].append(entry)
            continue

        # CHECK 3: 원본 파일 존재 여부 (경고만)
        if os.path.isfile(row["source_path"]):
            entry["checks"]["source_exists"] = "PASS"
        else:
            entry["checks"]["source_exists"] = "WARNING"
            results["warnings"] += 1

        results["pass"] += 1

    conn.close()

    # 보고서 출력
    print("-" * 40)
    print(f"  PASS    : {results['pass']}")
    print(f"  FAIL    : {results['fail']}")
    print(f"  WARNING : {results['warnings']}")
    print(f"  TOTAL   : {results['total_files']}")
    print("-" * 40)

    if results["fail"] == 0:
        print("\n[PASS] 검증 완료: 모든 파일이 정상적으로 복사되었습니다.")
    else:
        print(f"\n[FAIL] 검증 실패: {results['fail']}개 파일에서 문제가 발견되었습니다.")
        for d in results["details"]:
            print(f"  - [{d['project']}] {d['source']}")
            for k, v in d["checks"].items():
                if v != "PASS":
                    print(f"    → {k}: {v}")

    # JSON 보고서 저장
    with open(VERIFY_REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n[OK] 검증 보고서 저장: {VERIFY_REPORT_PATH}")


if __name__ == "__main__":
    verify()
