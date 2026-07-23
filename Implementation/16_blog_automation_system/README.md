# YM-LAB Kimchi Blog Automation System

> **Module**: 16_blog_automation_system  
> **Version**: `v1.2`  
> **Status**: ✅ COMPLETED — Kimchi Blog Automation System : Closed & Frozen  

---

## Overview

본 디렉터리는 YM-LAB PROJECT의 첫 번째 상용급 실천 애플리케이션인 **김치 블로그 자동화 시스템(Kimchi Blog Automation System)**의 아키텍처 설계 및 구성 명세서셋을 포함한다.

본 시스템은 외부 CMS나 범용 플랫폼에 얽매이지 않고, 한식 교육 및 약선 영양 정보의 무결성(Integrity)을 수호하며 지식을 기획, 생성, 검증, 발행하는 일련의 로컬 E2E 자동화 파이프라인으로 동작한다.

---

## Document Index

| # | 문서명 | 설명 |
| :--- | :--- | :--- |
| 01 | [01_SYSTEM_ARCHITECTURE.md](./01_SYSTEM_ARCHITECTURE.md) | 온톨로지 RAG 기반 로컬 수집, 블로그 파이프라인의 시스템 아키텍처 |
| 02 | [02_CONTENT_PLANNER.md](./02_CONTENT_PLANNER.md) | Q-Code 기반 식재료 매핑, 키워드 추출 및 콘텐츠 타겟팅 기획 규격 |
| 03 | [03_CONTENT_GENERATION_ENGINE.md](./03_CONTENT_GENERATION_ENGINE.md) | 카드뉴스, e-book, PDF 생성을 포괄하는 다용도 콘텐츠 생성 스키마 설계 |
| 04 | [04_MEDIA_MANAGER.md](./04_MEDIA_MANAGER.md) | 이미지, 동영상, 썸네일, 아이콘 등의 자산 바인딩 및 alt 생성 규칙 |
| 05 | [05_SEO_ENGINE.md](./05_SEO_ENGINE.md) | 키워드 밀도, 가독성, 태그 계층 정적 분석 지표 및 보고서 스키마 |
| 06 | [06_QUALITY_VALIDATOR.md](./06_QUALITY_VALIDATOR.md) | 팩트 체크 외에 SEO 품질, 문법 검사, 브랜드 일관성 및 중복 콘텐츠 검증 규칙 |
| 07 | [07_PUBLISHING_MANAGER.md](./07_PUBLISHING_MANAGER.md) | FIFO JSON 큐 설계, 발행 스케줄링(KST 09:00/20:00) 및 순수 발행 준비(Preparation) 역할 한정 |
| 08 | [08_AUTOMATION_PIPELINE.md](./08_AUTOMATION_PIPELINE.md) | 7단계 로컬 파이프라인 단방향 결합 및 중간 실패 시 임시 격리(`data/failed`) 롤백 규칙 |
| 09 | [09_PROJECT_STRUCTURE.md](./09_PROJECT_STRUCTURE.md) | Phase 15 개발 표준을 준수한 실제 모듈 패키지 구조 및 파일 매핑 |
| 10 | [10_IMPLEMENTATION_ROADMAP.md](./10_IMPLEMENTATION_ROADMAP.md) | 타 식품군 확장 계획, 상용 SaaS화 기술 로드맵 및 최종 완료 보고서 |
| 11 | [11_CONFIGURATION.md](./11_CONFIGURATION.md) | `config.json` 구조, 모델 및 SQLite/JSON 경로 설정, 프롬프트 파라미터 세팅 |

---

## Core Targets & Guidelines

1. **Category Expansion Capability**: 모든 핵심 구현 로직은 하드코딩 대신 `Q-Code` 식별자를 런타임에 바인딩하여 김치 이외의 곡류, 버섯류 등 타 식재료 카테고리로 100% 즉시 확장 가능하도록 설계됨.
2. **Comprehensive Validation Gate**: 영양소 팩트체크 외에 중복 콘텐츠 체크, 맞춤법 검사, 브랜드 일관성을 포함하는 다차원 품질 관문을 통과해야만 발행 준비 완료로 인출 허용.
3. **Publishing Preparation Boundary**: 외부 채널과의 직접 원격 API 업로드는 플랫폼 종속적이므로 본 아키텍처 범위에서는 격리 배제하고, 로컬 발행 대기열 적재(FIFO) 및 Ready 디렉터리 배포까지만 전담함.
4. **Compliance & Implementation Guide**:
   > *All future implementations should follow this framework whenever applicable. The framework serves as the standard development guideline for the YM-LAB Project.*
5. **Architecture Stability Principle**:
   > *The operating framework must remain stable even if AI models, tools or vendors are replaced in the future.*
