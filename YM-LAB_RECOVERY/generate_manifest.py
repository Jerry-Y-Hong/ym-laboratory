"""
MANIFEST.json - YM-LAB_RECOVERY 통합 매니페스트
"""
import json
import os

MANIFEST = {
    "schema_version": "1.0",
    "recovery_name": "YM-LAB_RECOVERY",
    "description": "MFCO, NICS_DATA, sanYacho 프로젝트 자산 통합 복원 저장소",
    "created_at": "",
    "last_updated": "",
    "projects": {
        "MFCO": {
            "description": "Master Functional Core Ontology - 기능성 원료 온톨로지",
            "source_roots": [],
            "recovery_path": "MFCO/",
            "status": "PENDING"
        },
        "NICS_DATA": {
            "description": "농식품올바로(NICS) 데이터셋",
            "source_roots": [],
            "recovery_path": "NICS_DATA/",
            "status": "PENDING"
        },
        "sanYacho": {
            "description": "산야초 웹 프로젝트",
            "origin": {
                "github": "https://github.com/Jerry-Y-Hong/sanYacho",
                "vercel": "",
                "local": ""
            },
            "deployment": {
                "status": "Production",
                "last_verified": "",
                "framework": ""
            },
            "recovery_path": "sanYacho/",
            "status": "PENDING"
        }
    },
    "statistics": {
        "total_files_discovered": 0,
        "total_files_copied": 0,
        "total_duplicates": 0,
        "total_size_bytes": 0
    }
}

if __name__ == "__main__":
    manifest_path = os.path.join(os.path.dirname(__file__), "MANIFEST.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(MANIFEST, f, ensure_ascii=False, indent=2)
    print(f"[OK] MANIFEST.json 생성 완료: {manifest_path}")
