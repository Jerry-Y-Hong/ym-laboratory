# CLI System

> **Module**: 20_ai_developer_platform — Document 04  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Developer CLI Specifications (ymlab-cli)

CLI 시스템(CLI System)은 개발자가 로컬 터미널에서 신규 프로젝트 생성, 팩토리 빌드, 로컬 샌드박스 테스팅, 패키징 및 라이선스 확인 작업을 쉘 명령어 기반으로 즉각 완수할 수 있게 돕는 **플랫폼 명령 인터페이스 도구**이다.

```
 B2B Developer Terminal
       │
       ├──> $ ymlab-cli init [blueprint.json]  ──> 06_PROJECT_GENERATOR 가동
       │
       ├──> $ ymlab-cli verify                 ──> 13_TESTING_FRAMEWORK 린트
       │
       ├──> $ ymlab-cli run [product_id]       ──> 09_LOCAL_RUNTIME 구동
       │
       └──> $ ymlab-cli package                ──> 18_BUILD_PIPELINE 아카이빙
```

---

## 2. Command Specs & Arguments

- **`ymlab-cli init <blueprint_path>`**:
  - 지정한 블루프린트 구성 파일을 해독하여, `Template Library`로부터 타겟 구조 폴더 트리를 현재 디렉터리에 복제 생성한다.
- **`ymlab-cli verify`**:
  - 로컬 디렉터리의 정합성(PEP 8, 파일 존재성, API 스키마)을 모의 검증하고 결과를 터미널에 요약 출력한다.
- **`ymlab-cli run <product_id>`**:
  - 지정된 로컬 컨테이너 샌드박스를 백그라운드로 올리고 모의 로깅 모니터링 모드로 진입한다.
- **`ymlab-cli package`**:
  - 린트 및 보안 검사 통과 시 ZIP 번들과 SHA-256 해시 JSON을 출력한다.

---

## 3. CLI Argument Parser Design (Python Example)

```python
import argparse
import sys

def main():
    parser = argparse.ArgumentParser(prog="ymlab-cli", description="YM-LAB Developer Platform CLI")
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")
    
    # 1. init command
    init_parser = subparsers.add_parser("init", help="Initialize a new product skeleton")
    init_parser.add_argument("blueprint", type=str, help="Path to blueprint.json")
    
    # 2. verify command
    subparsers.add_parser("verify", help="Run local code and schema verification")
    
    # 3. run command
    run_parser = subparsers.add_parser("run", help="Run product in local sandbox")
    run_parser.add_argument("product_id", type=str, help="Product identifier")
    
    # 4. package command
    subparsers.add_parser("package", help="Build and package product archive")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(0)
        
    print(f"[ymlab-cli] Executing command: {args.command}")
    # 커맨드 디스패처 연동 로직...
```
- **안전한 종료 제약**:
  - CLI 명령어 실행 결과 성공 시 `exit 0`을, 에러 발생 시 세부 에러 성격에 따른 고유 에러 코드(`exit 1` 등)를 터미널로 명확히 에코 출력함으로써 CI/CD 자동화 젠킨스/액션 러너 파이프라인에서 오류 전파 빌드 중단 처리가 유기적으로 맞물리게 관리한다.
Ref: [Generation Workflow](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/18_ai_product_factory/06_GENERATION_WORKFLOW.md)
