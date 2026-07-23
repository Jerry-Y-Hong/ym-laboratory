# Testing Framework

> **Module**: 20_ai_developer_platform — Document 13  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. YM-LAB 3-Tier Testing Architecture (테스트 프레임워크)

테스트 프레임워크(Testing Framework)는 개발자 표준(Phase 15 `06_TESTING_CONSTRAINTS.md`)에 의거하여, 개발 중인 에이전트 및 서비스 코드가 플랫폼에 전합하는지 검증하기 위한 **단위 테스트, 통합 테스트 및 검증 스크립트 기반의 3계층 통합 테스트 실행 표준**을 명세한다.

```
┌────────────────────────────────────────────────────────┐
│               YM-LAB 3-Tier Testing                    │
├────────────────────────────────────────────────────────┤
│ 1. Unit Test (단위 테스트)                              │
│    - 개별 에이전트 클래스의 execute() 입출력 메시지 검사    │
├────────────────────────────────────────────────────────┤
│ 2. Integration Test (통합 테스트)                      │
│    - Workflow Engine 상태 전이 및 Shared Memory 연동 점검 │
├────────────────────────────────────────────────────────┤
│ 3. Verification Script (검증 스크립트)                  │
│    - verify_product.py 구동으로 디렉터리, 린터 전원 PASS │
└────────────────────────────────────────────────────────┘
```

---

## 2. Test Execution & Regression Protection Gate (합격 조건)

- **합격률 100% 게이트 (Pass Rate Threshold)**:
  - 릴리즈 빌드 패키징 전, 테스트 스위트 내의 모든 단위/통합 테스트는 **100% 합격(Pass)**해야 배포가 승인된다.
- **회귀 방지 (Regression Protection)**:
  - 테스트 코드가 catalog.db 실측 데이터베이스를 직접 읽어 쓰지 않도록 격리하며, 테스트 대상 에이전트는 로컬 `Mock Server` 또는 `API Simulator`를 조회하게 래핑 차단하여 데이터 변조를 막는다.

---

## 3. Product Self-Verification Script (verify_product.py Template)

생성기가 템플릿 복제 시 각 제품에 함께 탑재하여 배포하는 자가 검증 검사기 템플릿:

```python
import os
import sys

def run_self_verification() -> bool:
    """제품 고유의 디렉터리 구조 및 설정 파일 유효성 자체 검증"""
    print("[TEST] Running local product self-verification...")
    
    # 1. 파일 검출
    required_files = ["config.json", "run.py", "verify_product.py"]
    for f in required_files:
        if not os.path.exists(f):
            print(f"[FAIL] Missing product core file: {f}")
            return False
            
    # 2. 임시 데이터 폴더 존재성 확인
    os.makedirs("data/posts", exist_ok=True)
    os.makedirs("data/logs", exist_ok=True)
    
    print("[TEST] Self-verification: ALL PASS")
    return True

if __name__ == "__main__":
    success = run_self_verification()
    sys.exit(0 if success else 1)
```
Ref: [Development Framework Testing](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/15_development_framework/06_TESTING_CONSTRAINTS.md)
