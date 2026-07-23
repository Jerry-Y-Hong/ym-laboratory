# Dev Container Specification

> **Module**: 20_ai_developer_platform — Document 19  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Development Container Environment (개발 컨테이너 규격)

개발 컨테이너(Dev Container)는 다수의 개발자 및 파트너사가 각자 다른 OS(Windows, macOS, Linux 등)와 파이썬 런타임 환경으로 인해 발생하는 일관성 붕괴 문제를 예방하기 위해, **VS Code Dev Container 표준 및 Docker 컨테이너 기술을 활용하여 획일화된 격리 가상 개발 공간을 원클릭 구성 및 배포하기 위한 환경 규격**이다.

```
 B2B Developer Local Workspace
               │
               ▼ (VS Code 'Reopen in Container' 실행)
   [.devcontainer/devcontainer.json 분석]
               │
               ▼
     [Docker Image 빌드 및 격리 마운트]
               │
               ▼
    [Platform SDK & Python 3.10 가상환경 자동 셋업]
               │
               ▼
 [ymlab-cli CLI 도구 자동 터미널 로드 완료 및 개발 시작]
```

---

## 2. VS Code Integration & Extensions Settings

- **개발 생산성 도구 자동 배포**:
  - 컨테이너 기동과 함께 VS Code 환경에 파이썬 분석 린터(Ruff, Pylance), 마크다운 뷰어 및 SQLite 데이터베이스 탐색기 확장이 자동 설치되어 개발 속도를 배가한다.
- **포트 포워딩**:
  - 로컬 테스트 및 API 시뮬레이터 가동을 위해 `8000` (게이트웨이 모의 포트) 및 `8080` (모니터링 대시보드 모의 포트) 포트 포워딩이 컨테이너 정의 레벨에서 사전에 확보된다.

---

## 3. VS Code `devcontainer.json` Specification

```json
{
  "name": "YM-LAB AI Developer Platform",
  "dockerFile": "Dockerfile",
  "settings": {
    "python.defaultInterpreterPath": "/usr/local/bin/python",
    "python.linting.enabled": true,
    "python.linting.pylintEnabled": false,
    "python.formatting.provider": "black"
  },
  "extensions": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "qwtel.sqlite-viewer",
    "yzhang.markdown-all-in-one"
  ],
  "forwardPorts": [8000, 8080],
  "postCreateCommand": "pip install --upgrade pip && pip install -r requirements-dev.txt && pip install -e .",
  "remoteUser": "vscode"
}
```
Ref: [Local Development Environment](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/20_ai_developer_platform/08_LOCAL_DEVELOPMENT_ENVIRONMENT.md) (Linked for context)
