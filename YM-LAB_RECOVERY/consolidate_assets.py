#!/usr/bin/env python3
"""
consolidate_assets.py
=====================
MFCO, NICS_DATA, sanYacho 프로젝트 자산을 YM-LAB_RECOVERY로 통합 복사.

절대 원칙:
  - 원본 파일은 삭제하지 않는다.
  - 복사만 수행한다.
  - 모든 파일의 SHA-256 해시를 catalog.db에 기록한다.
  - 파일명 충돌 시 _dupN 접미사를 붙여 보존한다.
"""

import hashlib
import json
import os
import shutil
import sqlite3
import uuid
import datetime

# ============================================================
# 설정
# ============================================================
RECOVERY_ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(RECOVERY_ROOT)  # YM-LAB_PROJECT_

# 프로젝트별 소스 디렉터리 (실제 경로로 수정 필요)
PROJECT_SOURCES = {
    "MFCO": [],       # discover 단계에서 자동 탐색
    "NICS_DATA": [],  # discover 단계에서 자동 탐색
    "sanYacho": [],   # discover 단계에서 자동 탐색
}

# 스캔 대상 확장자
TARGET_EXTENSIONS = {
    ".xlsx", ".csv", ".json", ".md", ".docx", ".pdf",
    ".txt", ".py", ".yml", ".yaml", ".sql", ".html",
    ".css", ".js", ".ts", ".tsx", ".jsx", ".env",
    ".toml", ".cfg", ".ini", ".db", ".sqlite",
}

# 프로젝트별 키워드 (파일 경로나 파일명에서 매칭)
PROJECT_KEYWORDS = {
    "MFCO": [
        "mfco", "master_functional", "core_ontology", "ontology",
        "ingredient", "recipe", "function_group", "master_db",
        "normalization", "dictionary", "mapping", "matrix",
        "knowledge", "term", "standard", "cause", "role",
        "state", "function", "nutrition", "translation",
    ],
    "NICS_DATA": [
        "nics", "농식품", "올바로", "식품안전", "food_safety",
        "haccp", "식품의약품", "nics_data", "api_data",
        "raw_repository", "standard_repository",
    ],
    "sanYacho": [
        "sanyacho", "산야초", "san_ya_cho", "vercel",
        "next.js", "nextjs", "herb", "wild_plant",
    ],
}

DB_PATH = os.path.join(RECOVERY_ROOT, "catalog.db")
MANIFEST_PATH = os.path.join(RECOVERY_ROOT, "MANIFEST.json")
REPORT_PATH = os.path.join(RECOVERY_ROOT, "consolidation_report.json")


# ============================================================
# DB 초기화
# ============================================================
def init_db(db_path: str) -> sqlite3.Connection:
    """catalog.db 초기화 (files 테이블 생성)."""
    conn = sqlite3.connect(db_path)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT UNIQUE NOT NULL,
            project TEXT NOT NULL,
            source_path TEXT NOT NULL,
            recovery_path TEXT NOT NULL,
            filename TEXT NOT NULL,
            extension TEXT,
            size_bytes INTEGER,
            sha256 TEXT NOT NULL,
            copied_at TEXT NOT NULL,
            is_duplicate INTEGER DEFAULT 0,
            duplicate_of TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS trace_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            action TEXT NOT NULL,
            project TEXT,
            source_path TEXT,
            recovery_path TEXT,
            status TEXT,
            message TEXT
        )
    """)
    conn.commit()
    return conn


# ============================================================
# 유틸리티
# ============================================================
def compute_sha256(filepath: str) -> str:
    """파일의 SHA-256 해시 계산."""
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def generate_uid(project: str, filepath: str) -> str:
    """UUID-v5 기반 고유 ID 생성."""
    namespace = uuid.UUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")  # URL namespace
    name = f"{project}:{filepath}"
    return f"{project}-{uuid.uuid5(namespace, name).hex[:12]}"


def classify_file(filepath: str) -> str | None:
    """파일 경로를 키워드 매칭으로 프로젝트에 분류. 매칭 안 되면 None."""
    path_lower = filepath.lower().replace("\\", "/")
    for project, keywords in PROJECT_KEYWORDS.items():
        for kw in keywords:
            if kw.lower() in path_lower:
                return project
    return None


def now_iso() -> str:
    return datetime.datetime.now().isoformat()


# ============================================================
# Phase 1: Discover (전수 탐색)
# ============================================================
def discover(scan_roots: list[str]) -> dict[str, list[str]]:
    """
    지정된 루트 디렉터리들을 순회하며 프로젝트별 파일 목록을 생성.
    Recovery 폴더 자체는 스캔에서 제외.
    """
    results: dict[str, list[str]] = {"MFCO": [], "NICS_DATA": [], "sanYacho": [], "_UNCLASSIFIED": []}

    for root in scan_roots:
        if not os.path.isdir(root):
            print(f"  [SKIP] 디렉터리 없음: {root}")
            continue

        for dirpath, dirnames, filenames in os.walk(root):
            # Recovery 폴더 자신은 제외
            if "YM-LAB_RECOVERY" in dirpath:
                continue

            for fname in filenames:
                fpath = os.path.join(dirpath, fname)
                ext = os.path.splitext(fname)[1].lower()

                if ext not in TARGET_EXTENSIONS:
                    continue

                project = classify_file(fpath)
                if project:
                    results[project].append(fpath)
                else:
                    results["_UNCLASSIFIED"].append(fpath)

    return results


# ============================================================
# Phase 2: Copy (복사)
# ============================================================
def copy_files(
    conn: sqlite3.Connection,
    project: str,
    file_list: list[str],
    recovery_root: str,
) -> dict:
    """
    파일을 recovery 폴더로 복사하고, catalog.db에 기록.
    """
    stats = {"copied": 0, "duplicates": 0, "errors": 0, "skipped": 0}
    target_dir = os.path.join(recovery_root, project)
    os.makedirs(target_dir, exist_ok=True)

    # 기존 해시 목록 로드 (중복 탐지용)
    existing_hashes = {}
    for row in conn.execute("SELECT sha256, recovery_path FROM files WHERE project = ?", (project,)):
        existing_hashes[row[0]] = row[1]

    for src in file_list:
        try:
            if not os.path.isfile(src):
                stats["skipped"] += 1
                continue

            sha = compute_sha256(src)
            uid = generate_uid(project, src)
            fname = os.path.basename(src)
            ext = os.path.splitext(fname)[1].lower()
            size = os.path.getsize(src)

            # 중복 확인
            is_dup = 0
            dup_of = None
            if sha in existing_hashes:
                is_dup = 1
                dup_of = existing_hashes[sha]
                stats["duplicates"] += 1

            # 상대 경로 보존
            rel_path = os.path.relpath(src, PROJECT_ROOT)
            dest = os.path.join(target_dir, rel_path)

            # 파일명 충돌 해결
            if os.path.exists(dest):
                base, extension = os.path.splitext(dest)
                counter = 1
                while os.path.exists(dest):
                    dest = f"{base}_dup{counter}{extension}"
                    counter += 1

            os.makedirs(os.path.dirname(dest), exist_ok=True)
            shutil.copy2(src, dest)

            # DB 기록
            conn.execute("""
                INSERT OR IGNORE INTO files
                (uid, project, source_path, recovery_path, filename, extension,
                 size_bytes, sha256, copied_at, is_duplicate, duplicate_of)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (uid, project, src, dest, fname, ext, size, sha, now_iso(), is_dup, dup_of))

            conn.execute("""
                INSERT INTO trace_log (timestamp, action, project, source_path, recovery_path, status, message)
                VALUES (?, 'COPY', ?, ?, ?, 'OK', ?)
            """, (now_iso(), project, src, dest, f"SHA256={sha[:16]}..."))

            if sha not in existing_hashes:
                existing_hashes[sha] = dest

            stats["copied"] += 1

        except Exception as e:
            stats["errors"] += 1
            conn.execute("""
                INSERT INTO trace_log (timestamp, action, project, source_path, recovery_path, status, message)
                VALUES (?, 'COPY', ?, ?, '', 'ERROR', ?)
            """, (now_iso(), project, src, str(e)))

    conn.commit()
    return stats


# ============================================================
# Phase 3: Report 생성
# ============================================================
def generate_report(conn: sqlite3.Connection, all_stats: dict, report_path: str):
    """consolidation_report.json 생성."""
    report = {
        "generated_at": now_iso(),
        "summary": {},
        "per_project": {},
    }

    total_copied = 0
    total_dups = 0
    total_errors = 0

    for project, stats in all_stats.items():
        report["per_project"][project] = stats
        total_copied += stats.get("copied", 0)
        total_dups += stats.get("duplicates", 0)
        total_errors += stats.get("errors", 0)

    # DB에서 통계 추출
    row = conn.execute("SELECT COUNT(*), SUM(size_bytes) FROM files").fetchone()
    total_files = row[0] or 0
    total_size = row[1] or 0

    report["summary"] = {
        "total_files_in_db": total_files,
        "total_copied": total_copied,
        "total_duplicates": total_dups,
        "total_errors": total_errors,
        "total_size_bytes": total_size,
        "total_size_mb": round(total_size / (1024 * 1024), 2) if total_size else 0,
    }

    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"\n[OK] 보고서 생성 완료: {report_path}")
    return report


# ============================================================
# Phase 4: MANIFEST 업데이트
# ============================================================
def update_manifest(conn: sqlite3.Connection, manifest_path: str, all_stats: dict):
    """MANIFEST.json 업데이트."""
    if os.path.exists(manifest_path):
        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)
    else:
        manifest = {"schema_version": "1.0", "projects": {}}

    manifest["last_updated"] = now_iso()

    # 통계 업데이트
    row = conn.execute("SELECT COUNT(*), SUM(size_bytes) FROM files").fetchone()
    manifest["statistics"] = {
        "total_files_discovered": row[0] or 0,
        "total_files_copied": sum(s.get("copied", 0) for s in all_stats.values()),
        "total_duplicates": sum(s.get("duplicates", 0) for s in all_stats.values()),
        "total_size_bytes": row[1] or 0,
    }

    # 프로젝트별 상태 업데이트
    for project in ["MFCO", "NICS_DATA", "sanYacho"]:
        if project in manifest.get("projects", {}):
            p_count = conn.execute(
                "SELECT COUNT(*) FROM files WHERE project = ?", (project,)
            ).fetchone()[0]
            manifest["projects"][project]["status"] = "DISCOVERED" if p_count > 0 else "PENDING"
            manifest["projects"][project]["file_count"] = p_count

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f"[OK] MANIFEST.json 업데이트 완료: {manifest_path}")


# ============================================================
# 메인 실행
# ============================================================
def main():
    print("=" * 60)
    print("  YM-LAB_RECOVERY 통합 자산 복사 스크립트")
    print("=" * 60)
    print()

    # 1. DB 초기화
    print("[1/5] catalog.db 초기화...")
    conn = init_db(DB_PATH)
    print(f"  → {DB_PATH}")

    # 2. 스캔 대상 루트 설정
    scan_roots = [
        PROJECT_ROOT,  # g:/내 드라이브/YM-LAB_PROJECT_
    ]

    # 3. Discover
    print("\n[2/5] 전수 탐색 (Discover)...")
    discovered = discover(scan_roots)
    for project, files in discovered.items():
        print(f"  → {project}: {len(files)}개 파일 발견")

    # 4. Copy
    print("\n[3/5] 파일 복사 (Copy)...")
    all_stats = {}
    for project in ["MFCO", "NICS_DATA", "sanYacho"]:
        files = discovered.get(project, [])
        if not files:
            print(f"  → {project}: 복사 대상 없음 (건너뜀)")
            all_stats[project] = {"copied": 0, "duplicates": 0, "errors": 0, "skipped": 0}
            continue

        print(f"  → {project}: {len(files)}개 파일 복사 중...")
        stats = copy_files(conn, project, files, RECOVERY_ROOT)
        all_stats[project] = stats
        print(f"    복사={stats['copied']}, 중복={stats['duplicates']}, 오류={stats['errors']}")

    # 5. Report & Manifest
    print("\n[4/5] 보고서 생성...")
    generate_report(conn, all_stats, REPORT_PATH)

    print("\n[5/5] MANIFEST.json 업데이트...")
    update_manifest(conn, MANIFEST_PATH, all_stats)

    conn.close()

    print("\n" + "=" * 60)
    print("  통합 복사 완료!")
    print("=" * 60)


if __name__ == "__main__":
    main()
