# Deployment Container

> **Module**: 19_ai_product_ecosystem — Document 08  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Sandbox Isolation & Local Staging Deployment (컨테이너 및 샌드박스)

배포 컨테이너(Deployment Container)는 배포 포털에서 획득한 제품 ZIP 번들을 로컬 개발/스테이징 디바이스 환경에 압축 해제하고, **타제품이나 시스템 주요 영역과의 리소스 간섭 없이 안전하게 가동되도록 런타임 환경을 물리 격리하는 로컬 보안 샌드박스 가이드**이다.

```
       [Distribution Portal에서 signed_download_url 수신]
                               │
                               ▼
   [data/staging/{product_id}/ 격리 디렉터리 생성]
                               │
                               ▼
               [ZIP 번들 압축 해제 및 압축 파일 소거]
                               │
                               ▼
       [의존성 샌드박스(platform_libs/) 심볼릭 링크 점검]
                               │
                               ▼
                [verify_product.py 자가 린트 검사]
                               │
                               ▼
            [run.py 스케줄러 프로세스 Background 백그라운드 기동]
```

---

## 2. Directory Layout & Sandbox Security Controls

- **완벽한 소스 격리**:
  - 각 배포 서비스는 `data/staging/{product_id}/` 단일 서브폴더 내부로만 자신의 모든 R/W 파일을 격리 통제한다. 타제품 디렉터리에 대한 무단 접근(`../`) 시도가 포착되면 실행 프로세스를 샌드박스가 즉시 강제 킬(Kill) 종료한다.
- **가상 환경 격리**:
  - 샌드박스는 제품 빌드 실행 전 `platform_libs/` 내에 내장된 패키지 외의 글로벌 파이썬 패키지를 무단 임포트하지 못하도록 `sys.path` 지정을 로컬 실행 폴더 범위로 엄격히 고정한다.

---

## 3. Deployment Run Script Template (run.py)

```python
import os
import sys

# 1. 샌드박스 실행 경로 강제 고정 (보안 격리 수칙)
SANDBOX_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(SANDBOX_DIR)
sys.path.insert(0, os.path.join(SANDBOX_DIR, 'platform_libs'))

# 2. 로컬 설정 검증
if not os.path.exists("config.json"):
    print("[ERROR] Sandbox config.json is missing. Aborting.")
    sys.exit(1)

# 3. 로컬 린트 및 팩토리 검증 구동
from verify_product import run_self_verification
if not run_self_verification():
    print("[ERROR] Product verification failed inside sandbox. Aborting.")
    sys.exit(1)

# 4. 백그라운드 스케줄러 기동
from scheduler.main_scheduler import start_scheduler
print(f"[INFO] Launching sandbox container for product: {SANDBOX_DIR}")
start_scheduler()
```
Ref: [Product Template Skeleton](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/18_ai_product_factory/03_PRODUCT_TEMPLATE_SPECIFICATION.md)
